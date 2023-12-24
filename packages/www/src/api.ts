import { ApiResponse, GetChecksResponse } from "@quackware/uptime-types";

export class Api {
  private apiHost: string;

  constructor() {
    const apiHost = import.meta.env.VITE_API_HOST;
    if (!apiHost) {
      throw new Error("VITE_API_HOST is not defined!");
    }

    this.apiHost = apiHost;
  }

  async getChecks() {
    const checks = await fetch(this.#getApiUrl("/checks")).then((res) =>
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
