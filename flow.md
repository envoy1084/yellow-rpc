# Yellow RPC

> Unified Balance -> Off-chain balance maintained by the Yellow RPC, you can deposit funds inside the contract on-chain and it gets converted to unified balance.
> AppSession Balance -> you can allocate funds from the unified balance to the app session balance, where it is locked and can be used for operations inside the app session.

## Flow

### Phase 1: App Session Creation

1. User creates a new app session with 0 initial balance.
2. User can deposit funds from the unified balance to the app session balance.
3. User can also withdraw funds from the app session balance to the unified balance.

User Sends this request to (`/session/create`)

Backend receives this request
   - Creates a new Session Key Pair (`privateKey`, `publicKey`) for both the user and the admin.
   - Creates a new App Session with both signers and 0 initial balance.
   - Sends the user `publicKey` to frontend for authorization.
Frontend receives this request
   - User takes this `publicKey` and creates approves the session with it's own wallet.
   - Calls (`/session/activate`) with the returned jwt token and sessionId
Backend receives this request
  - Checks if jwt token is valid
  - Marks the app session as active.

### Phase 2: API Key Creation

1. User request to create an api key with parameters:
   - Name
   - Chain
   - Initial Balance
   - Expiry Date

Sends this request to (`/api-key`) 

1. Backend receives this request
   - Creates a new API Key (`sk_live_123`) and returns it to the user.

## Phase 2: Key Usage

1. User uses the apiKey to request to RPC

2. Request Reaches the backend, it does the following:
   - Checks if apiKey exists and status is `active`
   - Calculate the needed cost for executing the RPC Request.
   - Checks if the appSession is active and has enough balance to execute the RPC Request. if not return 402 error.
   - Store the cost credits and debits to redis. (not yet broadcast to network)
   - Forward the request to provider
   - Return the response to the user

## Phase 3: Updates

Periodically, or every ($1 in pendingSettlements) the backend will try to update the app state with the latest balance changes.

- Gets the latest balance changes for the app session from redis.
- Constructs a SubmitAppStateMessage with the latest balance changes.
- Signs it with user's sessionKey and admins sessionKey.
- Sends the message to the network.
- Capture the update in redis.


## Redis Structure

1. `app_session:<walletAddress>`: AppSession
2. `api_key:<apiKeyId>`: ApiKey
3. `api_keys:<walletAddress>`: Api Keys created by a user
4. `api_key_reverse:<hashedApiKey>`: Reverse Lookup for ApiKey

