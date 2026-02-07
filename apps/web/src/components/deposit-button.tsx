import { useState } from "react";

import { YellowClient } from "@yellow-rpc/rpc";
import { AddressSchema, HexSchema } from "@yellow-rpc/schema";
import { Effect } from "effect";
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
import { RuntimeClient } from "@/lib/runtime";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const DepositButton = () => {
  const { data: appSession } = useAppSession();
  const { address } = useConnection();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState<string>("0");

  const onDeposit = async () => {
    const value = Number(amount);
    if (Number.isNaN(value) || value <= 0) return;
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
              amount: value.toString(),
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

    const success = await RuntimeClient.runPromise(program);
    console.log("Success: ", success);
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Deposit Funds
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Deposit funds from your unified balance to your app session. you can
            withdraw funds at any time.
          </DialogDescription>
          <Input
            className="reset-input-number"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            value={amount}
          />
          <Button onClick={onDeposit}>Deposit</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
