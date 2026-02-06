import { AddressSchema } from "@yellow-rpc/schema";
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

export type PrepareCreateAppSessionRequest =
  typeof PrepareCreateAppSessionSchema.Type;
export type PrepareCreateAppSessionResponse =
  typeof PrepareCreateAppSessionResponseSchema.Type;

export type ActivateAppSessionRequest =
  typeof ActivateAppSessionRequestSchema.Type;
export type ActivateAppSessionResponse =
  typeof ActivateAppSessionResponseSchema.Type;

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
