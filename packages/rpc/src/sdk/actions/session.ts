import {
  type CloseAppSessionRequestParams,
  type CloseAppSessionResponse,
  type CreateAppSessionRequestParams,
  type CreateAppSessionResponse,
  createAppSessionMessage,
  createCloseAppSessionMessage,
  createGetAppDefinitionMessageV2,
  createSubmitAppStateMessage,
  type ErrorResponse,
  type GetAppDefinitionResponse,
  type MessageSigner,
  type RPCData,
  type SubmitAppStateRequestParamsV04,
  type SubmitAppStateResponse,
} from "@erc7824/nitrolite";
import type { Hex } from "viem";
import type { Client } from "yellow-ts";

export const createAppSession = async (
  signer: MessageSigner,
  participantSigners: MessageSigner[],
  params: CreateAppSessionRequestParams,
  client: Client,
) => {
  const msg = await createAppSessionMessage(signer, params);
  const msgJson = JSON.parse(msg);
  const participantSigs = await Promise.all(
    participantSigners.map((s) => s(msgJson.req as RPCData)),
  );

  msgJson.sig.push(...participantSigs);
  return (await client.sendMessage(msg)) as
    | CreateAppSessionResponse
    | ErrorResponse;
};

export const submitAppState = async (
  signer: MessageSigner,
  participantSigners: MessageSigner[],
  params: SubmitAppStateRequestParamsV04,
  client: Client,
) => {
  const msg = await createSubmitAppStateMessage(signer, params);

  const msgJson = JSON.parse(msg);

  const participantSigs = await Promise.all(
    participantSigners.map((s) => s(msgJson.req as RPCData)),
  );

  msgJson.sig.push(...participantSigs);

  return (await client.sendMessage(JSON.stringify(msgJson))) as
    | SubmitAppStateResponse
    | ErrorResponse;
};

export const closeAppSession = async (
  signer: MessageSigner,
  participantSigners: MessageSigner[],
  params: CloseAppSessionRequestParams,
  client: Client,
) => {
  const msg = await createCloseAppSessionMessage(signer, params);

  const msgJson = JSON.parse(msg);

  const participantSigs = await Promise.all(
    participantSigners.map((s) => s(msgJson.req as RPCData)),
  );

  msgJson.sig.push(...participantSigs);

  return (await client.sendMessage(JSON.stringify(msgJson))) as
    | CloseAppSessionResponse
    | ErrorResponse;
};

export const getAppSession = async (appSessionId: Hex, client: Client) => {
  const msg = createGetAppDefinitionMessageV2(appSessionId);

  return (await client.sendMessage(msg)) as
    | GetAppDefinitionResponse
    | ErrorResponse;
};
