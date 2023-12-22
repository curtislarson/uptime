import { logger } from "./logger.ts";
import { CheckResponse, UrlToCheck } from "./types.ts";

/**
 * TODO:
 *  - Expected body response (would need to parse json)
 */
export async function check(toCheck: UrlToCheck): Promise<CheckResponse> {
  logger.info(`Checking '${toCheck.name}' at url ${toCheck.url}`);

  const url = new URL(toCheck.url);

  const res = await fetch(url, { method: toCheck.method ?? "GET" });

  if (!res.ok) {
    logger.info(`Check failed due to ok=false`);
    return {
      ok: false,
      status: res.status,
      statusText: res.statusText,
      ts: new Date().getTime(),
    };
  }

  if (res.status < 200 || res.status >= 400) {
    logger.info(`Check failed due to bad response status`);
    return {
      ok: false,
      status: res.status,
      statusText: res.statusText,
      error: new Error(`Invalid Status: ${res.status}`),
      ts: new Date().getTime(),
    };
  }

  if (res.body == null) {
    logger.info(`Check failed due to null body`);
    return {
      ok: false,
      status: res.status,
      statusText: res.statusText,
      error: new Error("Response body is null"),
      ts: new Date().getTime(),
    };
  }

  const body = await res.text();

  const successResponse = {
    ok: true,
    status: res.status,
    statusText: res.statusText,
    body,
    ts: new Date().getTime(),
  };

  logger.info(successResponse, `Check succeeded`);

  return successResponse;
}
