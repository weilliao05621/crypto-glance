import { Brand } from "./brand";

export type ChainId = Brand<number, "ChainId">;

export type Address = Brand<`0x${string}` | undefined, "Address">;

export type TokenName = Brand<string, "TokenName">;
