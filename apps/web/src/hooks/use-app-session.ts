import { useAtomValue } from "@effect-atom/atom-react";
import { AddressSchema } from "@yellow-rpc/schema";
import { useConnection } from "wagmi";

import { YellowRpcClient } from "@/lib/client";

export const useAppSession = () => {
  const { address } = useConnection();

  const appSession = useAtomValue(
    YellowRpcClient.query("session", "getSession", {
      payload: {
        walletAddress: address ? AddressSchema.make(address) : undefined,
      },
      reactivityKeys: ["app_session"],
    }),
  );

  return appSession;
};
