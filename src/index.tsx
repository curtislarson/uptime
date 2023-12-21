/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx, Fragment, FC } from "../deps.ts";
import { CheckResponse, UrlToCheck } from "./types.ts";

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

const CheckResponseGrid: FC<{ url: UrlToCheck; checks: CheckResponse[] }> = (props) => {
  return (
    <div>
      <h2>
        {props.url.name} - {props.url.url}
      </h2>
      {props.checks.map((c) => (
        <div>
          {new Date(c.ts).toUTCString()} - {c.status} - {c.statusText}
        </div>
      ))}
    </div>
  );
};

export const Index: FC<{ urls: UrlToCheck[]; checks: WeakMap<UrlToCheck, CheckResponse[]> }> = (props) => {
  return (
    <Layout>
      <h1>Recent Checks</h1>
      {props.urls.map((url) => (
        <CheckResponseGrid url={url} checks={props.checks.get(url) ?? []} />
      ))}
    </Layout>
  );
};
