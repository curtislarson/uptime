import { UrlToCheck } from "./types.ts";

export class UptimeKv {
  static URL_KEY_PREFIX = "url";

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

  close() {
    return this.kv.close();
  }
}
