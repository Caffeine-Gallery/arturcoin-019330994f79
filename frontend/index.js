import { backend } from "declarations/backend";
import { Principal } from "@dfinity/principal";

let userPrincipal;

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
document.getElementById('mintBtn').onclick = mint;
document.getElementById('transferBtn').onclick = transfer;

// Get user's principal ID when the page loads
async function initialize() {
    try {
        userPrincipal = await (await window.ic?.plug?.agent?.getPrincipal()) || undefined;
        await refreshTokenInfo();
    } catch (error) {
        showNotification('Error initializing application', 'danger');
    }
}

window.onload = initialize;
