import { useQuery } from "@tanstack/react-query";

import { AddressSchema } from "@yellow-rpc/schema";
import { Effect } from "effect";
import { useConnection } from "wagmi";

import { YellowRpcHttpClient } from "@/layers";
import { queryKeys } from "@/lib/query";
import { RuntimeClient } from "@/lib/runtime";

export const useAppSession = () => {
  const { address } = useConnection();

  const appSession = useQuery({
    enabled: Boolean(address),
    queryFn: async () => {
      // biome-ignore lint/style/noNonNullAssertion: safe
      const walletAddress = AddressSchema.make(address!);
      const program = Effect.gen(function* () {
        const client = yield* YellowRpcHttpClient;

        const res = yield* client.session.getSession({
          payload: { walletAddress },
        });

        return res.session;
      });

      const session = await RuntimeClient.runPromise(program);
      return session;
    },
    refetchInterval: 1000 * 5, // 5 sec
    ...queryKeys.appSession.get(address),
  });

  return appSession;
};
