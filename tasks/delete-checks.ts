#!/usr/bin/env deno run -A --unstable --no-check

import "https://deno.land/std@0.210.0/dotenv/load.ts";
import { UptimeKv } from "../src/kv.ts";

/**
 * Warning! This deletes all current checks in whichever k/v we connect to
 */
async function deleteChecks() {
  const kvPath = Deno.env.get("DENO_KV_PATH");
  if (!kvPath) {
    throw new Error(`Environment variable DENO_KV_PATH is not defined`);
  }
  const kv = await UptimeKv.init(kvPath);

  console.log("Deleting Check Responses");
  await kv.deleteAllCheckResponses();
  console.log("Delete complete");
}

await deleteChecks();
