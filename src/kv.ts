import dayjs from "npm:dayjs";
import { logger } from "./logger.ts";
import { CheckResponse, UrlToCheck } from "./types.ts";

const ONE_DAY_MS = 86400 * 1000;

export class UptimeKv {
  static URL_KEY_PREFIX = "url";
  static CHECK_KEY_PREFIX = "check";

  static async init(path?: string) {
    const kv = await Deno.openKv(path);
    return new UptimeKv(kv);
  }

  private constructor(private kv: Deno.Kv) {}

  async getUrls() {
    const iter = this.kv.list<UrlToCheck>({
      prefix: [UptimeKv.URL_KEY_PREFIX],
    });
    const urls: UrlToCheck[] = [];
    for await (const toCheck of iter) {
      urls.push(toCheck.value);
    }

    return urls;
  }

  async addUrl(toCheck: UrlToCheck) {
    return await this.kv.set(
      [UptimeKv.URL_KEY_PREFIX, toCheck.name],
      {
        name: toCheck.name,
        url: toCheck.url,
        method: toCheck.method ?? "GET",
      },
    );
  }

  async getUrl(name: string) {
    const retrieved = await this.kv.get([UptimeKv.URL_KEY_PREFIX, name]);
    return retrieved.value;
  }

  async addCheckResponse(check: UrlToCheck, response: CheckResponse) {
    const now = new Date().getTime();
    return await this.kv.set(
      [UptimeKv.CHECK_KEY_PREFIX, check.name, now],
      response,
      { expireIn: ONE_DAY_MS },
    );
  }

  async getCheckResponses(check: UrlToCheck) {
    const oneDayAgo = dayjs().add(-1, "day").toDate().getTime();

    logger.info({
      oneDayAgo,
      check,
    }, "Retrieving responses");

    const iter = this.kv.list<CheckResponse>({
      prefix: [
        UptimeKv.CHECK_KEY_PREFIX,
        check.name,
      ],
      start: [UptimeKv.CHECK_KEY_PREFIX, check.name, oneDayAgo],
    });
    const responses: CheckResponse[] = [];
    for await (const response of iter) {
      responses.unshift(response.value);
    }

    return responses;
  }

  close() {
    return this.kv.close();
  }
}
