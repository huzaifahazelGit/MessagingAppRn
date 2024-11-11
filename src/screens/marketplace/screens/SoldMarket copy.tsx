import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useMe } from '../../../hooks/useMe';
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../../store/firebase-configNew';

const SoldMarket = () => {
  const [orders, setOrders] = useState([]);
  const [orders_pending, setOrders_pending] = useState([]);

  const [loading, setLoading] = useState(true);
  const user = useMe();

  useEffect(() => {
    const loadSellerOrders = async () => {
      if (!user?.uid) {
        console.error('User ID is not available.');
        setLoading(false);
        return;
      }

      const fetchedOrders = await fetchSellerOrders(user.uid);

      const fetchedOrders_pending = await fetchSellerOrders1(user.uid);


      setOrders_pending(fetchedOrders_pending)
      
      setOrders(fetchedOrders);
      setLoading(false);
    };

    loadSellerOrders();
  }, [user?.uid]);

  const handleDispatch = async (orderId) => {
    await dispatchOrder(orderId);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'Dispatched', dispatchedTimestamp: new Date() } : order
      )
    );
  };
  const dispatchOrder = async (orderId) => {
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Dispatched',
        dispatchedTimestamp: serverTimestamp(),
      });
      console.log('Order dispatched successfully.');
    } catch (error) {
      console.error('Error dispatching order:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Order ID: {item.id}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Currency: {item.currency}</Text>
      <Text>Product ID: {item.productId}</Text>
      <Text>Buyer ID: {item.buyerId}</Text>
      <Text>Status: {item.status}</Text>
      {item.status === 'Pending' && (
        <Button title="Dispatch Order" onPress={() => handleDispatch(item.id)} />
      )}
      {item.status === 'Dispatched' && (
        <Text>Dispatched At: {item.dispatchedTimestamp.toString()}</Text>
      )}
      {item.status === 'Approved' && (
        <Text>Approved At: {item.approvedTimestamp?.toString()}</Text>
      )}
    </View>
  );

  const fetchSellerOrders = async (userId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }
  
    try {
      const ordersRef = collection(firestore, 'orders');
      const q = query(
        ordersRef,
        where('sellerId', '==', userId),
        where('status', 'in', ['Approved',])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting seller orders:', error);
      return [];
    }
  };
  const fetchSellerOrders1 = async (userId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }
  
    try {
      const ordersRef = collection(firestore, 'orders');
      const q = query(
        ordersRef,
        where('sellerId', '==', userId),
        where('status', 'in', ['Pending','Dispatched'])
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting seller orders:', error);
      return [];
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Seller Sales History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
        <Text style={styles.sectionTitle}>Seller Pending History</Text>
      <FlatList
        data={orders_pending}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
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
  list: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    color:"white"
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SoldMarket;
