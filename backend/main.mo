import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Text "mo:base/Text";

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Nat "mo:base/Nat";

actor ArturToken {
    let name : Text = "Artur Token";
    let symbol : Text = "ARTR";
    let decimals : Nat = 8;
    var totalSupply : Nat = 1_000_000_000; // 1 billion tokens

    private stable var balanceEntries : [(Principal, Nat)] = [];
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    public shared(msg) func mint() : async () {
        let amount = 10_000; // mint 10k tokens
        let caller = msg.caller;
        
        let currentBalance = Option.get(balances.get(caller), 0);
        balances.put(caller, currentBalance + amount);
        totalSupply += amount;
    };

    public shared(msg) func transfer(to: Principal, amount: Nat) : async Bool {
        let from = msg.caller;
        let fromBalance = Option.get(balances.get(from), 0);
        
        if (fromBalance >= amount) {
            let newFromBalance = fromBalance - amount;
            balances.put(from, newFromBalance);
            
            let toBalance = Option.get(balances.get(to), 0);
            balances.put(to, toBalance + amount);
            return true;
        } else {
            return false;
        };
    };

    public query func balanceOf(who: Principal) : async Nat {
        return Option.get(balances.get(who), 0);
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public query func getName() : async Text {
        return name;
    };

    public query func getDecimals() : async Nat {
        return decimals;
    };

    public query func getTotalSupply() : async Nat {
        return totalSupply;
    };

    system func preupgrade() {
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
    };
}
