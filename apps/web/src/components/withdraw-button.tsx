import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AddressSchema } from "@yellow-rpc/schema";
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

export const WithdrawButton = () => {
  const { data: appSession } = useAppSession();
  const { address } = useConnection();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState<string>("0");

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const value = Number(amount);
      if (Number.isNaN(value) || value <= 0) return;
      if (!address) return;
      if (!walletClient) return;
      if (!appSession) return;

      const walletAddress = AddressSchema.make(address);

      const program = Effect.gen(function* () {
        const client = yield* YellowRpcHttpClient;

        const { success } = yield* client.session.withdraw({
          payload: {
            amount: value,
            walletAddress: walletAddress,
          },
        });

        if (!success) return Effect.fail(new Error("Failed to Withdraw Funds"));
        return success;
      });

      await toast.promise(RuntimeClient.runPromise(program), {
        error: "Failed to Withdraw Funds",
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
        loading: "Withdrawing Funds...",
        success: "Successfully Withdrawn Funds",
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Withdraw Funds
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw funds from your app session. withdraw amount must be less
            than or equal to your available balance.
          </DialogDescription>
          <Input
            className="reset-input-number"
            disabled={withdrawMutation.isPending}
            max={appSession?.userBalance ?? 0}
            min={0}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            value={amount}
          />
          <Button
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutateAsync()}
          >
            Withdraw
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
