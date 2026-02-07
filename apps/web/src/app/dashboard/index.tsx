import { createFileRoute } from "@tanstack/react-router";

import { ApiKeyList, CreateApiKey, MetricCard } from "@/components";
import { useApiKeys, useAppSession } from "@/hooks";

const DashboardPage = () => {
  const { data: apiKeys } = useApiKeys();
  const { data: appSession } = useAppSession();

  return (
    <div className="max-w-7xl w-full mx-auto px-4 flex flex-col gap-10">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          description="Available Balance for the App Session"
          title="Session Balance"
          value={`$${appSession?.userBalance ?? 0}`}
        />
        <MetricCard
          description="Pending Settlement for API usage"
          title="Pending Settlement"
          value={`$${appSession?.pendingSettlement ?? 0}`}
        />
        <MetricCard
          description="Total API Keys created"
          title="API Keys"
          value={`${apiKeys?.length ?? 0}`}
        />
      </div>
      <div className="flex flex-row items-start gap-2 justify-between">
        <div className="flex flex-col gap-1 px-2">
          <div className="text-3xl">API Keys</div>
          <p className="text-sm text-muted-foreground max-w-xl">
            API Keys are used to authenticate requests to the Yellow RPC.
          </p>
        </div>
        <CreateApiKey />
      </div>
      <ApiKeyList apiKeys={Array.from(apiKeys ?? [])} />
    </div>
  );
};

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});
