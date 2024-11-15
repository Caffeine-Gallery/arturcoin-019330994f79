import { backend } from "declarations/backend";
import { Principal } from "@dfinity/principal";

let userPrincipal;

const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

async function connectWallet() {
    try {
        const publicKey = await window.ic.plug.requestConnect({
            whitelist: [LEDGER_CANISTER_ID],
        });

        if (publicKey) {
            const principal = await window.ic.plug.agent.getPrincipal();
            userPrincipal = principal;
            
            document.getElementById('connectWalletBtn').classList.add('d-none');
            document.getElementById('walletStatus').classList.remove('d-none');
            document.getElementById('principalId').textContent = `Principal ID: ${principal.toString()}`;
            
            await refreshBalances();
            await refreshTokenInfo();
        }
    } catch (error) {
        showNotification('Failed to connect wallet: ' + error.message, 'danger');
    }
}

async function refreshBalances() {
    try {
        // Get ICP balance
        const balance = await window.ic.plug.requestBalance();
        const icpBalance = balance.find(b => b.symbol === 'ICP');
        if (icpBalance) {
            document.getElementById('icpBalance').textContent = 
                `ICP Balance: ${Number(icpBalance.amount).toFixed(4)} ICP`;
        }
    } catch (error) {
        showNotification('Error fetching balances', 'danger');
    }
}

async function refreshTokenInfo() {
    try {
        const totalSupply = await backend.getTotalSupply();
        document.getElementById('totalSupply').textContent = `Total Supply: ${totalSupply} ARTR`;
        
        if (userPrincipal) {
            const balance = await backend.balanceOf(userPrincipal);
            document.getElementById('userBalance').textContent = `Your Balance: ${balance} ARTR`;
        }
    } catch (error) {
        showNotification('Error fetching token info', 'danger');
    }
}

async function mint() {
    if (!userPrincipal) {
        showNotification('Please connect your wallet first', 'warning');
        return;
    }

    showSpinner(true);
    try {
        await backend.mint();
        showNotification('Successfully minted tokens!', 'success');
        await refreshTokenInfo();
    } catch (error) {
        showNotification('Error minting tokens', 'danger');
    }
    showSpinner(false);
}

async function transfer() {
    if (!userPrincipal) {
        showNotification('Please connect your wallet first', 'warning');
        return;
    }

    const recipientId = document.getElementById('recipientId').value;
    const amount = parseInt(document.getElementById('amount').value);

    if (!recipientId || !amount) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }

    showSpinner(true);
    try {
        const recipient = Principal.fromText(recipientId);
        const result = await backend.transfer(recipient, amount);
        
        if (result) {
            showNotification('Transfer successful!', 'success');
            await refreshTokenInfo();
        } else {
            showNotification('Transfer failed - insufficient balance', 'danger');
        }
    } catch (error) {
        showNotification('Error during transfer', 'danger');
    }
    showSpinner(false);
}

function showSpinner(show) {
    document.getElementById('spinner').classList.toggle('d-none', !show);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `toast align-items-center text-white bg-${type} border-0`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.getElementById('notifications').appendChild(notification);
    const toast = new bootstrap.Toast(notification);
    toast.show();
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.getElementById('connectWalletBtn').onclick = connectWallet;
document.getElementById('mintBtn').onclick = mint;
document.getElementById('transferBtn').onclick = transfer;

// Check if Plug wallet is installed
window.onload = async () => {
    if (window.ic?.plug) {
        const connected = await window.ic.plug.isConnected();
        if (connected) {
            const principal = await window.ic.plug.agent.getPrincipal();
            userPrincipal = principal;
            document.getElementById('connectWalletBtn').classList.add('d-none');
            document.getElementById('walletStatus').classList.remove('d-none');
            document.getElementById('principalId').textContent = `Principal ID: ${principal.toString()}`;
            await refreshBalances();
            await refreshTokenInfo();
        }
    } else {
        document.getElementById('connectWalletBtn').textContent = 'Please Install Plug Wallet';
        document.getElementById('connectWalletBtn').disabled = true;
    }
};
