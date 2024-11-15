export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getDecimals' : IDL.Func([], [IDL.Nat], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getSymbol' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'mint' : IDL.Func([], [], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
