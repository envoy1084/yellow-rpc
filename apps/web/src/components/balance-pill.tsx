import { useAtomValue } from "@effect-atom/atom-react";
import { DropIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useConnection } from "wagmi";

import { ButtonGroup } from "@/components/ui/button-group";
import { useAuthenticate } from "@/hooks";
import { userBalanceAtom } from "@/lib/atoms";
import { useYellowClient } from "@/providers/yellow";

import { Button } from "./ui/button";

export const BalancePill = () => {
  const { address } = useConnection();
  const client = useYellowClient();
  const { getSigner } = useAuthenticate();
  const val = useAtomValue(userBalanceAtom);
  return (
    <ButtonGroup>
      <Button variant="outline">{val} USD</Button>
      <Button
        onClick={() => {
          if (!address) return;
          toast.promise(
            async () => {
              await fetch(
                "https://clearnet-sandbox.yellow.com/faucet/requestTokens",
                {
                  body: JSON.stringify({
                    userAddress: address,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                },
              );
              const signer = await getSigner();
              await client.getLedgerBalance(signer, address);
            },
            {
              error: "Failed to Request Testnet Tokens",
              loading: "Requesting Tokens...",
              success: "Successfully Requested Tokens",
            },
          );
        }}
        size="icon-lg"
        variant="outline"
      >
        <DropIcon className="size-5" />
      </Button>
    </ButtonGroup>
  );
};
