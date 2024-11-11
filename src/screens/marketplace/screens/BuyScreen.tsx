import {
    StyleSheet,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
    Linking,
  } from "react-native";
  import React, { useCallback, useState,useEffect } from "react";
  import AppText from "../../../components/AppText";
  import LinearButton from "../components/linearButton";
  import MarketHeader from "../components/MarketHeader";
  import { DEFAULT_ID, SCREEN_HEIGHT,  } from "../../../constants/utils";
  import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
  import WalletButton from "../../wallet/src/components/WalletButton";
  import { BoldMonoText, SimpleMonoText } from "../../../components/text";
  import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where,getFirestore } from "firebase/firestore";
  import { firestore } from "../../../store/firebase-configNew";
  import { useMe } from "../../../hooks/useMe";
  import Toast from "react-native-toast-message";
  import { Collaboration } from '../../../models/collaboration';
  import { addCollabToStore, addNotConnectedToStore, SocialStore } from "../../../store/follows-collabs-store";
  import { decryptRealmPrivateKey, getRealmWalletBalance } from "../../wallet/src/utils/realm-tokenService";
  import CryptoJS from 'crypto-js';
  import 'react-native-get-random-values'; 
  import '@ethersproject/shims';
  import { ethers } from 'ethers';
  import { ORDER_STATUS } from "../utils/orders.enum";

  const BuyScreen = () => {
    const route:any = useRoute();
    const {image,id,title,description,createdAt,seller_username,category,amount,sellerWalletInfo,userId,market_type,payouts_method} = (route.params as any).item;
    const navigation:any = useNavigation() 
    const [sellerData, setSellerData] = useState([]);
    const [imageLoading,setImageLoading]= useState(true)
    const [sellerFeatureData,setSellerFeatureData] = useState([])  
    const [paymentIntentData, setPaymentIntentData] = useState<any>(null);
    let seller_userId = userId    
    const me:any = useMe()
    const [loading, setLoading] = useState(false);
    let currentUserId =me?.uid
    const [collab, setCollab] = useState<Collaboration>(null);
    const collabs = SocialStore.useState((s) => s.collabs);
    const notConnected = SocialStore.useState((s) => s.notConnected);
    const [loaded, setLoaded] = useState(true);

    useEffect(() => {
        loadCollaborations();
      }, [userId]);      

    const fetchSellerUserSimilarData = async () => {
      setLoading(true);
      try {
        const dataRef = collection(firestore, "marketBuyingSelling");
        const stateQuery = query(dataRef, where("userId", "==", seller_userId), where("isMarkSold", "==", false));
        const querySnapshot = await getDocs(stateQuery);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const seller = data.filter((item:any) => item?.category === category && item?.isMarkSold === false);
          const seller_data = seller.filter((item:any) => item?.category === category &&(item?.isEnabledFeature === false || item?.isEnabledFeature === true)  );
          const seller_feature = seller.filter((item:any) => item?.category === category && item?.isEnabledFeature === true);
          setSellerData(seller_data)
          setSellerFeatureData(seller_feature)
        }
        else {
          console.log('No Data found against this Sellar');
        }    
      } catch (error) {
        Alert.alert("Error Sellar fetching documents: ");
      } finally {
        setLoading(false);
        setTimeout(() => {
          setImageLoading(false);
        }, 1000);
      }
    };

    const handlePayment = async () => {
        if(payouts_method == 'Digital Assets'){
          handleOrderCreation()
        }
      else{
          if (payouts_method === 'ETH') {
          payEth()
        }
        if (payouts_method === 'USD'){
          handleOrderCreation()
        }
        if (payouts_method === 'REALM COIN'){
          payRealmToken(sellerWalletInfo?.walletAddress,0.00001)
        }
      }
    }

    const payEth = async () => {
      const balance = await getBalance();
      if (parseFloat(balance) === 0.0) {
        Alert.alert(
          "No available balance",
          "Your wallet has no available balance. Please recharge your account.",
          [
            { text: 'Cancel' },
            { 
              text: 'Get Test BNB', 
              onPress: () => {
                Alert.alert(
                  'Navigate to Faucet',
                  'You are about to be redirected to the Binance Smart Chain Testnet Faucet to obtain test BNB.',
                  [
                    { text: 'Cancel' },
                    { 
                      text: 'Proceed', 
                      onPress: () => Linking.openURL('https://testnet.binance.org/faucet-smart') 
                    }
                  ]
                );
              }
            }
          ]
        );
      } 
      else {
        // Confirm the transaction before proceeding
        Alert.alert(
          "Confirm Transaction",
          "Do you want to proceed with the transaction?",
          [
            { text: 'Cancel' },
            { 
              text: 'Proceed', 
              onPress: async () => {
                await sendTransaction();
              }
            }
          ]
        );
      }
    };

    const payRealmToken = async (recipient:any, amount:any) => {
      try {
        const encryptionKey = 'your-strong-encryption-key'; 
        const decryptedPrivateKey = decryptRealmPrivateKey(me?.walletInfo?.encryptedPrivateKey, encryptionKey);
        // Optionally check balance before transferring
        const balance = await getRealmWalletBalance(decryptedPrivateKey,me?.walletInfo?.walletAddress);
      // Show alert if balance is zero
      // if (parseFloat(balance) === 0) {
      //   Alert.alert(
      //     "Insufficient Balance",
      //     "Your balance is zero. Please add funds before attempting a transfer.",
      //     [{ text: "OK" }]
      //   );
      //   return; // Exit the function early if balance is zero
      // }

      // utils.parseUnits(amount, decimals);
      if (balance < amount) {
        Alert.alert(`Insufficient balance. Your balance is ${balance} tokens.`);
        return;
      }

        // Confirm the transfer
        Alert.alert(
          "Confirm Transfer",
          `Are you sure you want to transfer ${amount} tokens to ${recipient}?`,
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "OK",
              onPress: async () => {
                try {
                  // Transfer tokens
                  const result = await transferTokens(decryptedPrivateKey, recipient, amount.toString());
                  Alert.alert("Success", result); // Display success message
                } catch (error) {
                  Alert.alert("Error", `Failed to complete the token transfer: ${error.message}`);
                }
              }
            }
          ]
        );

      } catch (error) {
        console.error('Failed to complete the token transfer:', error);
      }
    };

    const decryptPrivateKey = (encryptedPrivateKey:any) => {
      const encryptionKey = 'your-strong-encryption-key'; // Use the same key as during encryption
      const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, encryptionKey);
      const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedPrivateKey;
    };

    const sendTransaction = async () => {
      const privateKey = decryptPrivateKey(me?.walletInfo?.encryptedPrivateKey);

      try {
        const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
        const wallet = new ethers.Wallet(privateKey, provider);
        
        const tx = {
          to: sellerWalletInfo?.walletAddress,
          value: ethers.parseEther('0.00001'),
          gasLimit: 30000,
        };

        const transaction = await wallet.sendTransaction(tx);
        console.log('Transaction:', transaction);
        saveTx(transaction?.hash)

        Toast.show({
          type: "success",
          text1: "Transaction Sent",
          text2: `Transaction Hash: ${transaction?.hash}`,
        });
      } catch (error) {
        console.error('Error sending transaction:', error);
        Alert.alert(
          'Transaction Error',
          `An error occurred: ${error.message}`,
          [{ text: 'OK' }]
        );
      }
    };

    const saveTx = async(hash:any)=>{
      try {
        const userRef = doc(firestore, "users", me?.uid);
        await updateDoc(userRef, {
          "walletInfo.transactionHashes": arrayUnion(hash), // Adds new hash to the array
          "walletInfo.lastTransactionTimestamp": serverTimestamp(),
        });


      } catch (error) {
        console.error('Error saving transaction hash:', error);
      }

    }

    const getBalance = async () => {  
      try {
        const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
        const balance = await provider.getBalance(me?.walletInfo?.walletAddress);
        return ethers.formatEther(balance);
      } catch (error) {
        console.error('Error getting balance:', error);
        return '0.0'; // Default value if there's an error
      }
    };

    const handleOrderCreation = async () => {
      
      setLoading(false);
      const finalAmount = amount;
      if (finalAmount < 1) return Alert.alert('You cannot order below usd 1.0');

      const itemData = await checkItemAvailability(route?.params?.item?.id);
      console.log("==itemData==",itemData);
      
      if (!itemData) {
        setLoading(false);
        return;
      }

      const orderDetail:any = {
        buyerId: currentUserId, 
        sellerId: seller_userId,
        productId: id,
        amount: finalAmount,
        createdAt: serverTimestamp(), 
        currency: 'usd',
        product_details:(route.params as any).item,
        paymentIntentId: null,
        status: ORDER_STATUS.PENDING,
        approvalTimestamp:"",
      }


      Alert.alert(
        "Confirm",
        "Are you sure want to create order",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Order",
            onPress: async () => {
            await  addOrder(orderDetail)
            // const newQuantity = itemData.quantity - 1;
            // await updateItemQuantity(route?.params?.item?.id, newQuantity);
            }
          }
        ]
      );
      
      
    }

    const addOrder = async (orderDetails:any) => {
      try {
        const orderRef = await addDoc(collection(firestore, 'orders'), orderDetails);
        console.log("==orderRef==",orderRef?.id);
        Alert.alert('', 'Your order is created succefully.', [
          {text: 'OK', onPress: () => navigation?.navigate("PurchaseDelivery")},
        ]);
      } catch (error) {
        console.error('Error adding order: ', error);
      }
    };

    const checkItemAvailability = async (itemId:any) => {
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

    const loadCollaborations = async () => {
      if (me && me.id && userId && userId != DEFAULT_ID && !collab) {
        let existingCollab = collabs.find((item) =>
          item.userIds.includes(userId)
        );
        let existingNotCollab = notConnected.find((item) => item == userId);
        if (existingCollab) {
          setCollab(existingCollab);
        } else if (!existingNotCollab) {
          setLoaded(false);
          let items = [];

          const q = query(
            collection(getFirestore(), "collaborations"),
            where("userIds", "==", [me.id, userId])
          );

          const snapshotOne = await getDocs(q);

          const qTwo = query(
            collection(getFirestore(), "collaborations"),
            where("userIds", "==", [userId, me.id])
          );

          let snapshotTwo = await getDocs(qTwo);
          snapshotOne.forEach((child) => {
            items.push({ ...child.data(), id: child.id });
          });
          snapshotTwo.forEach((child) => {
            items.push({ ...child.data(), id: child.id });
          });
          if (items.length > 0) {
            let collab = items[0];
            setCollab(collab);
            addCollabToStore(collab, me.id);
          } else {
            addNotConnectedToStore(userId);
          }
          setLoaded(true);
        }
      }
    };
   
    const renderSign =()=>{
      if(payouts_method == 'ETH'){
      return "ETH"
      }
      if(payouts_method == 'CRYPTO'){
      return "Crypto"
      }
      if(payouts_method == 'USD'){
      return "$"
      }
      if(payouts_method == 'REALM COIN'){
      return "realm"
      }
    
    }



  
  
  
    return (
      <SafeAreaView style={{flex: 1}}>
        <MarketHeader ispaddingHorizontal={20} />
        <View style={styles.conatiner}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.scrollContiner}>
            <SimpleMonoText style={styles.textItem}>
              {"All  > Art  >   " + title}
            </SimpleMonoText>
            <Image source={{uri:image}} style={styles.image} />       
            <View style={{flexDirection: "row",paddingTop:5}}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}>
                <View>
                  <SimpleMonoText style={{ fontSize: 30 }}>
                  {title}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 30 }}>
                    {category}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 15,paddingTop:3 }}>
                    {/* {"PERSON USERNAME"} */}
                    {seller_username ? seller_username : ""}
                  </SimpleMonoText>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <SimpleMonoText style={{ fontSize: 25, paddingRight: 20 }}>
                    {amount}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 25 }}>
                    {/* {"ETH"} */}
                    {renderSign()}

                  </SimpleMonoText>
                </View>
              </View>
            </View>
             {/* Personal + Commercial */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 15,
                // paddingLeft: 10,
                paddingBottom:20
              }}>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.dot, { top: 5 }]} />
                <SimpleMonoText style={styles.textItem}>
                  {"Personal"}
                </SimpleMonoText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.dot1, { top: 5 }]} />
                <SimpleMonoText style={styles.textItem}>
                  {"Commercial"}
                </SimpleMonoText>
                <SimpleMonoText style={styles.textItemEth}>
                  {"( +100" + renderSign() + " )"}
                </SimpleMonoText>
              </View>
            </View>
            {/* BUY NOW */}
            <LinearButton
              title='BUY NOW'
              onPress={()=>handlePayment()}
              colors={["#669AFF", "#D886FF"]}
              buttonStyle={{ borderRadius: 80,  }}
            />
            <AppText style={styles.textItemInstant}
              onPress={handlePayment}
            >
         {  market_type == 'Digital Assets' && "INSTANT DOWNLOAD"}
            </AppText>
            {/* <SimpleMonoText style={{ textAlign: "center" }}>
              {"Want to make an offer or a custom order?"}
            </SimpleMonoText> */}
            <WalletButton
              title='MESSAGE CREATOR'
              btnViewStyle={{
                marginTop: 0,
                borderColor: "white",
                borderWidth: 1,
              }}
              btnFillUp={true}
              onPress={() => {
                (navigation as any).navigate("ProfileStack", {
                  screen: "ProfileScreen",
                  params: { userId: userId },
                });
              }}
            />
              {/* PRODUCT DESCRIPTION */}
            <View style={{paddingTop: 30}}>
              <SimpleMonoText style={{ fontSize: 16 }}>
                {"PRODUCT DESCRIPTION"}
              </SimpleMonoText>
              <SimpleMonoText
                style={{ fontSize: 14, textAlign: "justify", paddingTop: 5 }}>  
                {description}
              </SimpleMonoText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  
  
  
  export default BuyScreen;
  
  const styles = StyleSheet.create({
    conatiner: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop:20,
      backgroundColor:"#231F29"
    },
    scrollContiner:{
      flexGrow:1,
      paddingBottom:20
    },
    image: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.5,
      borderRadius: 20,
      borderColor: "white",
      borderWidth: 1,
      resizeMode: "cover",
      marginBottom: 10,
    },
    imageCreator: {
      width: "100%",
      height: SCREEN_HEIGHT * 0.45,
     
      marginBottom: 10,
    },
    textItem: {
      fontSize: 16,
      paddingBottom: 15,
      paddingLeft: 10,
    },
    textItemInstant: {
      fontSize: 14,
      paddingBottom: 15,
      color: "#A4A3A7",
      textAlign: "center",
      paddingTop:10
    },
    textItemEth: {
      fontSize: 16,
      paddingBottom: 15,
      paddingLeft: 10,
      color: "#D886FF",
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 10,
      backgroundColor: "#D887FF",
      // marginLeft:10,
      borderWidth: 1,
      borderColor: "white",
    },
    dot1: {
      width: 12,
      height: 12,
      borderRadius: 10,
      backgroundColor: "balck",
      borderWidth: 1,
      borderColor: "white",
    },
    lineView: {
      borderBottomWidth: 2,
      borderColor: "white",
      paddingTop: 20,
    },
    btnView: {
      width: 125,
      height: 37,
      borderRadius: 50,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "white",
    },
    imageLike: {
      width: 22,
      height: 22,
      tintColor: "white",
      position: "absolute",
      top: 10,
      resizeMode: "contain",
      alignSelf: "flex-end",
      right: 10,
    },
    popularText: {
      fontSize: 20,
      paddingRight: 10,
    },
    container: {
      flex: 1,
      backgroundColor: "#231F29",
      paddingHorizontal: 15,
    },
    tabView: {
      paddingTop: 5,
    },
    topView: {
      paddingVertical: 40,
    },
    imageContainer: {
      marginRight: 10,
    },
    imageArrow: {
      width: 22,
      height: 22,
      tintColor:"white",
      position:'relative',
      top:2,
    },
    imageItem:{
        width: 242,
        height: 307,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white'
    },
    button: {
      borderRadius: 80,
      justifyContent:"center",
      height:50,
    },
    text: {
      color: '#221F29', // default text color
      fontSize: 20,
      fontWeight: 'bold',
    },
  small_contentView:{
    position: "absolute", 
    left: 10, 
    bottom: 20,
    flexDirection: 'row'
  },
  small_leftTitleView:{
    flexDirection: "column",
    width:"95%",
  },
  small_leftAddedTitleView:{
    flexDirection: "column",
    width:"65%",
  },
  small_rigthTitleView:{
    fontSize:11,
    position:"relative",
    top:20,
    left:3,
    width:"30%",
  },
  scrollViewAllContent: {
    paddingTop:20,
  },
  small_image: {
    width: 146,
    height: 184,
    marginRight:10,
    borderRadius: 10,
      },
  small_imageView: {
    borderRadius: 10,
    resizeMode:'cover',
    borderWidth: 2,
    borderColor: 'white',
  },
  imageLikeView:{
    position:"absolute",
    alignSelf:"flex-end",
  },
  similarView:{
    paddingTop:10
  },
  sameFeatureView:{
    paddingTop:30
  },
  });
  