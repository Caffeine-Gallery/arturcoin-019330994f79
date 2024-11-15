import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'getDecimals' : ActorMethod<[], bigint>,
  'getName' : ActorMethod<[], string>,
  'getSymbol' : ActorMethod<[], string>,
  'getTotalSupply' : ActorMethod<[], bigint>,
  'mint' : ActorMethod<[], undefined>,
  'transfer' : ActorMethod<[Principal, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
