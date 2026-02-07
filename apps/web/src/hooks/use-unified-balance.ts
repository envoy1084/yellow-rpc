import { useQuery } from "@tanstack/react-query";

import { useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { RPCMethod } from "@erc7824/nitrolite";
import { useConnection } from "wagmi";

import { sessionAtom, unifiedBalanceAtom } from "@/lib/atoms";
import { queryKeys } from "@/lib/query";
import { useYellowClient } from "@/providers/yellow";

import { useAppSession } from "./use-app-session";
import { useAuthenticate } from "./use-authenticate";

export const useUnifiedBalance = () => {
  const { address } = useConnection();
  const ws = useYellowClient();
  const { getSigner } = useAuthenticate();
  const { data: appSession } = useAppSession();

  const session = useAtomValue(sessionAtom);
  const setUnifiedBalance = useAtomSet(unifiedBalanceAtom);

  useQuery({
    enabled: Boolean(address) && Boolean(appSession),
    queryFn: async () => {
      const signer = await getSigner();
      // biome-ignore lint/style/noNonNullAssertion: safe
      const res = await ws.getLedgerBalance(signer, address!);

      if (res.method === RPCMethod.Error) {
        // Means we are not authenticated
        if (session?.jwtToken) await ws.authenticateWithJwt(session.jwtToken);
        // will success in next attempt
        throw new Error(res.params.error);
      }

      const amount = Number(
        res.params.ledgerBalances.find((b) => b.asset === "ytest.usd")
          ?.amount ?? "0",
      );

      const formattedCurrency = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(amount);
      setUnifiedBalance(formattedCurrency);

      return amount;
    },
    refetchInterval: 60 * 1000, // 10 sec
    ...queryKeys.unifiedBalance.get(address),
  });
};
