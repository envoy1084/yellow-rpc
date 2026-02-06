import type {
  CloseAppSessionRequestParams,
  CreateAppSessionRequestParams,
  MessageSigner,
  SubmitAppStateRequestParamsV04,
} from "@erc7824/nitrolite";
import type { Hex, WalletClient } from "viem";
import { Client } from "yellow-ts";

import * as actions from "./actions";

export class YellowClient extends Client {
  async authenticate(
    walletClient: WalletClient,
    props: actions.AuthenticateProps,
  ) {
    return await actions.authenticate(walletClient, props, this);
  }

  async authenticateWithParams(walletClient: WalletClient, authParams: string) {
    return await actions.authenticateWithParams(walletClient, authParams, this);
  }

  async createAppSession(
    signer: MessageSigner,
    participantSigners: MessageSigner[],
    params: CreateAppSessionRequestParams,
  ) {
    return await actions.createAppSession(
      signer,
      participantSigners,
      params,
      this,
    );
  }

  async submitAppState(
    signer: MessageSigner,
    participantSigners: MessageSigner[],
    params: SubmitAppStateRequestParamsV04,
  ) {
    return await actions.submitAppState(
      signer,
      participantSigners,
      params,
      this,
    );
  }

  async closeAppSession(
    signer: MessageSigner,
    participantSigners: MessageSigner[],
    params: CloseAppSessionRequestParams,
  ) {
    return await actions.closeAppSession(
      signer,
      participantSigners,
      params,
      this,
    );
  }

  async getAppSession(appSessionId: Hex) {
    return await actions.getAppSession(appSessionId, this);
  }

  async getLedgerBalance(signer: MessageSigner, addressOrSessionId: Hex) {
    return await actions.getLedgerBalance(signer, addressOrSessionId, this);
  }
}
