import { UptimeKv } from "./kv.ts";

// Every 10 minutes
const URL_CHECK_SCHEDULE = "*/10 * * * *";

export async function startCronJob(kv: UptimeKv) {
  Deno.cron("Uptime URL Checker", URL_CHECK_SCHEDULE, async () => {
    const urls = await kv.getUrls();
  });
}
