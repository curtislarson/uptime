import { CheckResponse, UrlToCheck } from "../types.ts";
import dayjs from "npm:dayjs";

export interface CheckResponseGridProps {
  url: UrlToCheck;
  checks: CheckResponse[];
}

export default function CheckResponseGrid(props: CheckResponseGridProps) {
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
}
