import {
  createGetLedgerBalancesMessage,
  type ErrorResponse,
  type GetLedgerBalancesResponse,
  type MessageSigner,
} from "@erc7824/nitrolite";
import type { Hex } from "viem";
import type { Client } from "yellow-ts";

export const getLedgerBalance = async (
  signer: MessageSigner,
  accountOrSessionId: Hex,
  client: Client,
) => {
  const msg = await createGetLedgerBalancesMessage(signer, accountOrSessionId);

  return (await client.sendMessage(msg)) as
    | GetLedgerBalancesResponse
    | ErrorResponse;
};
