import { useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { createECDSAMessageSigner } from "@erc7824/nitrolite";
import type { Hex } from "viem";
import { useWalletClient } from "wagmi";

import { sessionAtom } from "@/lib/atoms";
import { useYellowClient } from "@/providers/yellow";

export const useAuthenticate = () => {
  const client = useYellowClient();
  const { data: walletClient } = useWalletClient();
  const session = useAtomValue(sessionAtom);
  const setSession = useAtomSet(sessionAtom);

  const getSigner = async () => {
    if (session && session.expiresAt.getTime() > Date.now()) {
      // Session is still valid
      return createECDSAMessageSigner(session.privateKey as Hex);
    }
    // Session Is Not Valid
    const newSession = await authenticate();
    return createECDSAMessageSigner(newSession.privateKey);
  };

  const authenticate = async () => {
    if (!walletClient) throw new Error("Wallet not connected");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const session = await client.authenticate(walletClient, {
      allowances: [],
      application: "YellowRPC",
      expiresAt,
      scope: "yellow-rpc.com",
    });

    const s = {
      address: session.address,
      expiresAt,
      jwtToken: session.jwtToken ?? "",
      privateKey: session.privateKey,
    };

    setSession(s);

    return s;
  };

  return { authenticate, getSigner };
};
