import sg from "npm:@sendgrid/mail";
import { CheckFailure, dayjs, UrlToCheck } from "../deps.ts";

export class EmailService {
  #sg;

  #senderEmail;

  constructor(sendgrid?: typeof sg) {
    this.#sg = sendgrid ?? sg;

    const senderEmail = Deno.env.get("STATUS_EMAIL_FROM_ADDRESS");
    if (!senderEmail) {
      throw new Error(
        "Environment variable STATUS_EMAIL_FROM_ADDRESS is not defined!",
      );
    }

    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridApiKey) {
      throw new Error("Environment variable SENDGRID_API_KEY is not defined!");
    }

    this.#senderEmail = senderEmail;
    this.#sg.setApiKey(sendgridApiKey);
  }

  async sendFailureEmail(checkResult: CheckFailure, url: UrlToCheck) {
    const eventDate = dayjs(checkResult.ts).format("MMMM D, YYYY h:mm A");
    const data: sg.MailDataRequired = {
      to: "curtismlarson@gmail.com",
      from: this.#senderEmail,
      subject: `[${url.url}] Failed Uptime Check`,
      html: /* html */ `
        <body>
          <h1>The check config ${url.name} with url ${url.url} failed at ${eventDate}</h1>
          <p>${checkResult.status} - ${checkResult.statusText} - ${
        (checkResult.error || "").toString()
      }</p>
        </body>`,
    };
    return await this.#sg.send(data);
  }
}
