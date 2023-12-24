import { CheckResponse, dayjs, UrlToCheck } from "../deps.ts";
import { logger } from "./logger.ts";

const ONE_DAY_MS = 86400 * 1000;

export class UptimeKv {
  static URL_KEY_PREFIX = "url";
  static CHECK_KEY_PREFIX = "check";

  static async init(path?: string) {
    const kv = await Deno.openKv(path);
    return new UptimeKv(kv);
  }

  private constructor(private kv: Deno.Kv) {}

  /** Retrieves a list of all urls to check */
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

  /** Given the name of a url to check, retrieves the full `UrlToCheck` object */
  async getUrl(name: string) {
    const retrieved = await this.kv.get([UptimeKv.URL_KEY_PREFIX, name]);
    return retrieved.value;
  }

  /** Adds a new url to check */
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

  /** Adds a new `CheckResponse` for the given `UrlToCheck` */
  async addCheckResponse(check: UrlToCheck, response: CheckResponse) {
    const now = new Date().getTime();
    return await this.kv.set(
      [UptimeKv.CHECK_KEY_PREFIX, check.name, now],
      response,
      { expireIn: ONE_DAY_MS },
    );
  }

  /** Retrieves all `CheckResponse` objects in the past day for the given `UrlToCheck` */
  async getCheckResponses(check: UrlToCheck) {
    const oneHourAgo = dayjs().add(-1, "hour").toDate().getTime();

    logger.info({
      oneHourAgo,
      check,
    }, "Retrieving responses");

    const iter = this.kv.list<CheckResponse>({
      prefix: [
        UptimeKv.CHECK_KEY_PREFIX,
        check.name,
      ],
      // This gets all values that have their third key (timestamp) >= `oneHourAgo`
      start: [UptimeKv.CHECK_KEY_PREFIX, check.name, oneHourAgo],
    });
    const responses: CheckResponse[] = [];
    for await (const response of iter) {
      responses.unshift(response.value);
    }

    return responses;
  }

  async getAllCheckResponses(check: UrlToCheck) {
    const iter = this.kv.list<CheckResponse>({
      prefix: [
        UptimeKv.CHECK_KEY_PREFIX,
        check.name,
      ],
    });
    const responses: Deno.KvEntry<CheckResponse>[] = [];
    for await (const response of iter) {
      responses.unshift(response);
    }

    return responses;
  }

  async deleteCheckResponsesForUrl(url: UrlToCheck) {
    const checkResponses = await this.getAllCheckResponses(url);
    return await Promise.all(
      checkResponses.map((response) => this.kv.delete(response.key)),
    );
  }

  async deleteAllCheckResponses() {
    const urls = await this.getUrls();
    return await Promise.all(
      urls.map((url) => this.deleteCheckResponsesForUrl(url)),
    );
  }

  /** Close the kv store to prevent memory leak */
  close() {
    return this.kv.close();
  }
}
