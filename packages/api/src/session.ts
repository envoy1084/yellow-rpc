import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";

import {
  ActivateAppSessionRequestSchema,
  ActivateAppSessionResponseSchema,
  PrepareCreateAppSessionResponseSchema,
  PrepareCreateAppSessionSchema,
} from "./dto";

export const sessionGroup = HttpApiGroup.make("session")
  .add(
    HttpApiEndpoint.get("prepare", "/session/prepare")
      .setPayload(PrepareCreateAppSessionSchema)
      .addSuccess(PrepareCreateAppSessionResponseSchema),
  )
  .add(
    HttpApiEndpoint.get("activate", "/session/activate")
      .setPayload(ActivateAppSessionRequestSchema)
      .addSuccess(ActivateAppSessionResponseSchema),
  );
