declare global {
  interface Body<T = unknown> {
    json<T>(): Promise<T>;
  }

  /**
   * This type is augmented with an optional type that describes the parsed json request body.
   */
  interface Request<T = unknown> extends Body<T> {
    json<T>(): Promise<T>;
  }

  /**
   * This type is augmented with an optional type that describes the parsed json response body.
   */
  interface Response<T = unknown> {
    json<T>(): Promise<T>;
  }
}

export {};
