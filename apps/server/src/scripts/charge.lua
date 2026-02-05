local hashedKey = ARGV[1]
local cost = tonumber(ARGV[2])
local now = ARGV[3]

-- Reverse Lookup (Hashed Key -> ApiKey Id)
local apiKeyId = redis.call('GET', 'api_key_reverse:' .. hashedKey)
if not apiKeyId then return -2 end -- Invalid ApiKey

-- Get AppSession Id from ApiKey
local appSessionId = redis.call('HGET', 'api_key:' .. apiKeyId, 'appSessionId')

if not appSessionId then return -2 end -- AppSession not Found (Invalid ApiKey)

local sessionKey = 'app_session:' .. apiKeyId


-- Get User Balance
local userBalance = tonumber(redis.call('HGET', sessionKey, 'userBalance') or '-1')
local status = redis.call('HGET', sessionKey, 'status')

if status ~= 'open' then return -3 end -- Session not active
if userBalance < cost then return -1 end -- Insufficient funds

-- Execute Charge Logic
redis.call('HINCRBYFLOAT', sessionKey, 'userBalance', -cost)
redis.call('HINCRBYFLOAT', sessionKey, 'adminBalance', cost)
redis.call('HINCRBYFLOAT', sessionKey, 'pendingSettlement', cost)
redis.call('HSET', sessionKey, 'updatedAt', now)

return 1