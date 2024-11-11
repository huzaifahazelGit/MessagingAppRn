import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { fetchPayoutsHistory } from '../utils/payoutsService';
import { useMe } from '../../../hooks/useMe';
// import { fetchPayoutsHistory } from './yourPayoutFunctions'; // Import your payout functions

const CustomTabBar = ({ activeStatus, setActiveStatus }) => {
  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeStatus === 'paid' && styles.activeTabButton]}
        onPress={() => setActiveStatus('paid')}
      >
        <Text style={[styles.tabButtonText, activeStatus === 'paid' && styles.activeTabButtonText]}>Paid</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeStatus === 'pending' && styles.activeTabButton]}
        onPress={() => setActiveStatus('pending')}
      >
        <Text style={[styles.tabButtonText, activeStatus === 'pending' && styles.activeTabButtonText]}>Pending</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeStatus === 'failed' && styles.activeTabButton]}
        onPress={() => setActiveStatus('failed')}
      >
        <Text style={[styles.tabButtonText, activeStatus === 'failed' && styles.activeTabButtonText]}>Failed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeStatus === 'canceled' && styles.activeTabButton]}
        onPress={() => setActiveStatus('canceled')}
      >
        <Text style={[styles.tabButtonText, activeStatus === 'canceled' && styles.activeTabButtonText]}>Canceled</Text>
      </TouchableOpacity>
    </View>
  );
};

const PayoutList = ({ activeStatus, stripeAccountId, secretKey }) => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  let me:any =useMe()

  useEffect(() => {
    const loadPayouts = async () => {
      setLoading(true);
      const history = await fetchPayoutsHistory(me?.sellerCustomer?.sellercustomerId);
      const filteredPayouts = history.filter(payout => payout.status === activeStatus);
      setPayouts(filteredPayouts);
      setLoading(false);
    };

    loadPayouts();
  }, [activeStatus]);

  const renderPayoutItem = ({ item }) => {
    return (
      
      <View style={styles.payoutItem}>
        <Text style={styles.payoutDate}>Date: {new Date(item.created * 1000).toLocaleDateString()}</Text>
        <Text style={styles.payoutAmount}>Amount: ${item.amount / 100}</Text>
        <Text style={styles.payoutMethod}>Payment Method: {item.source_type}</Text>
        <Text style={styles.payoutStatus}>Status: {item.status.toUpperCase()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text>Loading Payout History...</Text>
      </View>
    );
  }
  // Check if there are no payouts and display a message
  if (payouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No payouts available for {activeStatus} status.</Text>
      </View>
    );
  }


  return (
    <FlatList
      data={payouts}
      renderItem={renderPayoutItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
    />
  );
};

const PayoutHistory = ({ stripeAccountId, secretKey }) => {
  const [activeStatus, setActiveStatus] = useState('paid');

  return (

    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Payouts Dashboard</Text>
      <CustomTabBar activeStatus={activeStatus} setActiveStatus={setActiveStatus} />
      <PayoutList activeStatus={activeStatus} stripeAccountId={stripeAccountId} secretKey={secretKey} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:"white"
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  payoutItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  payoutDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  payoutMethod: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  payoutStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default PayoutHistory;
