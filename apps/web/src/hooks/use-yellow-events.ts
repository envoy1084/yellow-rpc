// use-yellow-events.ts
import { useEffect } from "react";

import { useAtomSet } from "@effect-atom/atom-react";
import { RPCMethod, type RPCResponse } from "@erc7824/nitrolite";

import { userBalanceAtom } from "@/lib/atoms";

import { useYellow } from "./use-yellow";

export const useYellowEvents = () => {
  const setBalance = useAtomSet(userBalanceAtom);
  const ws = useYellow();

  useEffect(() => {
    const remove = ws.listen((message: RPCResponse) => {
      console.log(message);
      if (message.method === RPCMethod.BalanceUpdate) {
        const balance =
          message.params.balanceUpdates.find((b) => b.asset === "ytest.usd")
            ?.amount ?? "0";

        setBalance(Number(balance));
      }

      if (message.method === RPCMethod.GetLedgerBalances) {
        const balance =
          message.params.ledgerBalances.find((b) => b.asset === "ytest.usd")
            ?.amount ?? "0";

        setBalance(Number(balance));
      }
    });

    return () => {
      remove();
    };
  }, [ws, setBalance]);
};
