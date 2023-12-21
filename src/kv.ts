import { CheckResponse, UrlToCheck } from "./types.ts";

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
    );
  }

  async getCheckResponses(check: UrlToCheck) {
    const iter = this.kv.list<CheckResponse>({
      prefix: [UptimeKv.CHECK_KEY_PREFIX, check.name],
    });
    const responses: CheckResponse[] = [];
    for await (const response of iter) {
      responses.push(response.value);
    }

    return responses;
  }

  close() {
    return this.kv.close();
  }
}
