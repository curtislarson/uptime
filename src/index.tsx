/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx, Fragment, FC, virtualSheet, setup, tw, getStyleTag } from "../deps.ts";
import { CheckResponse, UrlToCheck } from "./types.ts";
import dayjs from "npm:dayjs";

const sheet = virtualSheet();

setup({
  theme: {
    colors: {
      background: {
        200: "#585572",
        500: "#22212c",
      },
      primary: "#8aff80",
      secondary: "#9850ff",
      orange: "#FFCA80",
    },
  },
  sheet,
});

const Layout: FC<{ head: { __html: string } }> = (props) => {
  return (
    <html>
      <head dangerouslySetInnerHTML={props.head}></head>
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
          <span>{c.ok ? "✅" : "❌"}</span>
          <span>{dayjs(c.ts).format()}</span> - {c.status} - {c.statusText}
        </div>
      ))}
    </div>
  );
};

export const Index: FC<{ urls: UrlToCheck[]; checks: WeakMap<UrlToCheck, CheckResponse[]> }> = (props) => {
  sheet.reset();
  const body = (
    <body>
      <h1 class={tw`text-secondary`}>Recent Checks</h1>
      <div class={tw`grid grid-cols-4`}>
        {props.urls.map((url) => (
          <CheckResponseGrid url={url} checks={props.checks.get(url) ?? []} />
        ))}
      </div>
    </body>
  );
  const head = { __html: getStyleTag(sheet) };
  return <Layout head={head}>{body}</Layout>;
};
