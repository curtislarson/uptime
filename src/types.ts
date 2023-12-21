export interface UrlToCheck {
  readonly name: string;
  readonly url: string;
  /**
   * @default 'GET'
   */
  readonly method?: "GET" | "POST";
}

export interface CheckSuccess {
  ok: true;
  status: number;
  statusText: string;
  body: string;
}

export interface CheckFailure {
  ok: false;
  status: number;
  statusText: string;
  error?: Error;
}

export type CheckResponse = CheckSuccess | CheckFailure;
