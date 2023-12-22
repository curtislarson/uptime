/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono, jsx } from "../deps.ts";
import { Index } from "./index.tsx";
import { UptimeKv } from "./kv.ts";
import { logger } from "./logger.ts";
import { UrlToCheck, CheckResponse } from "./types.ts";

export function createServer(kv: UptimeKv) {
  const app = new Hono();

  logger.info("Initializing server");

  app.get("/", async (c) => {
    const urlToResponseMap = new WeakMap<UrlToCheck, CheckResponse[]>();
    const urlsToCheck = await kv.getUrls();
    for (const url of urlsToCheck) {
      const checkResponses = await kv.getCheckResponses(url);
      urlToResponseMap.set(url, checkResponses);
    }

    return c.html(<Index checks={urlToResponseMap} urls={urlsToCheck}></Index>);
  });

  return app;
}
