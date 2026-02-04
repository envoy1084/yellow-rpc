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
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({
    // biome-ignore lint/style/noNonNullAssertion: safe
    name: ensName!,
    query: { enabled: Boolean(ensName) },
  });

  const handleConnection = async () => {
    if (address) {
      await disconnect();
      return;
    }
    const connector = connectors[0];
    if (!connector) return;

    const res = await connector.connect();
    const connectedAddress = res.accounts[0];
    if (!connectedAddress) return;
    // TODO: Create User if not exists
  };

  return (
    <Button onClick={handleConnection} variant="outline">
      {address ? (
        <>
          <Avatar className="size-6">
            <AvatarImage src={ensAvatar ?? undefined} />
            <AvatarFallback className="border text-xs">
              {ensName?.slice(0, 2).toUpperCase() ?? address.slice(2, 4)}
            </AvatarFallback>
          </Avatar>
          <span>{ensName ?? truncateAddress(address)}</span>
        </>
      ) : (
        <>Connect Wallet</>
      )}
    </Button>
  );
};
