export interface UrlToCheck {
  readonly name: string;
  readonly url: string;
  /**
   * @default 'GET'
   */
  readonly method?: "GET" | "POST";
}

export interface BaseCheck {
  status: number;
  statusText: string;
  ts: number;
  ok: boolean;
}

export interface CheckSuccess extends BaseCheck {
  ok: true;
  body?: string;
}

export interface CheckFailure extends BaseCheck {
  ok: false;
  error?: Error;
  body?: undefined;
}

export type CheckResponse = CheckSuccess | CheckFailure;
