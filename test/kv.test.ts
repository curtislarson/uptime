import { assertEquals } from "https://x.curtis.land/test-helpers/mod.ts";
import { UptimeKv } from "../src/kv.ts";

const TEST_URL = {
  name: "Test URL",
  url: "https://curtislarson.dev",
  method: "GET" as const,
};

Deno.test("UptimeKv starts with 0 urls", async () => {
  const uptimeKv = await UptimeKv.init(Deno.makeTempFileSync());

  const urls = await uptimeKv.getUrls();

  assertEquals(urls.length, 0);

  uptimeKv.close();
});

Deno.test("UptimeKv add url to check and retrieve", async () => {
  const uptimeKv = await UptimeKv.init();

  const commitResult = await uptimeKv.addUrl(TEST_URL);
  assertEquals(commitResult.ok, true);

  const url = await uptimeKv.getUrl("Test URL");
  assertEquals(url, TEST_URL);

  const urls = await uptimeKv.getUrls();

  assertEquals(urls.length, 1);
  assertEquals(urls[0], TEST_URL);

  uptimeKv.close();
});
