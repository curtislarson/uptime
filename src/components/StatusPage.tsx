import { h } from "../../deps.ts";
import CheckResponseCard from "./CheckResponseCard.tsx";
import { CheckResponse, UrlToCheck } from "../types.ts";

export interface IndexProps {
  urls: UrlToCheck[];
  checks: WeakMap<UrlToCheck, CheckResponse[]>;
}

export default function StatusPage(props: IndexProps) {
  return (
    <div>
      <h1 class="text-2xl font-semibold">Uptime Status</h1>
      <hr class="my-2" />
      <div class="grid grid-cols-4 gap-2">
        {props.urls.map((url) => (
          <CheckResponseCard url={url} checks={props.checks.get(url) ?? []} />
        ))}
      </div>
    </div>
  );
}
