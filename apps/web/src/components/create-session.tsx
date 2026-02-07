import { useQueryClient } from "@tanstack/react-query";

import { AddressSchema } from "@yellow-rpc/schema";
import { Effect } from "effect";
import { useConnection, useWalletClient } from "wagmi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSession } from "@/hooks";
import { YellowRpcHttpClient } from "@/layers";
import { queryKeys } from "@/lib/query";
import { RuntimeClient } from "@/lib/runtime";
import { useYellowClient } from "@/providers/yellow";

import { YellowRPCIcon } from "./icons";
import { QueryBoundary } from "./misc";
import { Button } from "./ui/button";

export const CreateSession = () => {
  const ws = useYellowClient();
  const { address } = useConnection();
  const { data: walletClient } = useWalletClient();
  const appSession = useAppSession();
  const queryClient = useQueryClient();

  const createAppSession = async () => {
    if (!address) return;
    if (!walletClient) return;
    const walletAddress = AddressSchema.make(address);
    const program = Effect.gen(function* () {
      const client = yield* YellowRpcHttpClient;
      const { id, authParams } = yield* client.session.prepare({
        payload: {
          walletAddress,
        },
      });

      yield* Effect.promise(async () => {
        await ws.authenticateWithParams(walletClient, authParams);
      });

      const { appSessionId } = yield* client.session.activate({
        payload: { id, signature: "", walletAddress },
      });

      return appSessionId;
    });

    await RuntimeClient.runPromise(program);
    await queryClient.invalidateQueries({
      ...queryKeys.appSession.get(walletAddress),
    });
  };

  return (
    <QueryBoundary checkIsEmpty={(d) => d === null} query={appSession}>
      {({ Loading, Empty }) => (
        <>
          <Loading>Loading...</Loading>
          <Empty>
            return (
            <Dialog open={true}>
              <DialogContent
                className="max-w-md! w-full"
                showCloseButton={false}
              >
                <DialogHeader className="py-2 gap-4">
                  <DialogTitle className="flex flex-row items-center justify-center gap-2">
                    <YellowRPCIcon className="size-8 rounded-md" />
                    <span className="font-medium text-2xl">YellowRPC</span>
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Create a new app session to start using YellowRPC. You can
                    deposit and withdraw funds from your app session.
                  </DialogDescription>
                  <Button onClick={createAppSession}>Create App Session</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            );
          </Empty>
        </>
      )}
    </QueryBoundary>
  );
};
