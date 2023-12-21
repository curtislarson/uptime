import { assertEquals } from "https://x.curtis.land/test-helpers/mod.ts";
import { check } from "../src/check.ts";
import { UptimeKv } from "../src/kv.ts";

const TEST_URL = {
  name: "Test URL",
  url: "https://curtislarson.dev",
  method: "GET" as const,
};

Deno.test("check success", async () => {
  const uptimeKv = await UptimeKv.init();
  await uptimeKv.addUrl(TEST_URL);

  const checkResult = await check(TEST_URL);

  assertEquals(checkResult.ok, true);
  assertEquals(checkResult.status, 200);

  uptimeKv.close();
});
