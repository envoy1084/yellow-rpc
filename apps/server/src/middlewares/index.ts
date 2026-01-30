import { HttpApiBuilder, HttpApiScalar } from "@effect/platform";
import { Layer } from "effect";

const corsMiddleware = HttpApiBuilder.middlewareCors();

export const Middlewares = Layer.mergeAll(
  corsMiddleware,
  HttpApiBuilder.middlewareOpenApi({
    path: "/openapi.json",
  }),
  HttpApiScalar.layer({
    path: "/docs",
  }),
);
