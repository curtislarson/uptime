import { UrlToCheck, CheckResponse, GetChecksResponse } from "@quackware/uptime-types";
import CheckResponseCard from "../components/CheckResponseCard";
import api from "../api";
import { useEffect, useState } from "preact/hooks";

export default function StatusPage() {
  const [checks, setChecks] = useState<GetChecksResponse | null>(null);

  useEffect(() => {
    api.getChecks().then((res) => {
      setChecks(res);
    });
  }, []);

  return (
    <div>
      <h1 class="text-2xl font-semibold">Uptime Status</h1>
      <hr class="my-2" />
      <div class="grid grid-cols-4 gap-2">
        {checks &&
          Object.values(checks).map(({ checks, url }) => (
            <CheckResponseCard key={url.url} url={url} checks={checks ?? []} />
          ))}
      </div>
    </div>
  );
}
