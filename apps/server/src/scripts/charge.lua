-- ARGV[0]: Redis Script Name
-- ARGV[1]: Hashed Key
-- ARGV[2]: Cost (number)
-- ARGV[3]: Threshold (number) to trigger settlement
-- ARGV[4]: Current ISO Timestamp (string) for updatedAt

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
if not apiKeyId then return { -1, "" } end -- Api Key not found

-- Get Wallet Address from ApiKey
local walletAddress = tostring(redis.call('HGET', 'api_key:' .. apiKeyId, 'ownerAddress'))
local appSessionKey = 'app_session:' .. walletAddress

-- Get User Balance
local userBalance = tonumber(redis.call('HGET', appSessionKey, 'userBalance'))
local status = redis.call('HGET', appSessionKey, 'status')

if status ~= 'open' then return { -2, "" } end   -- Session not active
if userBalance < cost then return { -3, "" } end -- Insufficient funds

-- Execute Charge Logic
redis.call('HINCRBYFLOAT', appSessionKey, 'userBalance', -cost)
redis.call('HINCRBYFLOAT', appSessionKey, 'adminBalance', cost)
redis.call('HINCRBYFLOAT', appSessionKey, 'pendingSettlement', cost)
-- Update Updated At and Last Used Timestamps
redis.call('HSET', appSessionKey, 'updatedAt', now)
redis.call('HSET', "api_key:" .. apiKeyId, 'lastUsedAt', now)

local newPending = tonumber(redis.call('HGET', appSessionKey, 'pendingSettlement'))

if newPending >= threshold then
    return { 2, walletAddress } -- Success and Settle
else
    return { 1, walletAddress } -- Success
end
