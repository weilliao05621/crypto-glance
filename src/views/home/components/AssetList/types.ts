import { type Hash, type Address } from "viem";

import { type ValidToken } from "~/constants/tokens";

export type SelectedToken = {
  token: ValidToken;
  decimals: number;
  address?: Address;
};

export type PendingTx = {
  hash: Hash;
  amount: string;
  token: ValidToken;
  to: Address;
};

export type SuccessTxReceipt = PendingTx & { type?: string };
