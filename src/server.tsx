import { Hono, h, serveStatic } from "../deps.ts";
import StatusPage from "./components/StatusPage.tsx";
import { UptimeKv } from "./kv.ts";
import { logger } from "./logger.ts";
import { renderToHtml } from "./render.tsx";
import { UrlToCheck, CheckResponse } from "./types.ts";

// This is called from the `main.ts` file in the parent directory so the path has
// to be a reference from that file, not this `server.tsx` file
const FAVICON_PATH = "./public/favicon.ico";

export function createServer(kv: UptimeKv) {
  const app = new Hono();

  logger.info("Initializing server");

  app.get("/favicon.ico", serveStatic({ path: FAVICON_PATH }));

  app.get("/", async (c) => {
    const urlToResponseMap = new WeakMap<UrlToCheck, CheckResponse[]>();
    const urlsToCheck = await kv.getUrls();
    for (const url of urlsToCheck) {
      const checkResponses = await kv.getCheckResponses(url);
      urlToResponseMap.set(url, checkResponses);
    }

    const html = await renderToHtml(<StatusPage checks={urlToResponseMap} urls={urlsToCheck}></StatusPage>);

    return c.html(html);
  });

  return app;
}
