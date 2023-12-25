import { EmailService } from "../src/email.ts";
import { assertEquals, assertExists } from "./deps.ts";
const fakeSg = {
  key: "",

  setApiKey(key: string) {
    this.key = key;
  },

  send(data: unknown) {
    return Promise.resolve(data);
  },
};

Deno.test("EmailService", async () => {
  Deno.env.set("SENDGRID_API_KEY", "fakekey");
  Deno.env.set("STATUS_EMAIL_FROM_ADDRESS", "foo@curtislarson.dev");

  // deno-lint-ignore no-explicit-any
  const emailService = new EmailService(fakeSg as any);

  assertExists(emailService);

  const sendResult = await emailService.sendFailureEmail({
    ok: false,
    status: 500,
    statusText: "Failure",
    ts: new Date().getTime(),
  }, {
    name: "Test Location",
    url: "https://test.curtislarson.dev",
    method: "GET",
  });

  const data = sendResult as unknown as Record<string, unknown>;

  assertEquals(data["to"], "curtismlarson@gmail.com");
  assertEquals(data["from"], "foo@curtislarson.dev");
  assertEquals(
    data["subject"],
    "[https://test.curtislarson.dev] Failed Uptime Check",
  );
});
