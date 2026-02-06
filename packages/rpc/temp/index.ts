import {
  createAppSessionMessage,
  createCloseAppSessionMessage,
  createSubmitAppStateMessage,
  type RPCAppDefinition,
  type RPCAppSessionAllocation,
  RPCAppStateIntent,
  RPCMethod,
  RPCProtocolVersion,
  type RPCResponse,
} from "@erc7824/nitrolite";
import { Client } from "yellow-ts";

import "dotenv/config";

const asset = "ytest.usd";

import { authenticate } from "./helpers";
import { adminWalletClient, userWalletClient } from "./wallet";

const clientAdmin = new Client({
  url: "wss://clearnet-sandbox.yellow.com/ws",
});

const clientUser = new Client({
  url: "wss://clearnet-sandbox.yellow.com/ws",
});

await clientAdmin.connect();
await clientUser.connect();

clientUser.listen((data: RPCResponse) => {
  if (data.method === RPCMethod.BalanceUpdate) {
    const newBalance = data.params.balanceUpdates[0]?.amount ?? "0";
    console.log("User Balance: ", newBalance);
  }
});

clientAdmin.listen((data: RPCResponse) => {
  if (data.method === RPCMethod.BalanceUpdate) {
    const newBalance = data.params.balanceUpdates[0]?.amount ?? "0";
    console.log("Admin Balance: ", newBalance);
  }
});

const adminAddress = adminWalletClient.account.address;
const userAddress = userWalletClient.account.address;

console.log("Admin Address: ", adminAddress);
console.log("User Address: ", userAddress);

const session1 = await authenticate(adminWalletClient, clientAdmin);
const session2 = await authenticate(userWalletClient, clientUser);

const appDefinition: RPCAppDefinition = {
  application: "YellowRPC",
  challenge: 0, // No challenge period
  nonce: Date.now(), // Unique session identifier
  participants: [adminAddress, userAddress],
  protocol: RPCProtocolVersion.NitroRPC_0_4,
  quorum: 2, // Requires unanimous agreement
  weights: [1, 1], // Equal voting power
};

const initialAllocation = [
  { amount: "1", asset, participant: userAddress },
  { amount: "0", asset, participant: adminAddress },
] as RPCAppSessionAllocation[];

// User Creates a channel
const sessionMessage = await createAppSessionMessage(
  session1.sessionKey.signer,
  {
    allocations: initialAllocation,
    definition: appDefinition,
  },
);

const sessionMessageJson = JSON.parse(sessionMessage);
const sigCreate = await session2.sessionKey.signer(sessionMessageJson.req);
sessionMessageJson.sig.push(sigCreate);

console.log("Admin Creating App Session...");
const sessionResponse = await clientAdmin.sendMessage(
  JSON.stringify(sessionMessageJson),
);
console.log("App Session Created Id: ", sessionResponse.params);

const newAllocation = [
  { amount: "0.75", asset, participant: userAddress },
  { amount: "0.25", asset, participant: adminAddress },
];

const updateMessage = await createSubmitAppStateMessage(
  session1.sessionKey.signer,
  {
    allocations: newAllocation,
    app_session_id: sessionResponse.params.appSessionId,
    intent: RPCAppStateIntent.Operate,
    version: 2,
  },
);

const updateMessageJson = JSON.parse(updateMessage);
console.log("Admin Updating App Session...");

// Admin signs the update message
const sigUpdate = await session2.sessionKey.signer(updateMessageJson.req);

const updateMessageSigned = {
  ...updateMessageJson,
  sig: [...updateMessageJson.sig, sigUpdate],
};

console.log("Update Message Signed by User: ", sigUpdate);

const resUpdate = await clientAdmin.sendMessage(
  JSON.stringify(updateMessageSigned),
);
console.log("App Session Updated", resUpdate.params);

const finalAllocation = [
  { amount: "0.5", asset, participant: userAddress },
  { amount: "0.5", asset, participant: adminAddress },
] as RPCAppSessionAllocation[];

const closeMessage = await createCloseAppSessionMessage(
  session1.sessionKey.signer,
  {
    allocations: finalAllocation,
    app_session_id: sessionResponse.params.appSessionId,
  },
);

const closeMessageJson = JSON.parse(closeMessage);
console.log("Admin Closing App Session...");

// Admin signs the close message
const sig2 = await session2.sessionKey.signer(closeMessageJson.req);
closeMessageJson.sig.push(sig2);

const res = await clientAdmin.sendMessage(JSON.stringify(closeMessageJson));
console.log("Closed App Session", res.params);

await clientUser.disconnect();
