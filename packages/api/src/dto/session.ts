import { AddressSchema, AppSessionSchema, HexSchema } from "@yellow-rpc/schema";
import { Schema } from "effect";

export const PrepareCreateAppSessionSchema = Schema.Struct({
  walletAddress: AddressSchema,
});

export const PrepareCreateAppSessionResponseSchema = Schema.Struct({
  authParams: Schema.String,
  id: Schema.String,
});

export const ActivateAppSessionRequestSchema = Schema.Struct({
  id: Schema.String,
  signature: Schema.String,
  walletAddress: AddressSchema,
});

export const ActivateAppSessionResponseSchema = Schema.Struct({
  appSessionId: Schema.String,
});

export const GetAppSessionRequestSchema = Schema.Struct({
  walletAddress: Schema.optional(AddressSchema),
});

export const GetAppSessionResponseSchema = Schema.Struct({
  session: Schema.Union(Schema.Null, AppSessionSchema),
});

export const DepositFundsRequestSchema = Schema.Struct({
  amount: Schema.NumberFromString,
  sessionKey: AddressSchema,
  sessionPrivateKey: HexSchema,
  walletAddress: AddressSchema,
});

export const DepositFundsResponseSchema = Schema.Struct({
  success: Schema.Boolean,
});

export const WithdrawFundsRequestSchema = Schema.Struct({
  amount: Schema.NumberFromString,
  walletAddress: AddressSchema,
});

export const WithdrawFundsResponseSchema = Schema.Struct({
  success: Schema.Boolean,
});

export type PrepareCreateAppSessionRequest =
  typeof PrepareCreateAppSessionSchema.Type;
export type PrepareCreateAppSessionResponse =
  typeof PrepareCreateAppSessionResponseSchema.Type;

export type ActivateAppSessionRequest =
  typeof ActivateAppSessionRequestSchema.Type;
export type ActivateAppSessionResponse =
  typeof ActivateAppSessionResponseSchema.Type;

export type GetAppSessionRequest = typeof GetAppSessionRequestSchema.Type;
export type GetAppSessionResponse = typeof GetAppSessionResponseSchema.Type;

export type DepositFundsRequest = typeof DepositFundsRequestSchema.Type;
export type DepositFundsResponse = typeof DepositFundsResponseSchema.Type;

export type WithdrawFundsRequest = typeof WithdrawFundsRequestSchema.Type;
export type WithdrawFundsResponse = typeof WithdrawFundsResponseSchema.Type;

export class AppSessionNotFound extends Schema.TaggedError<AppSessionNotFound>()(
  "AppSessionNotFound",
  {},
) {}

export class AppSessionCreationFailed extends Schema.TaggedError<AppSessionCreationFailed>()(
  "AppSessionCreationFailed",
  {
    message: Schema.String,
  },
) {}

export class AppSessionUpdateFailed extends Schema.TaggedError<AppSessionUpdateFailed>()(
  "AppSessionUpdateFailed",
  {
    message: Schema.String,
  },
) {}

export class InsufficientAvailableBalance extends Schema.TaggedError<InsufficientAvailableBalance>()(
  "InsufficientAvailableBalance",
  {
    message: Schema.String,
  },
) {}
