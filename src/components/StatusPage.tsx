import { h } from "../../deps.ts";
import CheckResponseGrid from "./CheckResponseGrid.tsx";
import { CheckResponse, UrlToCheck } from "../types.ts";

export interface IndexProps {
  urls: UrlToCheck[];
  checks: WeakMap<UrlToCheck, CheckResponse[]>;
}

export default function StatusPage(props: IndexProps) {
  return (
    <div>
      <h1 class="text-2xl">Recent Checks</h1>
      <div class="grid grid-cols-4">
        {props.urls.map((url) => (
          <CheckResponseGrid url={url} checks={props.checks.get(url) ?? []} />
        ))}
      </div>
    </div>
  );
}
