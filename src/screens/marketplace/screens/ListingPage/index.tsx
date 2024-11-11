import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Alert,
  Linking
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AppText from "../../../../components/AppText";
import LinearButton from "../../components/linearButton";
import MarketHeader from "../../components/MarketHeader";
import { DEFAULT_ID, SCREEN_HEIGHT,  } from "../../../../constants/utils";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { BoldMonoText, SimpleMonoText } from "../../../../components/text";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, getFirestore, arrayUnion, setDoc, } from "firebase/firestore";
import {  firestore } from "../../../../store/firebase-configNew";
import Loader from "../../../../components/Loader";
import { useMe } from "../../../../hooks/useMe";
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { isTestMode, pubKey } from "../../utils/paymentConfig";
import Toast from "react-native-toast-message";
import AppProgressDialogLoader from "../../../../components/AppProgressDialogLoader";
import WalletButton from "../../../wallet/src/components/WalletButton";
import { Collaboration } from "../../../../models/collaboration";
import { addCollabToStore, addNotConnectedToStore, SocialStore } from "../../../../store/follows-collabs-store";
import 'react-native-get-random-values'; 
import '@ethersproject/shims';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { decryptRealmPrivateKey, getRealmWalletBalance, transferTokens } from '../../../wallet/src/utils/realm-tokenService';
import { ORDER_STATUS } from "../../utils/orders.enum";
import getStyles from "./styles";
const encryptionKey = 'your-strong-encryption-key'; 

const ListingPage = () => {
  const route:any = useRoute();
  const stripe = useStripe();
  const styles = getStyles();
  const {image,id,title,description,createdAt,seller_username,category,amount,sellerInfo,userId,isBookMark,market_type,payouts_method,sellerWalletInfo,} = (route.params as any).item;
  const navigation:any = useNavigation() 
  const [loading, setLoading] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [imageLoading,setImageLoading]= useState(true)
  const [sellerFeatureData,setSellerFeatureData] = useState([])  
  let seller_userId = userId
  const me:any = useMe()
  let currentUserId =me?.uid
  const [collab, setCollab] = useState<Collaboration>(null);
  const collabs = SocialStore.useState((s) => s.collabs);
  const notConnected = SocialStore.useState((s) => s.notConnected);
  const defaultUserImage = require('../../../marketplace/assets/image8.png');
  const [loaded, setLoaded] = useState(true);

 useEffect(() => {
    loadCollaborations();
  }, [userId]);
  
 useFocusEffect(
  useCallback(() => {
    fetchSellerUserSimilarData();
  }, [isBookMark])
);  
 
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
    if(market_type == 'Digital Assets'){
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

const handleOrderCreation = async () =>{
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
      {text: 'OK', onPress: () => navigation?.replace("PurchaseDelivery")},
    ]);
  } catch (error) {
    console.error('Error adding order: ', error);
  }
};

const  handle_Like = (item:any) => {
  Alert.alert(
    "Confirm",
    "Are you sure you want to like this item as buying?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const itemRef = doc(firestore, "marketBuyingSelling", item.id);
            await updateDoc(itemRef, { isBookMark: true });
            Alert.alert("Success", "Item liked!");
            fetchSellerUserSimilarData(); // Refresh the data to reflect the changes
          } catch (error) {
            Alert.alert("Error Liking item as: ", error);
          }
        }
      }
    ]
  );
 }

const  handle_DisLike = (item:any) => {
  Alert.alert(
    "Confirm",
    "Are you sure you want to dislike this item as buy?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const itemRef = doc(firestore, "marketBuyingSelling", item.id);
            await updateDoc(itemRef, { isBookMark: false });
            Alert.alert("Success", "Item Disliked!");
            fetchSellerUserSimilarData(); // Refresh the data to reflect the changes
          } catch (error) {
            Alert.alert("Error Liking item as: ", error);
          }
        }
      }
    ]
  );
}

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

const createChatMarket = async () => {
  let marketplaceItem = (route.params as any).item
  if (me && me.id) {
    if (collab) { 
      console.log("--run1ListingPage---",collab);
      if (!marketplaceItem && collab.marketplace) {
        const ref = doc(getFirestore(), "collaborations", collab.id);
        await updateDoc(ref, {
          marketplace: true,
          marketplaceId: null,
        });
      }
      console.log("===marketplaceItem===",marketplaceItem);
      
      (navigation as any).navigate("Inbox", {
        screen: "ChatDetailScreen",
        params: {
          collaborationId: collab.id,
          collaboration: JSON.stringify(collab),
          marketplaceItem: JSON.stringify(marketplaceItem),
        },
      });
    } else {
      console.log("--run2---");
      
      let collab: Collaboration = {
        userIds: [me.id, userId],
        initiatorId: me.id,
        initiatorName: me.username,
        accepted: false,
        completed: false,
        createdate: new Date(),
        lastupdate: new Date(),
        archived: false,
        subheading: "",
        onProfileIds: [],
        marketplace: marketplaceItem != null,
        marketplaceId: marketplaceItem ? marketplaceItem.id : null,
        lastRecipientId: userId,
        unreadCount: 1,
      };
      (navigation as any).navigate("Inbox", {
        screen: "ChatDetailScreen",
        params: {
          collaborationId: "new",
          collaboration: JSON.stringify(collab),
          marketplaceItem: marketplaceItem
            ? JSON.stringify(marketplaceItem)
            : null,
        },
      });
    }
  } else {
    Alert.alert("Please sign in to collaborate.", "", [
      {
        text: "OK",
        onPress: () => (navigation as any).navigate("Login"),
      },
    ]);
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
          {loading && <AppText style={styles.loaderView} size={30} color={"white"}>Processing...</AppText>}    
           {/* Product Overview */}
          <View style={styles.productTitleView}>
              <View  style={styles.productTitleInnerView}>
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
                  {renderSign()}
                </SimpleMonoText>
              </View>
            </View>
          </View>
           {/* Personal + Commercial */}
          <View
            style={styles.commerciallView}>
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
                {"(+100 "+ renderSign() + ")"} 
              </SimpleMonoText>
            </View>
          </View>
          <LinearButton
            title='BUY NOW'
            onPress={handlePayment}
            colors={["#669AFF", "#D886FF"]}
            buttonStyle={{ borderRadius: 80, marginBottom: 5, }}
          /> 
           {loading && ( <AppProgressDialogLoader visible={loading} /> )}
           { market_type == 'Digital Assets' &&  
           <AppText style={styles.textItemInstant}  onPress={()=> handlePayment()} >
              {"INSTANT DOWNLOAD"}
            </AppText>
           }      
          <WalletButton
            title='MESSAGE SELLER'
            btnViewStyle={{
              marginTop: 20,
              borderColor: "white",
              borderWidth: 1,
            }}
            btnFillUp={true}
            onPress={()=>createChatMarket()}
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
            {/* CREATED FILE SIZE */}
          <View style={{paddingTop: 10 }}>
            <AppText size={14} color={"white"}>
             {"CREATED  "} {createdAt ? new Date(createdAt.seconds * 1000).toLocaleString() : 'Unknown'}
            </AppText>
            <AppText size={14} color={"white"}>
              {"FILE SIZE 4.5 MB"}
            </AppText>
            <View style={styles.lineView} />
          </View>
            {/* MEET  CREATOR */}
          <View style={{paddingTop: 20 }}>
            <AppText
              size={16}
              style={{ paddingBottom: 20 }}
              color={"white"}
              center>
              {"MEET THE CREATOR"}
            </AppText>
            <ImageBackground 
            source={sellerInfo?.photoURL ? { uri: sellerInfo?.photoURL } : defaultUserImage}
            style={styles.imageCreator}
            imageStyle={{ 
              borderRadius: 20,
              borderColor: "white",
              borderWidth: 1,
              resizeMode: "cover",}}
            >
             <View style={{ flex: 1, justifyContent: 'flex-end',paddingHorizontal:20 }}>
                <View style={{ flexDirection: "column", width: "60%" }}>
                    <BoldMonoText style={{ fontSize: 32,fontWeight:'bold' }}>
                    {seller_username?seller_username:"Seller UserName" }
                    </BoldMonoText>
                    <BoldMonoText style={{ fontSize: 20 ,fontWeight:'bold'}}>
                    {category}
                    </BoldMonoText>
                </View>
              <View style={{ alignSelf: "flex-end",bottom:30  }}>
                  <TouchableOpacity style={styles.btnView}
                  onPress={()=>navigation?.navigate("SellerProfile",route.params)}
                  >
                      <AppText size={14} color={"white"}>
                          {"View Shop"}
                      </AppText>
                  </TouchableOpacity>
              </View>
              </View>
            </ImageBackground>
           
          </View>
          {/* SIMILAR ITEMS */}
          <View style={styles.similarView}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <SimpleMonoText style={styles.popularText}>
            {'SIMILAR ITEMS'}
        </SimpleMonoText> 
          <Image source={require("../../assets/next.png")} style={styles.imageArrow} />       
          </View> 
          {loading ? (
            <View style={{ height:170, }}>
            <Loader loaderView={{}}  isLoading={loading} />
              </View>
          ) : sellerData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center" }}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{ flex: 1 }}
          >
              {sellerData.map((item, index) => (
                <Pressable 
                onPress={() => navigation.navigate("BuyNow", { item })}
                key={index}
                >
                <ImageBackground 
                  key={index}
                  source={{uri:item?.image}}
                  style={styles.small_image}
                  imageStyle={styles.small_imageView}
                >
                  <Loader isLoading={imageLoading} />
                  <Pressable
                  onPress={() => item?.isBookMark ?  handle_DisLike(item) : handle_Like(item)  }
                  style={styles.imageLikeView} 
                  >
                  <Image source={item?.isBookMark ?  require("../../assets/onlike.png"): require("../../assets/like.png")}  style={styles.imageLike} />
                  </Pressable>
                  <View style={styles.small_contentView}>
                    <View style={styles.small_leftAddedTitleView}>
                      <AppText color={"white"} size={14} >
                        {item?.title}
                      </AppText>
                      <AppText  color={"white"} size={14} >
                        {item?.category}
                      </AppText>
                    </View>
                    <AppText color={"white"} style={styles.small_rigthTitleView} >
                       {item?.amount + ' ETH'}
                    </AppText> 
                  </View>
                </ImageBackground>
                </Pressable>       
              ))}
        
          </ScrollView>
      )}
         </View>
          {/* Feature SIMILAR ITEMS */}
         <View style={styles.sameFeatureView}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <SimpleMonoText style={styles.popularText}>
            {'FROM THE SAME CREATOR'}
        </SimpleMonoText> 
          <Image source={require("../../assets/next.png")} style={styles.imageArrow} />       
          </View> 
          {loading ? (
            <View style={{ height:170, }}>
            <Loader loaderView={{}}  isLoading={loading} />
              </View>
          ) : sellerFeatureData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center" }}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{ flex: 1 }}
          >
              {sellerFeatureData.map((item, index) => (
                <Pressable 
                onPress={() => navigation.navigate("BuyNow", { item })}
                key={index}
                >
                <ImageBackground 
                  key={index}
                  source={{uri:item?.image}}
                  style={styles.small_image}
                  imageStyle={styles.small_imageView}
                >
                  <Loader isLoading={imageLoading} />
                  <Pressable
                   onPress={() => item?.isBookMark ?  handle_DisLike(item) : handle_Like(item)  }
                  style={styles.imageLikeView} 
                  >
                  <Image source={item?.isBookMark ?  require("../../assets/onlike.png"): require("../../assets/like.png")}  style={styles.imageLike} />
                  </Pressable>
                  <View style={styles.small_contentView}>
                    <View style={styles.small_leftAddedTitleView}>
                      <AppText color={"white"} size={14} >
                        {item?.title}
                      </AppText>
                      <AppText  color={"white"} size={14} >
                        {item?.category}
                      </AppText>
                    </View>
                    <AppText color={"white"} style={styles.small_rigthTitleView} >
                       {item?.amount + ' ETH'}
                    </AppText> 
                  </View>
                </ImageBackground>
                </Pressable>       
              ))}
        
          </ScrollView>
      )}
         </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ListingPage;


