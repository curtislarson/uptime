import { cors, GetChecksResponse, Hono, join } from "../deps.ts";
import { UptimeKv } from "./kv.ts";
import { logger } from "./logger.ts";

const DIST_PATH = new URL("../../../dist", import.meta.url).pathname;
const INDEX_PATH = join(DIST_PATH, "index.html");
const FAVICON_PATH =
  new URL("../../../dist/favicon.ico", import.meta.url).pathname;
const QUACK_PATH = new URL("../../../dist/quack.png", import.meta.url).pathname;

export async function createServer(kv: UptimeKv) {
  const app = new Hono();

  logger.info(
    { DIST_PATH, INDEX_PATH, FAVICON_PATH, QUACK_PATH },
    "Initializing server",
  );

  const indexFile = await Deno.readTextFile(INDEX_PATH);
  const quackImage = await Deno.readFile(QUACK_PATH);
  const favicon = await Deno.readFile(FAVICON_PATH);

  app.get("/assets/*", async (c) => {
    const { pathname } = new URL(c.req.url);
    const contentType = pathname.endsWith(".css")
      ? "text/css"
      : "text/javascript";
    const file = await Deno.readTextFile(join(DIST_PATH, pathname));
    return c.body(file, { headers: { "Content-Type": contentType } });
  });

  app.get("/quack.png", (c) => c.body(quackImage));
  app.get("/favicon.ico", (c) => c.body(favicon));

  app.use("/api/*", cors());

  app.get("/api/v1/status", async (c) => {
    const urlToCheckResponsesMap: GetChecksResponse = {};
    const urlsToCheck = await kv.getUrls();
    for (const url of urlsToCheck) {
      const checkResponses = await kv.getCheckResponses(url);
      urlToCheckResponsesMap[url.url] = {
        checks: checkResponses,
        url,
      };
    }

    return c.json({ data: urlToCheckResponsesMap });
  });

  app.get("*", (c) => c.html(indexFile));

  return app;
}
