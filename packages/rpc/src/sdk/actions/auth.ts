/** biome-ignore-all lint/suspicious/noAsyncPromiseExecutor: safe */

import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  type RPCAllowance,
  RPCMethod,
  type RPCResponse,
} from "@erc7824/nitrolite";
import type { WalletClient } from "viem";
import type { Client } from "yellow-ts";

import { generateSessionKey } from "../helpers";
export type AuthenticateProps = {
  application: string;
  allowances: RPCAllowance[];
  expiresAt: Date;
  scope: string;
};
export const authenticate = (
  walletClient: WalletClient,
  props: AuthenticateProps,
  client: Client,
) => {
  return new Promise(async (resolve, reject) => {
    let removeListener: (() => void) | undefined;

    try {
      if (!walletClient.account) throw new Error("Wallet not connected");

      const sessionKey = generateSessionKey();
      const sessionExpireTimestamp = Math.floor(
        props.expiresAt.getTime() / 1000,
      );

      const authProps = {
        allowances: props.allowances,
        expires_at: BigInt(sessionExpireTimestamp),
        scope: props.scope,
        session_key: sessionKey.address,
      };

      const authListener = async (message: RPCResponse) => {
        try {
          if (message.method === RPCMethod.AuthChallenge) {
            const eip712Signer = createEIP712AuthMessageSigner(
              walletClient,
              authProps,
              { name: "Name" },
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
            if (removeListener) removeListener();

            reject(new Error(message.params.error));
          }
        } catch (innerErr) {
          if (removeListener) removeListener();
          reject(innerErr);
        }
      };

      removeListener = client.listen(authListener);

      const authMessage = await createAuthRequestMessage({
        ...authProps,
        address: walletClient.account.address,
        application: props.application,
      });

      await client.sendMessage(authMessage);
    } catch (err) {
      if (removeListener) removeListener();
      reject(err);
    }
  });
};
