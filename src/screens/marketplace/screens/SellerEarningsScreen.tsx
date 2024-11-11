import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../store/firebase-configNew';
import { useMe } from '../../../hooks/useMe';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

const SellerEarningsScreen = () => {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [earningsOverTime, setEarningsOverTime] = useState([]);
  const me:any = useMe();

  // Fetch earnings data from Firestore
  const fetchSellerEarnings = async () => {
    try {
      const sellerEarningsRef = doc(firestore, 'seller_earnings', me?.uid);
      const sellerDoc = await getDoc(sellerEarningsRef);
      if (sellerDoc.exists()) {
        setAvailableBalance(sellerDoc.data()?.totalEarnings || 0);
        setActivityLog(sellerDoc.data()?.activityLog || []);
        setEarningsOverTime(sellerDoc.data()?.earningsOverTime || []); // Actual earnings data
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      Alert.alert('Error fetching earnings', error.message);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchSellerEarnings(); 
    }, [activityLog])
  );

  // useEffect(()=>{
  //   fetchSellerEarnings(); 
  // },[activityLog])

  // Helper function to format the date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()]; // Returns month name, e.g., "Jul"
  };

  // Chart data for earnings over time
  const chartData = {
    labels: earningsOverTime.map((entry) => formatDate(entry.date)), // Using the formatDate helper function
    datasets: [
      {
        data: earningsOverTime.map((entry) => entry.amount),
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // const updateSellerEarnings = async (sellerId, amount) => {
  //   try {
  //     const sellerEarningsRef = doc(firestore, 'seller_earnings', sellerId);
  //     const sellerDoc = await getDoc(sellerEarningsRef);
  //     if (sellerDoc.exists()) {
  //       const currentEarnings = sellerDoc.data()?.totalEarnings || 0;
  //       await updateDoc(sellerEarningsRef, {
  //         totalEarnings: currentEarnings - amount,
  //         lastUpdated: new Date(),
  //         activityLog: [
  //           ...sellerDoc.data().activityLog,
  //           { type: 'withdrawal', amount, date: new Date().toISOString() },
  //         ],
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error updating earnings:', error);
  //   }
  // };

  // const handleWithdrawRequest = () => {
  //   if (availableBalance > 0 && !loading) {
  //     Alert.alert(
  //       'Confirm Withdrawal',
  //       `You have $${availableBalance} available. Do you want to withdraw this amount?`,
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         {
  //           text: 'Confirm',
  //           onPress: async () => {
  //             const connectedAccountId = me?.sellerCustomer?.sellercustomerId;
  //             await createPayout(connectedAccountId, availableBalance);
  //           },
  //         },
  //       ]
  //     );
  //   } else {
  //     Alert.alert('No funds available for withdrawal');
  //   }
  // };

  // const transferToConnectedAccount = async (amount, connectedAccountId) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('https://api.stripe.com/v1/transfers', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Use your secret key here
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: `amount=${amount * 100}&currency=usd&destination=${connectedAccountId}`,
  //     });

  //     const transfer = await response.json();
  //     if (response.ok) {
  //       Alert.alert('Transfer successful!', `You have transferred $${amount} to your connected account.`);
  //       // Update activity log for transfer
  //       const sellerEarningsRef = doc(firestore, 'seller_earnings', me?.uid);
  //       await updateDoc(sellerEarningsRef, {
  //         activityLog: [
  //           ...activityLog,
  //           { type: 'transfer', amount, date: new Date().toISOString() },
  //         ],
  //       });
  //     } else {
  //       Alert.alert('Error during transfer', transfer.error.message);
  //     }
  //   } catch (error) {
  //     Alert.alert('Transfer failed', error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleTransferRequest = () => {
  //   if (availableBalance > 0 && !loading) {
  //     Alert.alert(
  //       'Confirm Transfer',
  //       `You have $${availableBalance} available. Do you want to transfer this amount to your connected account?`,
  //       [
  //         { text: 'Cancel', style: 'cancel' },
  //         {
  //           text: 'Confirm',
  //           onPress: async () => {
  //             const connectedAccountId = me?.sellerCustomer?.sellercustomerId;
  //             await transferToConnectedAccount(availableBalance, connectedAccountId);
  //           },
  //         },
  //       ]
  //     );
  //   } else {
  //     Alert.alert('No funds available for transfer');
  //   }
  // };

  // const createPayout = async (connectedAccountId, amount) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://api.stripe.com/v1/payouts`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Use your secret key here
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         'Stripe-Account': connectedAccountId,
  //       },
  //       body: `amount=${amount * 100}&currency=usd`,
  //     });

  //     const payout = await response.json();
  //     if (response.ok) {
  //       setAvailableBalance(prevBalance => prevBalance - amount);
  //       await updateSellerEarnings(me?.uid, amount);
  //       Alert.alert("Payout successful!", `You have withdrawn $${amount}.`);
  //     } else {
  //       Alert.alert("Error creating payout", payout.error.message);
  //       Alert.alert("Info", "You have insufficient payouts in your account, You have to transfer the funds before to withdraw the amount",);
  //     }
  //   } catch (error) {
  //     Alert.alert("Payout failed", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleWithdrawRequest = () => {
    if (availableBalance > 0 && !loading) {
      Alert.alert(
        'Withdrawal Confirmation',
        `You have an available balance of $${availableBalance}. Would you like to proceed with the withdrawal?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              const connectedAccountId = me?.sellerCustomer?.sellercustomerId;
              await createPayout(connectedAccountId, availableBalance);
            },
          },
        ]
      );
    } else {
      Alert.alert('Insufficient Balance', 'No funds are currently available for withdrawal.');
    }
  };
  
  const handleTransferRequest = () => {
    if (availableBalance > 0 && !loading) {
      Alert.alert(
        'Transfer Confirmation',
        `You have an available balance of $${availableBalance}. Do you want to transfer this amount to your Stripe connected account?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              const connectedAccountId = me?.sellerCustomer?.sellercustomerId;
              await transferToConnectedAccount(availableBalance, connectedAccountId);
            },
          },
        ]
      );
    } else {
      Alert.alert('Insufficient Balance', 'No funds are currently available for transfer.');
    }
  };
  
  const createPayout = async (connectedAccountId, amount) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.stripe.com/v1/payouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Use your secret key here
          'Content-Type': 'application/x-www-form-urlencoded',
          'Stripe-Account': connectedAccountId,
        },
        body: `amount=${amount * 100}&currency=usd`,
      });
  
      const payout = await response.json();
      if (response.ok) {
        setAvailableBalance(prevBalance => prevBalance - amount);
        await updateSellerEarnings(me?.uid, amount);
        Alert.alert('Payout Successful', `You have successfully withdrawn $${amount}.`);
      } else {
        // Alert.alert('Payout Error', payout.error.message);
        Alert.alert(
          'Transfer Required',
          'Insufficient balance in your Stripe account for a payout. Please transfer funds to your connected account first.'
        );
      }
    } catch (error) {
      Alert.alert('Payout Failure', error.message);
    } finally {
      setLoading(false);
    }
  };

  const transferToConnectedAccount = async (amount, connectedAccountId) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.stripe.com/v1/transfers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Use your secret key here
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `amount=${amount * 100}&currency=usd&destination=${connectedAccountId}`,
      });

      const transfer = await response.json();
      if (response.ok) {
        Alert.alert('Transfer successful!', `You have transferred $${amount} to your connected account.`);
        // Update activity log for transfer
        const sellerEarningsRef = doc(firestore, 'seller_earnings', me?.uid);
        await updateDoc(sellerEarningsRef, {
          activityLog: [
            ...activityLog,
            { type: 'transfer', amount, date: new Date().toISOString() },
          ],
        });
        await fetchSellerEarnings()
      } else {
        Alert.alert('Error during transfer', transfer.error.message);
      }
    } catch (error) {
      Alert.alert('Transfer failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  const updateSellerEarnings = async (sellerId, amount) => {
    try {
      const sellerEarningsRef = doc(firestore, 'seller_earnings', sellerId);
      const sellerDoc = await getDoc(sellerEarningsRef);
      if (sellerDoc.exists()) {
        const currentEarnings = sellerDoc.data()?.totalEarnings || 0;
        await updateDoc(sellerEarningsRef, {
          totalEarnings: currentEarnings - amount,
          lastUpdated: new Date(),
          activityLog: [
            ...sellerDoc.data().activityLog,
            { type: 'withdrawal', amount, date: new Date().toISOString() },
          ],
        });
        await fetchSellerEarnings()
      }
    } catch (error) {
      console.error('Error updating earnings:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Manage Funds</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${availableBalance}</Text>
      </View>

      {/* Earnings Over Time Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Earnings Over Time</Text>
        {earningsOverTime.length > 0 ? (
          <LineChart
            data={chartData}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#1a1a1a',
              backgroundGradientFrom: '#1a1a1a',
              backgroundGradientTo: '#1a1a1a',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
          />
        ) : (
          <Text style={styles.noDataText}>No earnings data available</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          {/* Buttons for Withdraw and Transfer */}
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleWithdrawRequest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleTransferRequest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Transfer</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Recent Activity Log */}
      <View style={styles.activityLogContainer}>
        <Text style={styles.activityLogTitle}>Recent Activity</Text>
       {
       activityLog.length > 0 ? 
       <FlatList
       data={activityLog}
       contentContainerStyle={{flexGrow:1,}}
       keyExtractor={(item, index) => index.toString()}
       renderItem={({ item }) => (
         <View style={styles.activityItem}>
           <Text style={styles.activityText}>{`${item.type} of $${item.amount} on ${new Date(item.date).toLocaleDateString()}`}</Text>
         </View>
       )}
     />: (
      <Text style={styles.noDataText}>No recent activity available</Text>
    )
       }
        

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  headerText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 18,
    color: '#ffffff',
  },
  balanceAmount: {
    fontSize: 32,
    color: '#4caf50',
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  activityLogContainer: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    flex:1
  },
  activityLogTitle: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 8,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 8,
  },
  activityText: {
    color: '#ffffff',
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
  },
  
});

export default SellerEarningsScreen;
