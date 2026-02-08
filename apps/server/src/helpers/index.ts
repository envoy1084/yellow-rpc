import type { SupportedChain } from "@yellow-rpc/schema";

export const getAlchemyUrl = (chain: SupportedChain, token: string) => {
  if (chain === "ethereum") {
    return `https://eth-mainnet.g.alchemy.com/v2/${token}`;
  }
  if (chain === "optimism") {
    return `https://opt-mainnet.g.alchemy.com/v2/${token}`;
  }

  if (chain === "base") {
    return `https://base-mainnet.g.alchemy.com/v2/${token}`;
  }

  return "";
};

export const chargeScript = `
-- KEYS: Not used (We use ARGV for dynamic keys)
-- ARGV[1]: Hashed Key (string)
-- ARGV[2]: Cost (Integer/Atomic Units) e.g., "50"
-- ARGV[3]: Threshold (Integer/Atomic Units) e.g., "1000000"
-- ARGV[4]: Current ISO Timestamp (string)

local hashedKey = ARGV[1]
local cost = tonumber(ARGV[2])
local threshold = tonumber(ARGV[3])
local now = tostring(ARGV[4])

-- Status Map
-- -1: Api Key Not Found
-- -2: Session not active
-- -3: Insufficient User Balance
-- 1: Success
-- 2: Needs Settlement

-- Reverse Lookup (Hashed Key -> ApiKey Id)
local apiKeyId = redis.call('GET', 'api_key_reverse:' .. hashedKey)
if not apiKeyId then
    return { -1, "ApiKeyNotFound" }
end

-- Get Owner Address, We need the owner address to find the App Session
local walletAddress = redis.call('HGET', 'api_key:' .. apiKeyId, 'ownerAddress')
if not walletAddress then
    return { -1, "OwnerNotFound" }
end

local appSessionKey = 'app_session:' .. walletAddress

-- Get Balance, Status
local sessionData = redis.call('HMGET', appSessionKey, 'userBalance', 'status')
local userBalance = tonumber(sessionData[1] or '0')
local status = sessionData[2]

if status ~= 'open' then
    return { -2, "SessionNotActive" }
end
if userBalance < cost then
    return { -3, "InsufficientFunds" }
end

-- Execute Charge Logic
redis.call('HINCRBY', appSessionKey, 'userBalance', -cost)
redis.call('HINCRBY', appSessionKey, 'adminBalance', cost)
local newPending = redis.call('HINCRBY', appSessionKey, 'pendingSettlement', cost)

-- Update Timestamps
redis.call('HSET', appSessionKey, 'updatedAt', now)
redis.call('HSET', 'api_key:' .. apiKeyId, 'lastUsedAt', now)

-- Settlement Check
if newPending >= threshold then
    return { 2, walletAddress } -- Code 2: Success + Trigger Settlement
else
    return { 1, walletAddress } -- Code 1: Success
end
`;

export * from "./session";
