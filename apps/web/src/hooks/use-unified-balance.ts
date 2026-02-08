import { useQuery } from "@tanstack/react-query";

import { useAtomValue } from "@effect-atom/atom-react";
import { RPCMethod } from "@erc7824/nitrolite";
import { useConnection } from "wagmi";

import { sessionAtom } from "@/lib/atoms";
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

  useQuery({
    enabled: Boolean(address) && Boolean(appSession),
    queryFn: async () => {
      const signer = await getSigner();
      // biome-ignore lint/style/noNonNullAssertion: safe
      const res = await ws.getLedgerBalance(signer, address!);

      if (res.method === RPCMethod.Error) {
        // Means we are not authenticated
        if (session?.jwtToken && session.jwtToken !== "") {
          await ws.authenticateWithJwt(session.jwtToken);
        }
        // will success in next attempt
        throw new Error(res.params.error);
      }

      return res;
    },
    ...queryKeys.unifiedBalance.get(address),
  });
};
