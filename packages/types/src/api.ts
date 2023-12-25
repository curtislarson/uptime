import { CheckResponse, UrlToCheck } from "./checks.ts";

export interface ApiResponse<Data = unknown> {
  data: Data;
}

export type GetChecksResponse = Record<string, {
  checks: CheckResponse[];
  url: UrlToCheck;
}>;
