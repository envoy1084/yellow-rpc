import { createFileRoute } from "@tanstack/react-router";

import { ApiKeyList, CreateApiKey } from "@/components";
import { useApiKeys } from "@/hooks";

export const Route = createFileRoute("/dashboard/api-keys")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useApiKeys();
  return (
    <div className="max-w-5xl w-full mx-auto px-4 flex flex-col gap-4">
      <div className="flex flex-row items-start gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-3xl">API Keys</div>
          <p className="text-sm text-muted-foreground max-w-xl">
            API Keys are used to authenticate requests to the Yellow RPC.
          </p>
        </div>
        <CreateApiKey />
      </div>
      <ApiKeyList apiKeys={Array.from(data ?? [])} />
    </div>
  );
}
