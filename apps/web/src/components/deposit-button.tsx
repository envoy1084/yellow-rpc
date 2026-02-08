import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { YellowClient } from "@yellow-rpc/rpc";
import { AddressSchema, HexSchema } from "@yellow-rpc/schema";
import { Effect } from "effect";
import { toast } from "sonner";
import { useConnection, useWalletClient } from "wagmi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSession } from "@/hooks";
import { YellowRpcHttpClient } from "@/layers";
import { queryKeys } from "@/lib/query";
import { RuntimeClient } from "@/lib/runtime";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const DepositButton = () => {
  const { data: appSession } = useAppSession();
  const { address } = useConnection();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState<string>("0");
  const queryClient = useQueryClient();

  const depositMutation = useMutation({
    mutationFn: async () => {
      const value = amount;
      if (Number.isNaN(value)) return;
      if (!address) return;
      if (!walletClient) return;
      if (!appSession) return;

      const walletAddress = AddressSchema.make(address);

      const program = Effect.gen(function* () {
        const client = yield* YellowRpcHttpClient;

        const session = yield* Effect.promise(async () => {
          const ws = new YellowClient({
            url: "wss://clearnet-sandbox.yellow.com/ws",
          });
          await ws.connect();
          const res = await ws.authenticate(walletClient, {
            allowances: [
              {
                amount: value,
                asset: appSession.asset,
              },
            ],
            application: `yellow-rpc-${appSession.id}`,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 Year
            scope: "yellow-rpc.com",
          });

          await ws.disconnect();
          return res;
        });

        const { success } = yield* client.session.deposit({
          payload: {
            amount: value,
            sessionKey: AddressSchema.make(session.address),
            sessionPrivateKey: HexSchema.make(session.privateKey),
            walletAddress,
          },
        });

        return success;
      });

      await toast.promise(RuntimeClient.runPromise(program), {
        error: "Failed to Deposit Funds",
        finally: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              ...queryKeys.unifiedBalance.get(address),
            }),
            queryClient.invalidateQueries({
              ...queryKeys.appSession.get(address),
            }),
          ]);
        },
        loading: "Depositing Funds...",
        success: "Successfully Deposited Funds",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Deposit Funds
      </DialogTrigger>
      <DialogContent className="p-5">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Deposit funds from your unified balance to your app session. you can
            withdraw funds at any time.
          </DialogDescription>
        </DialogHeader>
        <Input
          className="reset-input-number"
          disabled={depositMutation.isPending}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          value={amount}
        />
        <Button
          disabled={depositMutation.isPending}
          onClick={() => depositMutation.mutateAsync()}
        >
          Deposit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
