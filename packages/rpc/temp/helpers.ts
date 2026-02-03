/** biome-ignore-all lint/suspicious/noAsyncPromiseExecutor: safe */
/** biome-ignore-all lint/suspicious/useAwait: safe */
import {
  type AuthVerifyResponse,
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createECDSAMessageSigner,
  createEIP712AuthMessageSigner,
  createGetLedgerBalancesMessage,
  type MessageSigner,
  RPCMethod,
  type RPCResponse,
} from "@erc7824/nitrolite";
import type { Address, Hex, WalletClient } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Client } from "yellow-ts";

const SESSION_DURATION = 24 * 60 * 60; // 1 day

const APP_NAME = "YellowRPC";

export type SessionKey = {
  address: Address;
  privateKey: Hex;
  signer: ReturnType<typeof createECDSAMessageSigner>;
};
export const generateSessionKey = (): SessionKey => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const signer = createECDSAMessageSigner(privateKey);
  return { address: account.address, privateKey, signer };
};

export const authenticate = async (
  walletClient: WalletClient,
  client: Client,
): Promise<{
  sessionKey: SessionKey;
  session: AuthVerifyResponse["params"];
}> => {
  return new Promise(async (resolve, reject) => {
    // 1. Declare the cleanup variable outside so everyone can see it
    let removeListener: (() => void) | undefined;

    try {
      if (!walletClient.account) throw new Error("Wallet not connected");

      const sessionKey = generateSessionKey();
      const sessionExpireTimestamp = String(
        Math.floor(Date.now() / 1000) + SESSION_DURATION,
      );

      const authListener = async (message: RPCResponse) => {
        try {
          if (message.method === RPCMethod.AuthChallenge) {
            const eip712Signer = createEIP712AuthMessageSigner(
              walletClient,
              {
                allowances: [{ amount: "10", asset: "ytest.usd" }],
                expires_at: BigInt(sessionExpireTimestamp),
                scope: "yellow-rpc.com",
                session_key: sessionKey.address,
              },
              { name: APP_NAME },
            );

            const authVerifyMessage = await createAuthVerifyMessage(
              eip712Signer,
              message,
            );

            await client.sendMessage(authVerifyMessage);
          }

          if (message.method === RPCMethod.AuthVerify) {
            if (removeListener) removeListener();

            resolve({
              session: message.params,
              sessionKey,
            });
          }

          if (message.method === RPCMethod.Error) {
            // 3. CLEANUP ON RPC ERROR
            if (removeListener) removeListener();

            reject(new Error(message.params.error));
          }
        } catch (innerErr) {
          if (removeListener) removeListener();
          reject(innerErr);
        }
      };

      // 4. Start Listening and capture the removal function
      removeListener = client.listen(authListener);

      const authMessage = await createAuthRequestMessage({
        address: walletClient.account.address,
        allowances: [{ amount: "10", asset: "ytest.usd" }],
        application: APP_NAME,
        expires_at: BigInt(sessionExpireTimestamp),
        scope: "yellow-rpc.com",
        session_key: sessionKey.address,
      });

      await client.sendMessage(authMessage);
    } catch (err) {
      // 5. CLEANUP ON SETUP ERROR (e.g. Wallet not connected or Send fails)
      if (removeListener) removeListener();
      reject(err);
    }
  });
};

export const getLedgerBalance = (
  signer: MessageSigner,
  address: Address,
  client: Client,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    let removeListener: (() => void) | undefined;

    try {
      const listener = (message: RPCResponse) => {
        if (message.method === RPCMethod.GetLedgerBalances) {
          if (removeListener) removeListener();
          resolve(message.params.ledgerBalances[0]?.amount ?? "0");
        }

        if (message.method === RPCMethod.Error) {
          if (removeListener) removeListener();
          reject(new Error(message.params.error));
        }
      };

      removeListener = client.listen(listener);

      const msg = await createGetLedgerBalancesMessage(signer, address);
      await client.sendMessage(msg);
    } catch (error) {
      if (removeListener) removeListener();
      reject(error);
    }
  });
};
