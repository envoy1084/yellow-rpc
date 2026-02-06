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
