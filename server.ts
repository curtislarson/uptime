#!/usr/bin/env deno run -A --unstable

import { startCronJob } from "./src/cron.ts";
import { UptimeKv } from "./src/kv.ts";

const kv = await UptimeKv.init();

startCronJob(kv);
