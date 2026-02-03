# Yellow RPC


## Flow

### Phase 1: API Key Creation

1. User request to create an api key with parameters:
   - Name
   - Chain
   - Initial Balance
   - Expiry Date

Sends this request to (`/api-key/prepare`) 

2. Backend receives this request
   - Creates a new Session Key Pair (`privateKey`, `publicKey`)
   - Creates a new API Key (`sk_live_123`) with status as `pending`
   - Constructs a AuthRequestMessage with required allowances and expiry date to approve the session public key
   - Sends this message with apiKey Id to user.

3. User approves the session public key
   - User takes this AuthRequestMessage and creates approves the session with it's own wallet.
   - Calls (`/api-key/activate`) with the returned jwt token and apiKey Id

4. Backend receives this request
  - Checks if jwt token is valid
  - Creates a new AppSession with sessionPrivateKey and locks User's Balance to the AppSession
  - Creates necessary redis keys for managing the AppSession
  - Returns the apiKey to the user


## Phase 2: Key Usage

1. User uses the api key to request to RPC

2. Request Reaches the backend, it does the following:
   - Checks if apiKey exists and status is `active`
   - Calculate the needed cost for executing the RPC Request.
   - Checks if the user has enough balance to execute the RPC Request. if not return 402 error.
   - Store the cost credits and debits to redis. (not yet broadcast to network)
   - Forward the request to provider
   - Return the response to the user

## Phase 3: Updates

Periodically, the backend will try to update the app state with the latest balance changes.

- Triggered by a cron job/event/etc
- Gets the latest balance changes from redis.
- Constructs a SubmitAppStateMessage with the latest balance changes.
- Signs it with user's sessionKey and admins sessionKey.
- Sends the message to the network.
- Capture the update in redis.