import { createECDSAMessageSigner } from "@erc7824/nitrolite";
import type { Address, Hex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export type Session = {
  address: Address;
  privateKey: Hex;
  signer: ReturnType<typeof createECDSAMessageSigner>;
};
export const generateSession = (): Session => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const signer = createECDSAMessageSigner(privateKey);
  return { address: account.address, privateKey, signer };
};
