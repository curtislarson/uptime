import { CheckResponse, UrlToCheck } from "../types.ts";
import dayjs from "../date.ts";

export interface CheckResponseCardProps {
  url: UrlToCheck;
  checks: CheckResponse[];
}

export default function CheckResponseCard(props: CheckResponseCardProps) {
  return (
    <div class="card w-[28rem] bg-base-300 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="text-lg">
          {props.url.name} - {props.url.url}
        </h2>
        <div class="flex flex-col text-gray-500">
          {props.checks.map((c) => (
            <div>
              <span class="mr-1">{c.ok ? "✅" : "❌"}</span>
              <span>{dayjs(c.ts).format("MMMM D, YYYY h:mm A")}</span> - {c.status} - {c.statusText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
