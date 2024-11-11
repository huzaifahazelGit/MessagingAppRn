import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { ethers } from 'ethers';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { getEthBalance } from './utils/walletServices';
import { useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useMe } from '../../../hooks/useMe';
import Loader from '../../../components/Loader';

const WalletScreen = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const route = useRoute();
  const { walletAddress } = (route.params as any).item;
  const me: any = useMe();
  const [loading, setLoading] = useState(false);
  const copyToClipboard = () => {
    Clipboard.setString(walletAddress);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress) {
        const balance = await getEthBalance(walletAddress);
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [walletAddress]);

  useEffect(() => {
    getTransactionHistory();
  }, []);

  // const getTransactionHistory = async () => {
  //   try {
  //     const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
  //     const transactionHash = me?.walletInfo?.transactionHash;
      
  //     if (transactionHash) {
  //       const history = await provider.getTransaction(transactionHash);
  //       setTransactions([history]); // Assuming you're displaying a single transaction
  //     }
  //   } catch (error) {
  //     console.error('Error fetching transaction history:', error);
  //     Alert.alert(
  //       'Transaction History Error',
  //       `An error occurred while fetching the transaction history: ${error.message}`,
  //       [{ text: 'OK' }]
  //     );
  //   }
  // };

  const getTransactionHistory = async () => {
    setLoading(true)
    try {
      const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
      const transactionHashes = me?.walletInfo?.transactionHashes || [];
      const transactions = [];
  
      for (const hash of transactionHashes) {
        const transaction = await provider.getTransaction(hash);
        transactions.push(transaction);
      }
  
      setTransactions(transactions); // Assuming you're displaying all transactions
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      Alert.alert(
        'Transaction History Error',
        `An error occurred while fetching the transaction history: ${error.message}`,
        [{ text: 'OK' }]
      );
    }finally{
      setLoading(false)
    }
  };
  // const renderTransactionItem = ({ item }) => (
  //   <View style={styles.transactionItem}>
  //     <View style={styles.transactionHeader}>
  //       <Text style={styles.transactionHash}>{item.hash.substring(0, 10)}...</Text>
  //       <Text style={styles.transactionDate}>{new Date(item.blockNumber * 1000).toLocaleDateString()}</Text>
  //     </View>
  //     <View style={styles.transactionDetails}>
  //       <View style={styles.transactionDetailRow}>
  //         <Text style={styles.transactionLabel}>To:</Text>
  //         <Text style={styles.transactionText}>{item.to}</Text>
  //       </View>
  //       <View style={styles.transactionDetailRow}>
  //         <Text style={styles.transactionLabel}>Amount:</Text>
  //         <Text style={styles.transactionAmount}>{ethers.formatEther(item.value)} ETH</Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Block Hash:</Text> {item.blockHash}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Block Number:</Text> {item.blockNumber}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Chain ID:</Text> {item.chainId}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>From:</Text> {item.from}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>To:</Text> {item.to}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Value:</Text> {ethers.formatEther(item.value)} BNB</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Gas Limit:</Text> {item.gasLimit}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Gas Price:</Text> {ethers.formatEther(item.gasPrice)} Gwei</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Transaction Hash:</Text> {item.hash}</Text>
      <Text style={styles.transactionDetail}><Text style={styles.label}>Nonce:</Text> {item.nonce}</Text>
      {item.signature && (
        <>
          <Text style={styles.transactionDetail}><Text style={styles.label}>Signature R:</Text> {item.signature.r}</Text>
          <Text style={styles.transactionDetail}><Text style={styles.label}>Signature S:</Text> {item.signature.s}</Text>
          <Text style={styles.transactionDetail}><Text style={styles.label}>Signature V:</Text> {item.signature.v}</Text>
        </>
      )}
      <Text style={styles.transactionDetail}><Text style={styles.label}>Index:</Text> {item.index}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../src/eth-bg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Wallet Address</Text>
          <Text style={styles.content}>{walletAddress}</Text>
          <View style={{ flexDirection: "row", alignSelf: "flex-end", }}>
            <TouchableOpacity onPress={copyToClipboard}>
              <Image source={require("../assets/copy.png")} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Ethereum Balance</Text>
          <Text style={styles.content}>{balance !== null ? `${balance} ETH` : 'Loading...'}</Text>
        </View>

        <View style={styles.card}>
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.hash}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <Loader isLoading={loading} />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5f5f7',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#f5f5f7',
  },
  copyIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  // transactionItem: {
  //   backgroundColor: '#2c2c2e',
  //   borderRadius: 10,
  //   padding: 12,
  //   marginBottom: 12,
  // },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionHash: {
    fontSize: 14,
    color: '#ff9f0a',
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#8e8e93',
  },
  // transactionDetails: {
  //   paddingLeft: 8,
  // },
  transactionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  transactionLabel: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '600',
  },
  transactionText: {
    fontSize: 14,
    color: '#f5f5f7',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#32d74b',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  transactionDetail: {
    color: '#333',
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  transactionItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  // transactionDetail: {
  //   fontSize: 16,
  //   marginBottom: 8,
  //   color: '#555',
  // },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default WalletScreen;
