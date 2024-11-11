import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useMe } from '../../../hooks/useMe';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../../store/firebase-configNew';
import AppText from '../../../components/AppText';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import AppProgressDialogLoader from '../../../components/AppProgressDialogLoader';
import { LinearGradient } from 'expo-linear-gradient';
import  RNFS from 'react-native-fs';
import { ORDER_STATUS } from '../utils/orders.enum';
import Toast from 'react-native-toast-message';

const SoldMarket = () => {
  const [orders, setOrders] = useState([]);
  const [orders_pending, setOrders_pending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const user:any = useMe();
  const navigation:any = useNavigation()

  useEffect(() => {
    loadSellerOrders();
  }, [user?.uid]);

  const loadSellerOrders = async () => {
    const fetchedOrders = await fetchSellerOrders(user.uid);
    const fetchedOrders_pending = await fetchSellerOrders1(user.uid);
    setOrders_pending(fetchedOrders_pending)
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const handleApproveBySeller = async (orderId) => {
    Alert.alert(
      "Confirm",
      "Are you sure! want to approve this order?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Approve",
          onPress: async () => {
            await approveOrder(orderId);
            // setOrders((prevOrders) =>
            //   prevOrders.map((order) =>
            //     order.id === orderId ? { ...order, status: ORDER_STATUS.APPROVED_BY_SELLER, approvalTimestamp: serverTimestamp() } : order
            //   )
            // );
          }
        }
      ]
    );

  };

  const approveOrder = async (orderId:any) => {
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: ORDER_STATUS.APPROVED_BY_SELLER,
        approvalTimestamp: serverTimestamp(),
      });
      // Toast.show({
      //   type: "success",
      //   text1: `This order has been approved successfully`,
      // });
      Alert.alert("Approve","This order has been approved successfully")
      await loadSellerOrders()
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
        <Button title="Dispatch" onPress={() => handleApproveBySeller(item?.id)} />
      )}
      {item.status === 'Dispatched' && (
        <Text>Dispatched At: {item.dispatchedTimestamp.toString()}</Text>
      )}
      {item.status === 'Approved' && (
        <Text>Approved At: {item.approvedTimestamp?.toString()}</Text>
      )}
    </View>
  );

  const fetchSellerOrders = async (userId:any) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }
  
    try {
      setImageLoading(true)
      setLoading(true)
      const ordersRef = collection(firestore, 'orders');
      const q = query(
        ordersRef,
        where('sellerId', '==', userId),
        where('status', 'in', [ORDER_STATUS.COMPLETED,ORDER_STATUS.APPROVED_BY_SELLER]),
        orderBy('createdAt', 'desc'),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting seller orders:', error);
      return [];
    }finally{
      setLoading(false)
      setTimeout(() => {
        setImageLoading(false)
      }, 1500);
    }
  };

  const fetchSellerOrders1 = async (userId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return [];
    }
  
    try {
      setImageLoading(true)
      setLoading(true)
      const ordersRef = collection(firestore, 'orders');
      const q = query(
        ordersRef,
        where('sellerId', '==', userId),
        where('status', '==', ORDER_STATUS.PENDING),
        orderBy('createdAt', 'desc'),
        limit(10) 
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting seller orders:', error);
      return [];
    }
    finally{
      setLoading(false)
      setTimeout(() => {
        setImageLoading(false)
      }, 1500);
      // setImageLoading(false)
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="white" style={styles.loader} />;
  }
  const downloadFile = async (image) => {
    console.log("===image==",image);
    
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


  const renderSellerSalesItem = ({ item }) => (
    <View style={styles.listPurchaseView}>
    {loading && <ActivityIndicator size="large" color="white" style={styles.indicatorView}  />}        
    <Image source={{uri:item?.product_details?.image}} style={styles.img} />
    <View style={styles.mainView}> 
      <View style={styles.upperView}>
        <View style={styles.upperFirstView}>
        <AppText size={24} style={{height:30}}  
        ellipsizeMode="tail"  
        color={"white"}> 
        {item.product_details?.title.length > 7 ? `${item.product_details.title.substring(0, 7)}...` : item?.product_details?.title}
        </AppText>
        {/* <AppText   size={24} color={"#d886ff"} style={{paddingLeft:3,height:30,}} >{item.product_details?.nft ? "NFT":""}</AppText> */}
        </View>
        <View style={styles.upperSecondView}>
          <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>SOLD ON {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</AppText> 
          <AppText size={12} style={{ paddingTop: 3 }} color={"orange"}>{"APPROVED ON"}</AppText>
          <AppText size={12} belowLine  style={{ paddingTop: 4 }} color={"white"}
          onPress={() => {
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: item?.buyerId },
            });
          }}
          >
         MESSAGE BUYER
           </AppText>
        
        <Pressable
          onPress={() => navigation.navigate('OrderDetails', { item:item })}
        >
        <AppText size={13} belowLine style={{ paddingTop: 4 }} color={"gray"}>More Deatils</AppText>
        </Pressable>
        
        <Pressable onPress={()=>showAlert(item)}>
        {item.status === 'Approved' &&   <Image source={require("../assets/download.png")} style={{ width: 16, height: 16, resizeMode: "contain", marginTop: 8 }} />}
        </Pressable>
      
        </View>
      </View>
      <View style={styles.belowView}>
      <AppText size={24}  style={{height:60,textAlign:'right'}} color={"white"}>{"$"+item?.amount}</AppText>  
          <AppText style={{bottom:12,textAlign:"right"}} color={'orange'} >{convertTimestampToDateTime(item?.approvalTimestamp)}</AppText>
        {item.status == ORDER_STATUS.COMPLETED &&   <Text style={{color:"#d886ff",textAlign:"right"}}>{"Completed"}</Text>}    
        {item.status == ORDER_STATUS.APPROVED_BY_SELLER &&   <Text style={{color:"#d886ff",textAlign:"right"}}>{"Payment Pending "}</Text>}    
     
      </View>  
      </View> 
      <>
      {console.log("==renderSellerSalesItem==",item)
      }
      </>
    </View> 
  );

  const renderSellerPendingItem = ({ item }) => (
    <View style={[styles.listPurchaseView,{marginBottom:50}]}>
    {imageLoading && <ActivityIndicator size="large" color="white" style={styles.indicatorView}  />}        
    <Image source={{uri:item?.product_details?.image}} style={styles.img} />
    <View style={styles.mainView}> 
    <View style={styles.upperView}>
      <View style={styles.upperFirstView}>
      <AppText size={24} style={{height:30}}  
      ellipsizeMode="tail"  
      color={"white"}> 
      {item.product_details?.title.length > 7 ? `${item.product_details.title.substring(0, 7)}...` : item?.product_details?.title}
      </AppText>
      {/* <AppText   size={24} color={"#d886ff"} style={{paddingLeft:3,height:30,}} >{item.product_details?.nft ? "NFT":""}</AppText> */}
      </View>
      <View style={styles.upperSecondView}>    
        <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>SOLD ON {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</AppText>
      { item.status === 'pending' &&  <AppText size={12} style={{ paddingTop: 2 }} color={"gray"}>FUNDS AVAILABLE {item.fundsAvailable}</AppText>}
      <AppText size={12} style={{ paddingTop: 3 }} color={"red"}>{item?.status == ORDER_STATUS.PENDING ? "Pending" :""}</AppText>

        <AppText size={12}belowLine  style={{ paddingTop: 4 }} color={"white"}
        onPress={() => {
          (navigation as any).navigate("ProfileStack", {
            screen: "ProfileScreen",
            params: { userId: item?.sellerId },
          });
        }}
        >
          MESSAGE SELLER
        </AppText>
 
      <Pressable
        onPress={() => navigation.navigate('OrderDetails', { item:item })}
      >
    <AppText size={13} belowLine style={{ paddingTop: 4 }} color={"gray"}>More Deatils</AppText>
      </Pressable>
      {item.status === 'Approved' &&   <Image source={require("../assets/download.png")} style={{ width: 16, height: 16, resizeMode: "contain", marginTop: 8 }} />}
    
      </View>
    </View>
    <View style={styles.belowView}>
    <AppText size={24}  style={{height:60,textAlign:'right'}} color={"white"}>{"$"+item?.amount}</AppText>       
      {item.status === ORDER_STATUS.PENDING && ( 
        <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.button}>
         <Pressable onPress={() => handleApproveBySeller(item.id)}>
         <Text style={styles.text}>Approve</Text>
        </Pressable>
      </LinearGradient>
      )}

      {/* {item.status === 'Dispatched' && (
        <AppText style={{bottom:12,textAlign:"right",color:"orange"}}>{convertTimestampToDateTime(item?.dispatchedTimestamp)}</AppText>
      )} */}
    </View>  
    </View> 
    </View> 
  );

  const convertTimestampToDateTime = (timestamp:any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const showAlert = (item:any) => {
    
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


  return (
   
    <SafeAreaView style={{flex:1,backgroundColor:"#231F29",}}>
    <View style={{paddingHorizontal:18,flexDirection:"row",justifyContent:"space-between"}}>
     <AppText size={20} color={"white"}>Sold</AppText>
     <Pressable onPress={()=>navigation.goBack()}>
     <Image source={require("../assets/close.png")} style={{width:20,height:20,resizeMode:"contain",tintColor:"white"}}  />
     </Pressable>
    </View>
    <View style={styles.container}>
      <View  style={{borderBottomWidth:1,borderColor:"white",marginTop:10}}/>
      <AppText size={21} style={{paddingVertical:15}} color={"white"}>Seller Sales  HISTORY</AppText>
         <FlatList
          data={orders}
          style={{flex:1}}
          contentContainerStyle={{flexGrow:1,paddingTop:20}}
          renderItem={renderSellerSalesItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{  justifyContent: 'center', alignItems: 'center',flex:1}}>
              <AppText color={"gray"} size={20}>No Purchase History Found</AppText>
            </View>
          )} 
        />
        <AppText size={21} style={{paddingVertical:15}} color={"white"}> Seller Pending History</AppText> 
        <FlatList
          data={orders_pending}
          style={{flex:1,}}
          contentContainerStyle={{flexGrow:1,paddingTop:15}}
          renderItem={renderSellerPendingItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{  justifyContent: 'center', alignItems: 'center',flex:1,paddingBottom:20}}>
              <AppText color={"gray"} size={20}>No Pending History Found</AppText>
            </View>
          )} 
        />
    </View>
    <AppProgressDialogLoader visible={loading} />
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
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 3,
    top:30
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 12,
    color: '#fff',
  },


  upperView:{
    flex: 0.6, bottom: 11, paddingLeft: 10,
  },
  belowView:{
    flex: 0.4, bottom: 11, 
  },
  mainView:{
    flex: 1, flexDirection: "row"
  },
  img:{
    width: 110, height: 118, resizeMode: 'cover',borderColor:"white",borderWidth:1,borderRadius:7
  },
  indicatorView:{
    position: "absolute", alignSelf: "center", top: 37, left: 40
  },
  listPurchaseView:{
    flexDirection: "row", width: "100%", height: 115, marginBottom: 25
  },
  upperFirstView:{
  flexDirection: "row"
  },
  upperSecondView:{
    
  }


});

export default SoldMarket;
