import 'react-native-get-random-values'; // Ensure this is imported first
import '@ethersproject/shims';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import abi from './abi.json'; // Replace with the actual path to your ABI file
import { Alert } from 'react-native';

const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
const contractAddress = '0xA41E6dB3B2001cBED85051Ad8c3e97971eD21fC6';

// Function to decrypt the private key
export const decryptRealmPrivateKey = (encryptedPrivateKey, encryptionKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, encryptionKey);
    const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPrivateKey;
  } catch (error) {
    console.error('Failed to decrypt private key', error);
    throw error;
  }
};

// Function to get the wallet balance
export const getRealmWalletBalance = async (decryptedPrivateKey, address) => {
  try {
    const wallet = new ethers.Wallet(decryptedPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const balance = await contract.balanceOf(address);
    const decimals = 18; // Replace with your token's decimals if different
    const formattedBalance = ethers.formatUnits(balance, decimals);
    return formattedBalance;
  } catch (error) {
    console.error('Failed to get balance', error);
    throw error;
  }
};

// Function to transfer tokens
export const transferTokens = async (decryptedPrivateKey, recipient, amount) => {
  try {
    const wallet = new ethers.Wallet(decryptedPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const balance = await contract.balanceOf(wallet.address);
    const decimals = 18; // Replace with your token's decimals if different
    const amountToSend = ethers.parseUnits(amount, decimals);

  
    // Execute the transfer
    const tx = await contract.transfer(recipient, amountToSend);
    // Wait for the transaction to be mined
    await tx.wait();
    return 'Transfer successful!';
  } catch (error) {
    console.error('Transfer failed', error);
    throw error;
  }
};
