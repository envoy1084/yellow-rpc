import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ActivateAppSessionRequestSchema,
  ActivateAppSessionResponseSchema,
  AppSessionCreationFailed,
  AppSessionNotFound,
  AppSessionUpdateFailed,
  ConfirmDepositFundsRequestSchema,
  ConfirmDepositFundsResponseSchema,
  GetAppSessionRequestSchema,
  GetAppSessionResponseSchema,
  PrepareCreateAppSessionResponseSchema,
  PrepareCreateAppSessionSchema,
  PrepareDepositFundsRequestSchema,
  PrepareDepositFundsResponseSchema,
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
    HttpApiEndpoint.post("prepareDeposit", "/session/prepare-deposit")
      .setPayload(PrepareDepositFundsRequestSchema)
      .addSuccess(PrepareDepositFundsResponseSchema)
      .addError(AppSessionUpdateFailed, { status: 500 })
      .addError(AppSessionNotFound, { status: 404 }),
  )
  .add(
    HttpApiEndpoint.post("confirmDeposit", "/session/confirm-deposit")
      .setPayload(ConfirmDepositFundsRequestSchema)
      .addSuccess(ConfirmDepositFundsResponseSchema)
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
