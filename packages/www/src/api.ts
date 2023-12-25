import { ApiResponse, GetChecksResponse } from "@quackware/uptime-types";

export class Api {
  private apiHost: string;
  private fetch: typeof fetch;

  constructor() {
    const apiHost = import.meta.env.VITE_API_HOST;
    if (!apiHost) {
      throw new Error("VITE_API_HOST is not defined!");
    }

    this.apiHost = apiHost;

    this.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const headers = {
        ...init.headers,
        "Content-Type": "application/json",
      };
      init.headers = headers;
      return await fetch(input, init);
    };
  }

  async getChecks() {
    const checks = await this.fetch(this.#getApiUrl("/status")).then((res) =>
      res.json<ApiResponse<GetChecksResponse>>()
    );
    return checks.data;
  }

  #getApiUrl(pathname: `/${string}`) {
    return this.apiHost + pathname;
  }
}

export const api = new Api();
export default api;
