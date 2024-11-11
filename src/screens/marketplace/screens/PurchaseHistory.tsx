import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useMe } from '../../../hooks/useMe';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../../store/firebase-configNew';

const PurchaseHistory = () => {
  const user:any = useMe();  // means 
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user?.uid) {
        const history = await fetchPurchaseHistory(user.uid);
        console.log("==history==",history);
        setPurchaseHistory(history);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const fetchPurchaseHistory = async (userId) => {
    try {
      const ordersRef = collection(firestore, "orders");
      const userOrdersQuery = query(ordersRef, where("buyerId", "==", userId) && where("status", "==", "completed") );
      const querySnapshot = await getDocs(userOrdersQuery);
  
      if (!querySnapshot.empty) {
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        return orders;
      } else {
        console.log('No purchase history found for this user',);
        return [];
      }
    } catch (error) {
      console.error("Error fetching purchase history: ", error);
      return [];
    }
  };

  const fetchPurchaseHistoryDetails = async (productId) => {
    try {
      const marketRef = collection(firestore, 'marketBuyingSelling');
      const querySnapshot = await getDocs(query(marketRef, where('productId', '==', productId)));
  
      if (!querySnapshot.empty) {
        // Assuming productId is unique and there's only one matching document
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      } else {
        console.log('No matching product found in marketBuyingSelling collection');
        return null;
      }
    } catch (error) {
      console.error('Error fetching purchase history details:', error);
      return null;
    }
  };

  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (purchaseHistory.length === 0) {
  //   return <Text>No purchase history available.</Text>;
  // }

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      <Text style={styles.header}>Purchase History</Text>
      <FlatList
        data={purchaseHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>Item: {item.name}</Text>
            <Text style={styles.itemText}>Amount: USD {item.amount / 100}</Text>
            <Text style={styles.itemText}>Status: {item.status}</Text>
            <Text style={styles.itemText}>Date: {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
      color:"white"
  },
});

export default PurchaseHistory;
