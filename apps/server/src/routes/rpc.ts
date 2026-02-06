import {
  HttpApiBuilder,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { RedisCore } from "@envoy1084/effect-redis";
import {
  api,
  InvalidApiKey,
  type JsonRpcRequest,
  JsonRpcResponse,
  PaymentRequired,
} from "@yellow-rpc/api";
import { keyHasher } from "@yellow-rpc/domain/helpers";
import { Effect, Redacted, Schema } from "effect";

import { Env } from "@/env";
import { getAlchemyUrl } from "@/helpers";
import { Settlement } from "@/layers";

const chargeScript = `
-- ARGV[0]: Redis Script Name
-- ARGV[1]: Hashed Key
-- ARGV[2]: Cost (number)
-- ARGV[3]: Threshold (number) to trigger settlement
-- ARGV[4]: Current ISO Timestamp (string) for updatedAt

local hashedKey = ARGV[1]
local cost = tonumber(ARGV[2])
local threshold = tonumber(ARGV[3])
local now = ARGV[4]

-- Status Map
-- -1: Invalid ApiKey (Not Found)
-- -2: Insufficient User Balance
-- -3: Session not active
-- 1: Success
-- 2: Needs Settlement

-- Reverse Lookup (Hashed Key -> ApiKey Id)
local apiKeyId = redis.call('GET', 'api_key_reverse:' .. hashedKey)
if not apiKeyId then return { -1, "" } end -- Invalid ApiKey

-- Get AppSession Id from ApiKey
local appSessionId = redis.call('HGET', 'api_key:' .. apiKeyId, 'appSessionId')

if not appSessionId then return { -1, "" } end -- AppSession not Found (Key Not Activated)
local sessionKey = 'app_session:' .. apiKeyId

-- Get User Balance
local userBalance = tonumber(redis.call('HGET', sessionKey, 'userBalance'))
local status = redis.call('HGET', sessionKey, 'status')

if status ~= 'open' then return { -3, "" } end   -- Session not active
if userBalance < cost then return { -2, "" } end -- Insufficient funds

-- Execute Charge Logic
redis.call('HINCRBYFLOAT', sessionKey, 'userBalance', -cost)
redis.call('HINCRBYFLOAT', sessionKey, 'adminBalance', cost)
redis.call('HINCRBYFLOAT', sessionKey, 'pendingSettlement', cost)
redis.call('HSET', sessionKey, 'updatedAt', now)

local newPending = redis.call('HINCRBYFLOAT', sessionKey, 'pendingSettlement', cost)

if newPending >= threshold then
    return { 2, apiKeyId } -- Success and Settle
else
    return { 1, apiKeyId } -- Success
end
`;

const rpcHandler = (payload: JsonRpcRequest, apiKey: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const env = yield* Env;
    const redis = yield* RedisCore;
    const settlement = yield* Settlement;

    const hashed = keyHasher(apiKey);

    // Step 1: Charge the user
    const chargeRes = yield* redis
      .eval(chargeScript, {
        arguments: [
          hashed, // Hashed Key
          "0.01", // Cost // TODO: Update this
          "1", // Threshold // TODO: Update this
          new Date().toISOString(), // Current ISO Timestamp
        ],
      })
      .pipe(Effect.catchTag("RedisError", () => new InvalidApiKey()));

    const [statusCode, apiKeyId] = chargeRes as [number, string];
    if (statusCode === -2) return yield* Effect.fail(new PaymentRequired());
    if (statusCode < 0) return yield* Effect.fail(new InvalidApiKey());
    if (statusCode === 2) {
      yield* settlement.enqueue(apiKeyId);
    }

    // Step 2: Proxy the request to the node
    const res = yield* Effect.gen(function* () {
      const url = getAlchemyUrl(
        "ethereum",
        Redacted.value(env.alchemyApiToken),
      );
      const upstreamRequest = yield* HttpClientRequest.post(url).pipe(
        HttpClientRequest.bodyJson(payload),
      );

      const response = yield* client.execute(upstreamRequest).pipe();
      const json = yield* response.json;

      return json;
    }).pipe(
      Effect.catchAll((e) =>
        Effect.succeed({
          error: "RpcError",
          message: e.toString(),
        }),
      ),
    );

    return Schema.decodeUnknownSync(JsonRpcResponse)(res);
  });

export const RpcLive = HttpApiBuilder.group(api, "rpc", (handlers) =>
  handlers.handle("execute", ({ payload, headers }) =>
    rpcHandler(payload, headers["x-api-key"]),
  ),
);

export const RpcTest = RpcLive;
