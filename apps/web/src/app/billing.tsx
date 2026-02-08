import { useMemo } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { WarningIcon } from "@phosphor-icons/react";

import { CopyButton, DepositButton, WithdrawButton } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppSession } from "@/hooks";
import { formatUsd } from "@/lib/currency";

export const BillingPage = () => {
  const { data: appSession } = useAppSession();

  const consumed = useMemo(() => {
    if (!appSession) return { percentage: "0", total: "0", value: "0" };

    const user = appSession.userBalance;
    const admin = appSession.adminBalance;

    const total = user + admin;
    if (user === 0n) {
      return { percentage: "0", total: "0", value: "0" };

      // 10*1e6/100*1e6 = 10
    }
    const consumed = total - user;
    const percent = (Number((consumed * 1000n) / total) / 100).toString();

    return {
      percentage: percent,
      total: formatUsd(total),
      value: formatUsd(consumed),
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
          <span className="text">{consumed.value} used</span>
          <span className="text-muted-foreground">
            / {consumed.total} available
          </span>
        </div>
        <Progress value={Number(consumed.percentage)} />
      </div>
      {appSession?.status === "invalid" && (
        <div className="bg-primary/15 w-full p-3 rounded-md border border-primary/20 text-primary flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <WarningIcon />
            <span className="text-sm">Warning</span>
          </div>
          <p className="text-xs">
            App Session Key is invalid, this can happen due multiple reasons
            such as creating a new session key, or session key expiry. Please
            deposit any number of funds to renew your session key.
          </p>
        </div>
      )}
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
          <DepositButton />
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});
