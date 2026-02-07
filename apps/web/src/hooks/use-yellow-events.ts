// use-yellow-events.ts
import { useEffect } from "react";

import { useAtomSet } from "@effect-atom/atom-react";
import { RPCMethod, type RPCResponse } from "@erc7824/nitrolite";

import { unifiedBalanceAtom } from "@/lib/atoms";
import { useYellowClient } from "@/providers/yellow";

export const useYellowEvents = () => {
  const setUnifiedBalance = useAtomSet(unifiedBalanceAtom);
  const ws = useYellowClient();

  // biome-ignore lint/correctness/useExhaustiveDependencies: safe
  useEffect(() => {
    const remove = ws.listen((message: RPCResponse) => {
      if (message.method === RPCMethod.BalanceUpdate) {
        const amount = Number(
          message.params.balanceUpdates.find((b) => b.asset === "ytest.usd")
            ?.amount ?? "0",
        );

        const formattedCurrency = new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        }).format(amount);
        setUnifiedBalance(formattedCurrency);
      }

      if (message.method === RPCMethod.GetLedgerBalances) {
        const amount = Number(
          message.params.ledgerBalances.find((b) => b.asset === "ytest.usd")
            ?.amount ?? "0",
        );

        const formattedCurrency = new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        }).format(amount);
        setUnifiedBalance(formattedCurrency);
      }
    });

    return () => {
      remove();
    };
  }, [ws]);
};
