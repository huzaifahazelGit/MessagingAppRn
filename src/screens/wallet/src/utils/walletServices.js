import { ethers } from 'ethers';
import 'react-native-get-random-values'; // Ensure this is imported first
import '@ethersproject/shims';
import { Alert } from 'react-native';

export const getEthBalance = async (account) => {
    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance)
    } catch (error) {
      Alert.alert("Info",error)
      console.error('Error getting balance:', error);
    }
  };