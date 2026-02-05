import { createServer } from "node:http";

import {
  FetchHttpClient,
  HttpApiBuilder,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { api } from "@yellow-rpc/api";
import { ApiKeyRepositoryLive } from "@yellow-rpc/domain/apiKey";
import { AppSessionRepositoryLive } from "@yellow-rpc/domain/session";
import { Layer } from "effect";

import { ApiKeyLive } from "@/routes/api-key";
import { HealthLive } from "@/routes/health";
import { RpcLive } from "@/routes/rpc";

import { EnvLive } from "./env";
import { AdminLive } from "./layers";
import { Middlewares } from "./middlewares";

const YellowRpcApiLive = HttpApiBuilder.api(api).pipe(
  Layer.provideMerge(HealthLive),
  Layer.provideMerge(ApiKeyLive),
  Layer.provideMerge(RpcLive),
  Layer.provide(ApiKeyRepositoryLive),
  Layer.provide(AppSessionRepositoryLive),
  Layer.provide(AdminLive),
  Layer.provide(EnvLive),
  Layer.provideMerge(FetchHttpClient.layer),
);

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  // Middlewares
  Layer.provide(Middlewares),
  // Log the server's listening address
  HttpServer.withLogAddress,
  // Set up the Node.js HTTP server
  Layer.provideMerge(YellowRpcApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8080 })),
);
