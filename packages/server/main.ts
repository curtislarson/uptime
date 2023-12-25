#!/usr/bin/env deno run -A --unstable --no-check

// Auto load from `.env` files if available
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
await load({
  envPath: new URL("./.env", import.meta.url).pathname,
  export: true,
});

import { startCronJob } from "./src/cron.ts";
import { EmailService } from "./src/email.ts";
import { UptimeKv } from "./src/kv.ts";
import { logger } from "./src/logger.ts";
import { createServer } from "./src/server.ts";

const kv = await UptimeKv.init(Deno.env.get("DENO_KV_PATH"));
const email = new EmailService();

if (Deno.env.get("DENO_ENV") === "dev") {
  logger.info("In dev environment, skipping cron job start");
} else {
  startCronJob(kv, email);
}

const server = await createServer(kv);
Deno.serve(server.fetch);
