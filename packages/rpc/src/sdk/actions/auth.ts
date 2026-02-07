/** biome-ignore-all lint/suspicious/noAsyncPromiseExecutor: safe */

import {
  type AuthRequestParams,
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  type RPCAllowance,
  RPCMethod,
  type RPCResponse,
} from "@erc7824/nitrolite";
import type { WalletClient } from "viem";
import type { Client } from "yellow-ts";

import { generateSession, type Session } from "../helpers";
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
): Promise<Session> => {
  return new Promise(async (resolve, reject) => {
    let removeListener: (() => void) | undefined;

    try {
      if (!walletClient.account) throw new Error("Wallet not connected");

      const session = generateSession();
      const sessionExpireTimestamp = Math.floor(
        props.expiresAt.getTime() / 1000,
      );

      const authListener = async (message: RPCResponse) => {
        try {
          if (message.method === RPCMethod.AuthChallenge) {
            const eip712Signer = createEIP712AuthMessageSigner(
              walletClient,
              {
                allowances: props.allowances,
                expires_at: BigInt(sessionExpireTimestamp),
                scope: props.scope,
                session_key: session.address,
              },
              { name: props.application },
            );

            const authVerifyMessage = await createAuthVerifyMessage(
              eip712Signer,
              message,
            );

            await client.sendMessage(authVerifyMessage);
          }

          if (message.method === RPCMethod.AuthVerify) {
            if (removeListener) removeListener();

            resolve(session);
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
        address: walletClient.account.address,
        allowances: props.allowances,
        application: props.application,
        expires_at: BigInt(sessionExpireTimestamp),
        scope: props.scope,
        session_key: session.address,
      });

      await client.sendMessage(authMessage);
    } catch (err) {
      if (removeListener) removeListener();
      reject(err);
    }
  });
};

export const authenticateWithParams = (
  walletClient: WalletClient,
  authParams: string,
  client: Client,
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    let removeListener: (() => void) | undefined;

    try {
      if (!walletClient.account) throw new Error("Wallet not connected");

      const params = JSON.parse(authParams) as AuthRequestParams;

      const authListener = async (message: RPCResponse) => {
        try {
          if (message.method === RPCMethod.AuthChallenge) {
            const eip712Signer = createEIP712AuthMessageSigner(
              walletClient,
              {
                allowances: params.allowances,
                expires_at: BigInt(params.expires_at),
                scope: params.scope,
                session_key: params.session_key,
              },
              { name: params.application },
            );

            const authVerifyMessage = await createAuthVerifyMessage(
              eip712Signer,
              message,
            );

            await client.sendMessage(authVerifyMessage);
          }

          if (message.method === RPCMethod.AuthVerify) {
            if (removeListener) removeListener();

            resolve(void 0);
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
        address: walletClient.account.address,
        allowances: params.allowances,
        application: params.application,
        expires_at: BigInt(params.expires_at),
        scope: params.scope,
        session_key: params.session_key,
      });

      await client.sendMessage(authMessage);
    } catch (err) {
      if (removeListener) removeListener();
      reject(err);
    }
  });
};
