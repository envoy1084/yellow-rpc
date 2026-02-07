import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAtomValue } from "@effect-atom/atom-react";
import { DropIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useConnection } from "wagmi";

import { ButtonGroup } from "@/components/ui/button-group";
import { unifiedBalanceAtom } from "@/lib/atoms";
import { queryKeys } from "@/lib/query";

import { Button } from "./ui/button";

export const BalancePill = () => {
  const { address } = useConnection();
  const balance = useAtomValue(unifiedBalanceAtom);
  const queryClient = useQueryClient();

  const faucetMutation = useMutation({
    mutationFn: async () => {
      if (!address) return;
      await toast.promise(
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
          await queryClient.invalidateQueries({
            ...queryKeys.unifiedBalance.get(address),
          });
        },
        {
          error: "Failed to Request Testnet Tokens",
          loading: "Requesting Tokens...",
          success: "Successfully Requested Tokens",
        },
      );
    },
  });

  return (
    <ButtonGroup>
      <Button variant="outline">{balance} USD</Button>
      <Button
        disabled={faucetMutation.isPending}
        onClick={() => faucetMutation.mutateAsync()}
        size="icon-lg"
        variant="outline"
      >
        <DropIcon className="size-5" />
      </Button>
    </ButtonGroup>
  );
};
