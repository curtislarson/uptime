import { check } from "./check.ts";
import { EmailService } from "./email.ts";
import { UptimeKv } from "./kv.ts";
import { logger } from "./logger.ts";

// Every 10 minutes
const URL_CHECK_SCHEDULE = "*/10 * * * *";

export function startCronJob(kv: UptimeKv, email: EmailService) {
  logger.info(`Initializing cron at schedule: '${URL_CHECK_SCHEDULE}'`);

  Deno.cron("Uptime URL Checker", URL_CHECK_SCHEDULE, async () => {
    const urls = await kv.getUrls();

    logger.info(`Checking ${urls.length} urls.`);

    const results = await Promise.allSettled(urls.map(async (url) => {
      const result = await check(url);
      await kv.addCheckResponse(url, result);
      return {
        url,
        result,
      };
    }));

    for (const result of results) {
      if (result.status === "rejected") {
        logger.info(`Failed due to rejected promise: ${result.reason}`);
      } else {
        const checkResult = result.value;
        logger.info(
          checkResult.result,
          `Check result for '${checkResult.url.name}`,
        );

        if (!checkResult.result.ok) {
          await email.sendFailureEmail(checkResult.result, checkResult.url);
        }
      }
    }
  });
}
