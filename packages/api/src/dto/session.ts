import { Schema } from "effect";

export const PrepareCreateAppSessionSchema = Schema.Struct({
  walletAddress: Schema.String,
});

export const PrepareCreateAppSessionResponseSchema = Schema.Struct({
  authParams: Schema.String,
  id: Schema.String,
});

export const ActivateAppSessionRequestSchema = Schema.Struct({
  id: Schema.String,
  signature: Schema.String,
  walletAddress: Schema.String,
});

export const ActivateAppSessionResponseSchema = Schema.Struct({
  appSessionId: Schema.String,
});

export type PrepareCreateAppSessionRequest =
  typeof PrepareCreateAppSessionSchema.Type;
export type PrepareCreateAppSessionResponse =
  typeof PrepareCreateAppSessionResponseSchema.Type;

export type ActivateAppSessionRequest =
  typeof ActivateAppSessionRequestSchema.Type;
export type ActivateAppSessionResponse =
  typeof ActivateAppSessionResponseSchema.Type;
