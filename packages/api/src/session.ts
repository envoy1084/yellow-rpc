import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ActivateAppSessionRequestSchema,
  ActivateAppSessionResponseSchema,
  AppSessionCreationFailed,
  AppSessionNotFound,
  AppSessionUpdateFailed,
  DepositFundsRequestSchema,
  DepositFundsResponseSchema,
  GetAppSessionRequestSchema,
  GetAppSessionResponseSchema,
  InsufficientAvailableBalance,
  PrepareCreateAppSessionResponseSchema,
  PrepareCreateAppSessionSchema,
  WithdrawFundsRequestSchema,
  WithdrawFundsResponseSchema,
} from "./dto";

export const sessionGroup = HttpApiGroup.make("session")
  .add(
    HttpApiEndpoint.get("getSession", "/session")
      .addSuccess(GetAppSessionResponseSchema)
      .setPayload(GetAppSessionRequestSchema),
  )
  .add(
    HttpApiEndpoint.post("prepare", "/session/prepare")
      .setPayload(PrepareCreateAppSessionSchema)
      .addSuccess(PrepareCreateAppSessionResponseSchema)
      .addError(AppSessionCreationFailed, { status: 500 }),
  )
  .add(
    HttpApiEndpoint.post("deposit", "/session/deposit")
      .setPayload(DepositFundsRequestSchema)
      .addSuccess(DepositFundsResponseSchema)
      .addError(AppSessionUpdateFailed, { status: 500 })
      .addError(AppSessionNotFound, { status: 404 }),
  )
  .add(
    HttpApiEndpoint.post("withdraw", "/session/withdraw")
      .setPayload(WithdrawFundsRequestSchema)
      .addSuccess(WithdrawFundsResponseSchema)
      .addError(InsufficientAvailableBalance, { status: 400 })
      .addError(AppSessionUpdateFailed, { status: 500 })
      .addError(AppSessionNotFound, { status: 404 }),
  )
  .add(
    HttpApiEndpoint.post("activate", "/session/activate")
      .setPayload(ActivateAppSessionRequestSchema)
      .addSuccess(ActivateAppSessionResponseSchema)
      .addError(AppSessionNotFound, { status: 404 })
      .addError(AppSessionCreationFailed, { status: 500 })
      .addError(AppSessionUpdateFailed, { status: 500 }),
  );
