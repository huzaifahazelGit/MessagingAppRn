import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, Alert, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MarketHeader from '../components/MarketHeader'
import AppText from '../../../components/AppText'
import LinearButton from '../components/linearButton'
import { FlatList } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useMe } from '../../../hooks/useMe'
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { firestore } from '../../../store/firebase-configNew'
import AppProgressDialogLoader from '../../../components/AppProgressDialogLoader'
import { ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import BuyScreen from './BuyScreen';
import Toast from 'react-native-toast-message'
import RNFS from 'react-native-fs';
import { ORDER_STATUS } from '../utils/orders.enum'
import { useStripe } from '@stripe/stripe-react-native'


const PurchaseDelivery = () => {
  const navigation: any = useNavigation()
  const [pendingOrders, setPendingOrders] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [completeOrders, setCompletedOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const user: any = useMe();
  const [imageLoading, setImageLoading] = useState(true);
  const stripe = useStripe();

  useFocusEffect(
    useCallback(() => {
      loadBuyerOrders();
    }, [user?.uid])
  );

  const loadBuyerOrders = async () => {
    const fetchedPendingOrders = await fetchBuyerPendingOrders(user?.uid);
    setPendingOrders(fetchedPendingOrders);

    const fetchedCompleteddOrders = await fetchBuyerCompletedOrders(user.uid);
    setCompletedOrders(fetchedCompleteddOrders)
    // setLoading(false);

  };

  const handlePayNow = async (orderId: any, productId: string, amount: number) => {

    const amountInCents = parseInt(String(amount * 100));
    Alert.alert(
      "Confirm",
      "Are you sure! want to pay for this order?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "PAY",
          onPress: async () => {

            const response = await fetch('https://api.stripe.com/v1/payment_intents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Secret key
              },
              body: `amount=${amountInCents}&currency=usd`, // Adjust the amount and currency as needed
            });
            const data = await response.json();

            const initSheet = await stripe.initPaymentSheet({
              paymentIntentClientSecret: data.client_secret,
              merchantDisplayName: 'Realm',
            });

            if (initSheet.error) {
              Alert.alert('Error', initSheet.error.message);
              setLoading(false);
              return;
            }

            const presentSheet = await stripe.presentPaymentSheet({ clientSecret: data.client_secret });
            if (presentSheet.error) {
              if (presentSheet.error.code === 'Canceled') {
                Alert.alert('Info', presentSheet.error.message);
              }
              setLoading(false);
              return;
            }

            if (!presentSheet.error) {
              const paymentIntent = await stripe.retrievePaymentIntent(data.client_secret);
              const paymentId = paymentIntent.paymentIntent.id;
              console.log("Payment ID:", paymentId);

              await handleUpdateApproveOrder(orderId, paymentId, productId, amount);
              // setPendingOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
              // const approvedOrder = pendingOrders.find(order => order.id === orderId);
              // setApprovedOrders((prevOrders) => [...prevOrders, { ...approvedOrder, status: 'Approved', approvedTimestamp: serverTimestamp() }]);


            }

          }
        }
      ]
    );
  };

  const handleUpdateApproveOrder = async (orderId: any, paymentId: string, productId: String, amount: any) => {
    try {
      const itemData = await checkItemAvailability(productId);
      console.log(":: itemData ::", itemData);
  
      const newQuantity = itemData.quantity - 1;
      console.log("==newQuantity==", newQuantity);
  
      // Reduce the product quantity
      await updateItemQuantity(productId, newQuantity);
  
      // Update order status
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: ORDER_STATUS.COMPLETED,
        paymentId: paymentId,
        payTimestamp: serverTimestamp(),
        quantity: newQuantity
      });
  
      // Add amount to seller earnings
      const sellerEarningsRef = doc(firestore, 'seller_earnings', itemData?.userId);
  
      // Fetch current earnings
      const sellerDoc = await getDoc(sellerEarningsRef);
      if (sellerDoc.exists()) {
        const currentEarnings = sellerDoc.data()?.totalEarnings || 0;
        const earningsOverTime = sellerDoc.data()?.earningsOverTime || [];
  
        // Add new amount to the existing earnings and update earningsOverTime
        await updateDoc(sellerEarningsRef, {
          totalEarnings: currentEarnings + amount,
          lastUpdated: serverTimestamp(),
          earningsOverTime: [
            ...earningsOverTime,
            { amount, date: new Date().toISOString() }, // Add new earnings entry
          ]
        });
      } else {
        // Create a new record if it doesn't exist
        await setDoc(sellerEarningsRef, {
          totalEarnings: amount,
          lastUpdated: serverTimestamp(),
          earningsOverTime: [{ amount, date: new Date().toISOString() }]
        });
      }
  
      loadBuyerOrders();
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };
  

  const updateItemQuantity = async (productId: any, newQuantity: any) => {
    try {
      setLoading(true);
      const itemRef = doc(firestore, "marketBuyingSelling", productId);
      await updateDoc(itemRef, {
        quantity: newQuantity,
      });
      console.log("Item quantity updated successfully");
      // Alert.alert('', 'Your order is being processed.', [
      //   {text: 'OK', onPress: () => navigation?.navigate("PurchaseDelivery")},
      // ]);

    } catch (error) {
      console.error("Error updating item quantity: ", error);
    }
    finally {
      setLoading(false);
    }
  };

  const checkItemAvailability = async (itemId: any) => {
    try {
      const itemRef = doc(firestore, "marketBuyingSelling", itemId);
      const itemSnap = await getDoc(itemRef);

      if (itemSnap.exists()) {
        const itemData = itemSnap.data();
        if (itemData.quantity > 0) {
          return itemData;
        } else {
          Alert.alert('This Product is out of stock');
          return null;
        }
      } else {
        Alert.alert('Item not found');
        return null;
      }
    } catch (error) {
      console.error("Error checking item availability: ", error);
      Alert.alert("Error checking item availability");
      return null;
    }
  };

  const fetchBuyerPendingOrders = async (userId: any) => {
    if (!userId) {
      console.error('User ID is not available.');
      // return [];
    }

    try {
      setImageLoading(true)
      setLoading(true)
      const ordersRef = collection(firestore, 'orders');
      const q = query(ordersRef, where('buyerId', '==', userId), where('status', '==', ORDER_STATUS.PENDING));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    catch (error) {
      console.error('Error getting buyer orders:', error);
      return [];
    }
    finally {
      setLoading(false)
      setTimeout(() => {
        setImageLoading(false)
      }, 1500);
    }
  };

  const fetchBuyerCompletedOrders = async (userId: any) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }

    try {
      setImageLoading(true)
      setLoading(true)
      const ordersRef = collection(firestore, 'orders');
      const q = query(ordersRef, where('buyerId', '==', userId), where('status', 'in', [ORDER_STATUS.COMPLETED, ORDER_STATUS.APPROVED_BY_SELLER]),
      // orderBy('createdAt', 'desc'),
      // limit(10) 
    )

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    catch (error) {
      console.error('Error getting buyer orders:', error);
      return [];
    }
    finally {
      setLoading(false)
      setTimeout(() => {
        setImageLoading(false)
      }, 1500);
    }
  };

  const convertTimestampToDateTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  //  if (loading) {
  //   return <Text>Loading...</Text>;
  // }
  // if (purchaseHistory.length === 0) {
  //   return <Text>No seller history available.</Text>;
  // }

  const renderBuyerPendingOrderItem = ({ item }) => (
    <View style={styles.listPurchaseView}>
      {imageLoading &&
        <ActivityIndicator size="large" color="white" style={styles.indicatorView} />}
      <Image source={{ uri: item?.product_details?.image }} style={styles.img} />
      <View style={styles.mainView}>
        <View style={styles.upperView}>
          <View style={styles.upperFirstView}>
            <AppText size={24} style={{ height: 30 }}
              ellipsizeMode="tail"
              color={"white"}>
              {item.product_details?.title.length > 10 ? `${item.product_details.title.substring(0, 10)}...` : item?.product_details?.title}
            </AppText>
            {/* <AppText   size={24} color={"#d886ff"} style={{paddingLeft:3,height:30,}} >{item.product_details?.nft ? "NFT":""}</AppText> */}
          </View>
          <View style={styles.upperSecondView}>
            <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>SOLD ON {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</AppText>
            <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>FUNDS AVAILABLE {item.fundsAvailable}</AppText>
            <AppText size={12} style={{ paddingTop: 3 }} color={"red"}>{item?.status == ORDER_STATUS.PENDING ? "Pending Approval" : ""}</AppText>
            <Pressable onPress={() => navigation.navigate('OrderDetails', { item: item })}  >
              <AppText size={13} belowLine style={{ paddingTop: 4 }} color={"gray"}>More Deatils</AppText>
            </Pressable>
            <AppText size={12} belowLine style={{ paddingTop: 4 }} color={"white"}
              onPress={() => {
                (navigation as any).navigate("ProfileStack", {
                  screen: "ProfileScreen",
                  params: { userId: item?.sellerId },
                });
              }}
            >
              MESSAGE SELLER
            </AppText>


          </View>
        </View>
        <View style={styles.belowView}>
          <AppText size={24} style={{ height: 60, textAlign: 'right' }} color={"white"}>{"$" + item?.amount}</AppText>
          {/* {item.status === 'Approved' && (
              <AppText style={{bottom:12,textAlign:"right"}} color={'#d886ff'} >{convertTimestampToDateTime(item?.approvedTimestamp)}</AppText>
            )} */}

          {/* {item.status === 'Approved' && (  
          <TouchableOpacity
              disabled
              style={{}}>
          <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.button}>
              <Text style={styles.text}>Received</Text>
          </LinearGradient>
            </TouchableOpacity>
            
            ) } */}
        </View>
      </View>
    </View>
  );

  const renderBuyerPurchasedOrderItem = ({ item }) => (
    <View style={styles.listPurchaseView}>
      {imageLoading && <ActivityIndicator size="large" color="white" style={styles.indicatorView} />}
      <Image source={{ uri: item?.product_details?.image }} style={styles.img} />
      <View style={styles.mainView}>
        <View style={styles.upperView}>
          <View style={styles.upperFirstView}>
            <AppText size={24} style={{ height: 30 }}
              ellipsizeMode="tail"
              color={"white"}>
              {item.product_details?.title.length > 10 ? `${item.product_details.title.substring(0, 10)}...` : item?.product_details?.title}
            </AppText>
            {/* <AppText   size={24} color={"#d886ff"} style={{paddingLeft:3,height:30,}} >{item.product_details?.nft ? "NFT":""}</AppText> */}
          </View>
          <View style={styles.upperSecondView}>
            <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>BUY ON {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</AppText>
            {item.status === 'pending' && <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>FUNDS AVAILABLE {item.fundsAvailable}</AppText>}
            <AppText size={12} style={{ paddingTop: 3 }} color={"orange"}>{item?.status}</AppText>

            <Pressable onPress={() => navigation.navigate('OrderDetails', { item: item })}  >
              <AppText size={13} belowLine style={{ paddingTop: 4 }} color={"gray"}>More Deatils</AppText>
            </Pressable>


            <AppText size={12} belowLine style={{ paddingTop: 4 }} color={"white"}
              onPress={() => {
                (navigation as any).navigate("ProfileStack", {
                  screen: "ProfileScreen",
                  params: { userId: item?.sellerId },
                });
              }}
            >
              MESSAGE SELLER
            </AppText>

            <Pressable onPress={() => showAlert(item)}>
              {item.status === ORDER_STATUS.COMPLETED && <Image source={require("../assets/download.png")} style={{ width: 16, height: 16, resizeMode: "contain", marginTop: 8 }} />}
            </Pressable>

          </View>
        </View>

        <View style={styles.belowView}>
          <AppText size={24} style={{ height: 60, textAlign: 'right' }} color={"white"}>{"$" + item?.amount}</AppText>

          {item.status === ORDER_STATUS.APPROVED_BY_SELLER && (<LinearButton
            title='Pay Now'
            // onPress={() => handlePayNow(item?.id,item?.productId,Number(item?.amount))}
            onPress={() => handlePayData(item)}

            colors={["#669AFF", "#D886FF"]}
            buttonStyle={{ borderRadius: 5, height: 40, width: 125, top: 11, right: 15 }}
            textStyle={{ color: "#221F29", fontSize: 11 }}
          />)}

          {item.status === ORDER_STATUS.COMPLETED && (
            <AppText style={{ bottom: 12, textAlign: "right" }} color={'#d886ff'} >{convertTimestampToDateTime(item?.payTimestamp)}</AppText>
          )}

          {/* {item.status === 'Approved' && (  
          <TouchableOpacity
              disabled
              style={{}}>
          <LinearGradient
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={styles.button}>
              <Text style={styles.text}>Received</Text>
          </LinearGradient>
            </TouchableOpacity>
            
            ) } */}
        </View>
      </View>
      <>
      {console.log("==Purchase===",item) }
      </>
      
    </View>
  );

  const downloadFile = async (image) => {
    console.log("===image==", image);

    setLoading(true)
    const imageUrl = image
    const fileName = 'downloaded-image.jpg';
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    console.log("Downloading from", imageUrl);

    try {
      const response = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      }).promise;

      if (response?.statusCode === 200) {
        Alert.alert('Download complete', 'Your image has been downloaded.');
        // setTimeout(() => {
        //   navigation?.navigate("MarketScreen")
        // }, 1000);
      } else {
        throw new Error('Failed to download image');
      }
    } catch (error) {
      Alert.alert('Download failed', error.message);
    } finally {
      setLoading(false);
    }

  };

  const showAlert = (item: any) => {

    Alert.alert(
      "Confirmation",
      "Do you want to download?",
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => downloadFile(item?.product_details?.image) }
      ],
      { cancelable: false }
    );
  };

  const handlePayData = (item: any) => {
    handlePayNow(item?.id, item?.productId, Number(item?.amount))

  }

  const getSellerIdByOrders = async (orderId: any) => {
    const itemRef = doc(firestore, "orders", orderId);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      if (itemData.quantity > 0) {
        return itemData;
      } else {
        Alert.alert('This Product is out of stock');
        return null;
      }
    } else {
      Alert.alert('Item not found');
      return null;
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#231F29", }}>
      <View style={{ paddingHorizontal: 18, flexDirection: "row", justifyContent: "space-between" }}>
        <AppText size={20} color={"white"}>PURCHASES</AppText>
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={require("../assets/close.png")} style={{ width: 20, height: 20, resizeMode: "contain", tintColor: "white" }} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={{ borderBottomWidth: 1, borderColor: "white", marginTop: 10 }} />
        <AppText size={21} style={{ paddingVertical: 15 }} color={"white"}>BUYER PENDING APPROVAL</AppText>
        <FlatList
          data={pendingOrders}
          style={{ flex: 1, }}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
          renderItem={renderBuyerPendingOrderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 20 }}>
              <AppText color={"gray"} size={20}>No Pending History Found</AppText>
            </View>
          )}
        />
        <AppText size={21} style={{ paddingVertical: 15 }} color={"white"}>BUYER PURCHASE HISTORY</AppText>
        <FlatList
          style={{ flex: 1 }}
          data={completeOrders}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
          renderItem={renderBuyerPurchasedOrderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            approvedOrders.length == 0 &&
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <AppText color={"gray"} size={20}>No Purchase History Found</AppText>
            </View>
          )}
          
        />
      </View>
      <AppProgressDialogLoader visible={loading} />
    </SafeAreaView>
  )
}

export default PurchaseDelivery


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#231F29",
    paddingHorizontal: 18,
  },
  button: {
    padding: 5,
    alignItems: 'center',
    borderRadius: 5,
    top: 5
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 13,
    color: '#fff',
  },
  upperView: {
    flex: 0.6, bottom: 11, paddingLeft: 10,
  },
  belowView: {
    flex: 0.4, bottom: 11,
  },
  mainView: {
    flex: 1, flexDirection: "row"
  },
  img: {
    width: 110, height: 120, resizeMode: 'cover', borderColor: "white", borderWidth: 1, borderRadius: 7
  },
  indicatorView: {
    position: "absolute", alignSelf: "center", top: 37, left: 40
  },
  listPurchaseView: {
    flexDirection: "row", width: "100%", height: 115, marginBottom: 25
  },
  upperFirstView: {
    flexDirection: "row"
  },
  upperSecondView: {

  }
})

