// fetchSellerHistory.js
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { firestore } from '../../../store/firebase-configNew';
import { useMe } from '../../../hooks/useMe';

const SellerHistory = () => {
  const  user:any  = useMe(); // Get the current user from Auth context
  const [sellerHistory, setSellerHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user.uid) {
        const history = await fetchSellerHistory(user.uid);
        setSellerHistory(history);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (sellerHistory.length === 0) {
  //   return <Text>No seller history available.</Text>;
  // }

  const fetchSellerHistory = async (sellerId) => {
    try {
      const ordersRef = collection(firestore, "orders");
      const sellerOrdersQuery = query(ordersRef, where("sellerId", "==", sellerId));
      const querySnapshot = await getDocs(sellerOrdersQuery);

      console.log("--sellerOrdersQuery-",sellerOrdersQuery);
      
  
      if (!querySnapshot.empty) {
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return orders;
      } else {
        console.log('No seller history found for this seller');
        return [];
      }
    } catch (error) {
      console.error("Error fetching seller history: ", error);
      return [];
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      <Text style={styles.header}>Seller History</Text>
      <FlatList
        data={sellerHistory}
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

export default SellerHistory;
