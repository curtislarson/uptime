#!/usr/bin/env deno run -A --unstable

import { startCronJob } from "./src/cron.ts";
import { UptimeKv } from "./src/kv.ts";
import { createServer } from "./src/server.tsx";

const kv = await UptimeKv.init();

startCronJob(kv);

const server = createServer(kv);
Deno.serve(server.fetch);