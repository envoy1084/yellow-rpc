import { createServer } from "node:http";

import { HttpApiBuilder, HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { api } from "@yellow-rpc/api";
import { Layer } from "effect";

import { HealthLive, HealthTest } from "@/routes/health";

import { Middlewares } from "./middlewares";

const YellowRpcApiLive = HttpApiBuilder.api(api).pipe(
  Layer.provide(HealthLive),
);

const YellowRpcApiTest = HttpApiBuilder.api(api).pipe(
  Layer.provide(HealthTest),
);

const HttpBase = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  // Middlewares
  Layer.provide(Middlewares),
  // Log the server's listening address
  HttpServer.withLogAddress,
  // Set up the Node.js HTTP server
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8080 })),
);

export const HttpLive = HttpBase.pipe(Layer.provide(YellowRpcApiLive));
export const HttpTest = HttpBase.pipe(Layer.provide(YellowRpcApiTest));
