/** biome-ignore-all lint/nursery/noUndeclaredEnvVars: safe */
import { createWalletClient, type Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const adminPrivateKey = process.env.PRIVATE_KEY as Hex;
const userPrivateKey = process.env.USER_PRIVATE_KEY as Hex;

const adminAccount = privateKeyToAccount(adminPrivateKey);
const userAccount = privateKeyToAccount(userPrivateKey);

export const adminWalletClient = createWalletClient({
  account: adminAccount,
  chain: sepolia,
  transport: http(),
});

export const userWalletClient = createWalletClient({
  account: userAccount,
  chain: sepolia,
  transport: http(),
});
