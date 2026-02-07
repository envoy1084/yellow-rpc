import { useQuery } from "@tanstack/react-query";

import { AddressSchema } from "@yellow-rpc/schema";
import { Effect } from "effect";
import { useConnection } from "wagmi";

import { YellowRpcHttpClient } from "@/layers";
import { queryKeys } from "@/lib/query";
import { RuntimeClient } from "@/lib/runtime";

export const useApiKeys = () => {
  const { address, isConnected } = useConnection();
  const apiKeys = useQuery({
    enabled: isConnected && Boolean(address),
    queryFn: async () => {
      const walletAddress = AddressSchema.make(address!);
      const program = Effect.gen(function* () {
        const client = yield* YellowRpcHttpClient;
        const res = yield* client.apiKey.listApiKeys({
          payload: { walletAddress },
        });
        return res;
      });

      const apiKeys = await RuntimeClient.runPromise(program);
      console.log("API Keys: ", apiKeys);
      return apiKeys;
    },
    ...queryKeys.apiKeys.list(address),
  });

  return apiKeys;
};
