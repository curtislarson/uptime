import { check } from "./check.ts";
import { UptimeKv } from "./kv.ts";
import { log } from "./logger.ts";

// Every 10 minutes
const URL_CHECK_SCHEDULE = "*/10 * * * *";

export function startCronJob(kv: UptimeKv) {
  log(`Initializing cron at schedule: '${URL_CHECK_SCHEDULE}'`);

  Deno.cron("Uptime URL Checker", URL_CHECK_SCHEDULE, async () => {
    const urls = await kv.getUrls();

    log(`Checking ${urls.length} urls.`);

    const results = await Promise.allSettled(urls.map(async (url) => {
      const result = await check(url);
      return {
        url,
        result,
      };
    }));

    for (const result of results) {
      if (result.status === "rejected") {
        log(`Failed due to rejected promise: ${result.reason}`);
      } else {
        const checkResult = result.value;
        log(
          `Check result for '${checkResult.url.name}: ${
            JSON.stringify(checkResult.result)
          }`,
        );
      }
    }
  });
}
