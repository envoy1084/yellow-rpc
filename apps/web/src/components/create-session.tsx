import { Reactivity } from "@effect/experimental";
import { FetchHttpClient, HttpApiClient } from "@effect/platform";
import { Result } from "@effect-atom/atom-react";
import { api } from "@yellow-rpc/api";
import { AddressSchema } from "@yellow-rpc/schema";
import { Cause, Effect } from "effect";
import { useConnection, useWalletClient } from "wagmi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSession } from "@/hooks";
import { useYellowClient } from "@/providers/yellow";

import { YellowRPCIcon } from "./icons";
import { Button } from "./ui/button";

export const CreateSession = () => {
  const ws = useYellowClient();
  const { address } = useConnection();
  const { data: walletClient } = useWalletClient();
  const appSession = useAppSession();

  const createAppSession = async () => {
    if (!address) return;
    if (!walletClient) return;
    const walletAddress = AddressSchema.make(address);
    const program = Effect.gen(function* () {
      const client = yield* HttpApiClient.make(api, {
        baseUrl: "http://localhost:8080",
      });
      yield* Effect.log("Creating App Session");
      const { id, authParams } = yield* client.session.prepare({
        payload: {
          walletAddress,
        },
      });

      yield* Effect.promise(async () => {
        await ws.authenticateWithParams(walletClient, authParams);
      });

      yield* Effect.log("Auth Params", authParams);

      const { appSessionId } = yield* client.session.activate({
        payload: { id, signature: "", walletAddress },
      });

      yield* Effect.log("App Session Activated", appSessionId);
      yield* Reactivity.invalidate(["app_session"]);
    });

    await Effect.runPromise(
      program.pipe(
        Effect.provide(FetchHttpClient.layer),
        Effect.provide(Reactivity.layer),
      ),
    );
  };

  return Result.builder(appSession)
    .onInitial(() => <div>Loading...</div>)
    .onFailure((cause) => <div>Error: {Cause.pretty(cause)}</div>)
    .onSuccess(({ session }) => {
      if (!session) {
        return (
          <Dialog open={true}>
            <DialogContent className="max-w-md! w-full" showCloseButton={false}>
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
      }

      return <div>App Session: {JSON.stringify(session, null, 2)}</div>;
    })
    .render();
};
