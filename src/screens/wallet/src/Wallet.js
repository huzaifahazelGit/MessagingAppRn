import 'react-native-get-random-values'; // Ensure this is imported first
import '@ethersproject/shims';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { ethers } from 'ethers';

const Wallet = () => {
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const createWallet = () => {
    try {
      const wallet = ethers.Wallet.createRandom();
      console.log("===wallet address===", wallet.address);
      console.log("===wallet prvKey===", wallet.privateKey);
      setAccount(wallet.address);
      setPrivateKey(wallet.privateKey);
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  const getBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      Alert.alert("Info",error)
      console.error('Error getting balance:', error);
    }
  };

  const sendTransaction = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
      const wallet = new ethers.Wallet(privateKey, provider);
      const tx = {
        to: '0x23528d2374F68dDd298aF55741954110D4429195',
        value: ethers.parseEther('0.0001'),
        gasLimit: 30000,
      };

      const transaction = await wallet.sendTransaction(tx);
      setTransactionHash(transaction.hash);
      console.log('Transaction:', transaction);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create a New Wallet</Text>
        <Button title="Create Wallet" onPress={createWallet} />
        {account ? (
          <View style={styles.walletInfo}>
            <Text style={styles.label}>New Wallet Address:</Text>
            <Text style={styles.value}>{account}</Text>
            <Text style={styles.label}>Private Key:</Text>
            <Text style={styles.value}>{privateKey}</Text>
            <Button title="Get Balance" onPress={getBalance} />
            {balance ? (
              <View style={styles.balanceInfo}>
                <Text style={styles.label}>Balance:</Text>
                <Text style={styles.value}>{balance} ETH</Text>
              </View>
            ) : null}
            <Button title="Send 0.01 ETH to Dummy Address" onPress={sendTransaction} />
          </View>
        ) : null}
        {transactionHash ? (
          <View style={styles.transactionInfo}>
            <Text style={styles.label}>Transaction Hash:</Text>
            <Text style={styles.value}>{transactionHash}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:"white"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  walletInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  transactionInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  balanceInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginVertical: 5,
    wordWrap: 'break-word',
  },
});

export default Wallet;
