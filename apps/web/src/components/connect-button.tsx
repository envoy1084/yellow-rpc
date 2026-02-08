import { SignOutIcon } from "@phosphor-icons/react";
import {
  useConnection,
  useConnectors,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";

import { truncateAddress } from "@/lib/helpers";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export const ConnectButton = () => {
  const { address } = useConnection();
  const connectors = useConnectors();
  const { mutateAsync: disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({
    address,
  });

  const { data: ensAvatar } = useEnsAvatar({
    // biome-ignore lint/style/noNonNullAssertion: safe
    name: ensName!,
    query: { enabled: Boolean(ensName) },
  });

  console.log({ address, ensAvatar, ensName });

  const handleConnection = async () => {
    if (address) {
      await disconnect();
      return;
    }
    const connector = connectors[0];
    if (!connector) return;
    await connector.connect();
  };

  return (
    <Button onClick={handleConnection} variant="outline">
      {address ? (
        <>
          <Avatar className="size-6">
            <AvatarImage src={ensAvatar ?? undefined} />
            <AvatarFallback className="border-none">
              <img
                alt="avatar"
                className="size-6 rounded-full"
                src="https://api.dicebear.com/9.x/glass/svg?seed=Sawyer"
              />
            </AvatarFallback>
          </Avatar>
          <span>{ensName ?? truncateAddress(address)}</span>
          <SignOutIcon />
        </>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  );
};
