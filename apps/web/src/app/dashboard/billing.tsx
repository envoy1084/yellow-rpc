import { useMemo } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { CopyButton } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppSession } from "@/hooks";

export const BillingPage = () => {
  const { data: appSession } = useAppSession();

  const consumed = useMemo(() => {
    if (!appSession) return { percentage: "0", total: "0", value: "0" };

    const user = Math.round(appSession.userBalance * 100);
    const admin = Math.round(appSession.adminBalance * 100);

    const total = user + admin;
    if (user === 0) {
      return { percentage: "0", total: "0", value: "0" };
    }
    const consumed = total - user;
    const percent = ((consumed / total) * 100).toFixed(2);

    return {
      percentage: percent,
      total: (total / 100).toFixed(2),
      value: (consumed / 100).toFixed(2),
    };
  }, [appSession]);

  return (
    <div className="max-w-lg p-4 mx-auto w-full flex flex-col gap-4">
      <div className="font-medium text-xl">Current Usage</div>
      <div className="bg-muted/50 px-3 rounded-lg flex flex-col gap-2 border py-4">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="text-base font-medium">Balance</div>
          <Badge className="text-xs!" variant="success-ghost">
            {consumed.percentage}% consumed
          </Badge>
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="text">${consumed.value} used</span>
          <span className="text-muted-foreground">
            / ${consumed.total} available
          </span>
        </div>
        <Progress value={Number(consumed.percentage)} />
      </div>
      <div className="border-t w-full" />
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium">Session Information</div>
        <div className="flex flex-col gap-2">
          <div className="text-sm">Session ID</div>
          <div className="text-muted-foreground bg-muted px-2 py-2 rounded-md flex flex-row items-center gap-2 justify-between">
            <div className="truncate text-sm">
              {appSession?.appSessionId ?? "Null"}
            </div>
            <CopyButton
              className="[&_svg]:size-4"
              text={appSession?.appSessionId ?? "Null"}
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button variant="outline">Deposit Funds</Button>
          <Button variant="outline">Withdraw Funds</Button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});
