import { CheckResponse, UrlToCheck } from "../types.ts";
import dayjs from "../date.ts";

export interface CheckResponseCardProps {
  url: UrlToCheck;
  checks: CheckResponse[];
}

export default function CheckResponseCard(props: CheckResponseCardProps) {
  return (
    <div class="card w-[28rem] shadow-xl mb-2 p-2 bg-gray-200 rounded-md">
      <div class="card-body">
        <h2 class="text-lg">
          <span class="mr-1">{props.checks[0].ok ? "✅" : "❌"}</span>
          {props.url.name} -{" "}
          <a href={props.url.url} class="text-blue-500 underline">
            {props.url.url}
          </a>
        </h2>
        <div class="flex flex-col mt-2">
          {props.checks.map((c) => (
            <div>
              <span class="mr-1">{c.ok ? "✅" : "❌"}</span>
              <span class="text-sm">{dayjs(c.ts).format("MMMM D, YYYY h:mm A")}</span> - {c.status} - {c.statusText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
