import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Linking,
  } from "react-native";
  import { v4 as uuidv4 } from 'uuid';
  import React, { useCallback, useEffect, useState } from "react";
  import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
  import { SimpleMonoText } from "../../../components/text";
  import { SCREEN_HEIGHT,  } from "../../../constants/utils";
  import LinearButton from "../components/linearButton";
  import MarketHeader from "../components/MarketHeader";
  import AppText from "../../../components/AppText";
  import { useMe } from "../../../hooks/useMe";
  import { addDoc, collection, doc, setDoc,serverTimestamp, getDocs, getDoc } from "firebase/firestore";
  import { firestore, storage } from '../../../store/firebase-configNew';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import Loader from "../../../components/Loader";
import { createAccountLink, createConnectedAccount } from "../utils/StripeUtils";
import Toast from "react-native-toast-message";

  const PostPublish = () => {
    const route = useRoute();
    const me:any = useMe();
    const navigation:any = useNavigation()
    const [uploading,setUploading] = useState(false)
    const [accountSetupComplete, setAccountSetupComplete] = useState(false); 

    const { image,title, price,selectedCategory,description,selectedLocation,isEnabledNFT,isEnabledConditionTag,selectedListStatus,selectedButton_condition,selectedButton_payment,market_type,
      imageData,quantity,isEnabledFeature
    } = (route?.params as any).item;
 
    const handleUploadData = async () => {
      try {
        
        setAccountSetupComplete(true)
        const { downloadURL, fileName }:any = await uploadImage();
        await saveToFirestore(fileName,downloadURL);
      } catch (error) {
        console.error('Error: ', error);
        Alert.alert('Error', error.message);
      }
    };
    const uploadImage = async () => {
      // if (!image) return;
      setUploading(true);
      try {
        const { path } = imageData;
         /*    */
        const response = await fetch(path);
        const blob = await response.blob();
        const fileName = uuidv4();
        const storageRef = ref(storage, `marketBuyingSelling/${fileName}`);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot?.ref);
        // console.log('Uploaded a blob or file!', downloadURL);
        return {fileName,downloadURL}
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
      finally{
        setUploading(false);
      }
    };
    const saveToFirestore = async (fileName,downloadURL) => {  
      setUploading(true);
      // Copy the 'me' object and remove the 'proactiveRefresh' field
      // const { proactiveRefresh, ...cleanedMe } = me;
      const seller_data =  {
        "title" : title,
        "amount" : price,
        "category":selectedCategory, 
        "description" : description,
        "image":downloadURL,
        "location":selectedLocation,
        "market_type":market_type,
        "listing_status":selectedListStatus,  
        "nft":isEnabledNFT,
        "payouts_method":selectedButton_payment,
        "conditionTag":isEnabledConditionTag,
        "list_condition_tag":selectedButton_condition,
        "userId":me?.uid,
        "createdAt": serverTimestamp(),
        "fileName":fileName,
        "quantity":quantity,
        "isMarkSold":false,
        "isEnabledFeature":isEnabledFeature,
        "isBookMark":false,
        "sellerInfo": me?.providerData,
        "seller_username":me?.username,
        "sellerWalletInfo":me?.walletInfo
        
      }      
        try {
          if (me?.uid) {
            // await setDoc(doc(firestore, "market_selling", me?.uid),selling_data);
            if(market_type === "Buying/Selling"){
              await addDoc(collection(firestore, "marketBuyingSelling"), seller_data,
                // userId: me?.uid, // Optionally, include the user ID in the document data
              );
              Alert.alert(
                "Success",
                "Your Selling Data added successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate('MarketScreen'), 
                  },
                ],
                { cancelable: false }
              );
            }
            else if (market_type ==="Gig") {
              // const data = {...seller_data }
              await addDoc(collection(firestore, "marketBuyingSelling"), seller_data,
                // userId: me?.uid, // Optionally, include the user ID in the document data
              );
              Alert.alert(
                "Success",
                "Your Gig Data added  successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate('MarketScreen'), 
                  },
                ],
                { cancelable: false }
              );
            }
            else if (market_type === "Service"){
              await addDoc(collection(firestore, "marketBuyingSelling"), 
                seller_data,
                // userId: me?.uid, // Optionally, include the user ID in the document data
              );
              Alert.alert(
                "Success",
                "Your Service Data added to Firestore successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate('MarketScreen'), 
                  },
                ],
                { cancelable: false }
              );
            }
            else if (market_type ==="Digital Assets"){
              await addDoc(collection(firestore, "marketBuyingSelling"), 
                seller_data,
                // userId: me?.uid, // Optionally, include the user ID in the document data
              );
              Alert.alert(
                "Success",
                "Your Digital Assets Data added to successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate('MarketScreen'), 
                  },
                ],
                { cancelable: false }
              );
            }
            else{
              Alert.alert(
                "Error",
                "No Found against listing",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate('MarketScreen'), 
                  },
                ],
                { cancelable: false }
              );
            }
          } else {
            console.error('User ID is undefined');
            Alert.alert("No Found User Id")
          }
        } 
        catch (error) {
          console.error('Error adding document to Firestore:', error);
          Alert.alert("Error adding document to Firestore!")
        }
        finally{
          setUploading(false);
        }
    }
    const getCurrentDateTimeFormatted = () => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0 to 11
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0'); 
      return `${month}.${day}.${year} ${hours}:${minutes}:${seconds}`;
      
    };
    const renderSign =()=>{
     if(selectedButton_payment == 'ETH'){
      return "ETH"
     }
     if(selectedButton_payment == 'CRYPTO'){
      return "Crypto"
     }
     if(selectedButton_payment == 'USD'){
      return "$"
     }
     if(selectedButton_payment == 'REALM COIN'){
      return "realm"
     }
    
    }
    // Handle Publish Action
    const checkAccountSellerSetup = async () => {
      try {
        if (!me?.sellerCustomer?.sellercustomerId) {
          Alert.alert("Seller Account Missing", "Please set up a seller account before publishing.");
          return;
        }
    
        let accountStatus = await checkAccountStatus(me?.sellerCustomer?.sellercustomerId);
    
        if (accountStatus?.charges_enabled && accountStatus?.payouts_enabled) {
          handleUploadData();
        } else {
          Alert.alert(
            "Incomplete Setup",
            "Please complete the seller account setup before publishing."
          );
        }
      } catch (error) {
        console.error("Error checking seller account setup:", error);
        Alert.alert("Error", "An error occurred while checking account setup.");
      }
    };
    const accountSetup = async () => { 
      try {
          const userDocRef = doc(firestore, "users", me?.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          if (userData.sellerCustomer?.sellercustomerId) {
          const accountLink = await createAccountLink(userData.sellerCustomer?.sellercustomerId);
          if (accountLink) {
            console.log("Opening account link:", accountLink);
            Linking.openURL(accountLink);
          }
          }
          else{
            const accountId = await createConnectedAccount(me?.email); 
            await saveSellerCustomerId(me?.uid, accountId);
          }

      } catch (error) {
          console.error("Error during account setup:", error);
      }
    };
    async function saveSellerCustomerId(userUid, sellercustomerId) {
      try {
        const userDocRef = doc(firestore, "users", userUid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data(); 
          await setDoc(userDocRef, {
            ...userData,
            sellerCustomer: {
            sellercustomerId,  
            updatedAt: serverTimestamp()
            }        
          }, { merge: true });

          const accountLink = await createAccountLink(sellercustomerId );
          if (accountLink) {
            console.log("Opening account link:", accountLink);
            Linking.openURL(accountLink);
          }
      

          
    

      
        
      } catch (error) {
        console.error("Error saving sellercustomerId:", error);
        return false;  
      }
    }
  // Function to check account status
    const checkAccountStatus = async (accountId) => {
      try {
        const response = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const account = await response.json();

        if (response.ok) {
          if (account.requirements?.disabled_reason) {
            // Alert.alert("Account Restricted", account.requirements.disabled_reason);
            Toast.show({
              type: 'error',
              text1: `Account Restricted ${account.requirements.disabled_reason}`,
            });
            setAccountSetupComplete(false);
            return null;
          }

          if (account.charges_enabled && account.payouts_enabled) {

            setAccountSetupComplete(true);

            return account;
          } else {
            Alert.alert("Incomplete Setup", "Account setup is not yet complete. Please finish setup.");
            setAccountSetupComplete(false);
            console.log("Account setup is not yet complete. Still in progress...");
          }
        } else {
          console.error("Error fetching account status:", account);
          Alert.alert("Error", "Failed to fetch account status.");
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "An error occurred while checking account status.");
      } finally {
      }
    };

// Example usage: call this after redirecting the user back from onboarding
    useEffect(() => {
      if (me?.sellerCustomer?.sellercustomerId) {
        checkAccountStatus(me.sellerCustomer.sellercustomerId);
      }
    }, [me]);

    useFocusEffect(
      useCallback(() => {
        if (me?.sellerCustomer?.sellercustomerId) {
          checkAccountStatus(me.sellerCustomer.sellercustomerId);
        }
      }, [me,navigation])
    );  





    return (
      <SafeAreaView style={{flex: 1}}>
        <MarketHeader ispaddingHorizontal={15} />
        <View style={styles.conatiner}>
          <SimpleMonoText style={styles.textItem}>
              {"All" + "   >   "+ selectedCategory + "   >   " + title}
          </SimpleMonoText>
          <ScrollView
            style={{flex: 1}}
             showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContiner}>
              
            <Image source={image} style={styles.image} />
             {/* Item Tilte + Item Content */}
            <View style={{flexDirection: "row",paddingTop:5}}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}>
                <View style={{}}>
                  <SimpleMonoText style={{ fontSize: 30 }}>
                    {title}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 30 }}>
                    {selectedCategory}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 15, paddingTop:5 }}>
                    {/* {"PERSON USERNAME"} */}
                    {me?.username}
                  </SimpleMonoText>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <SimpleMonoText style={{ fontSize: 25, paddingRight: 20 }}>
                    {price}
                  </SimpleMonoText>
                  <SimpleMonoText style={{ fontSize: 25 }}>
                    {/* {"ETH"} */}
                    {/* {"$"} */}
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
                paddingBottom:10
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
                  {/* {"(+100 ETH)"} */}
                  {"(+100 "+renderSign()+ ')'}

                  

                </SimpleMonoText>
              </View>
            </View>
             {/* PRODUCT DESCRIPTION */}
            <View style={{paddingHorizontal:0}}>
              <SimpleMonoText style={{ fontSize: 16 }}>
                {"PRODUCT DESCRIPTION"}
              </SimpleMonoText>
              <SimpleMonoText
                style={{ fontSize: 14, textAlign: "justify", paddingTop: 10 }}>
                {
                  description
                }
              </SimpleMonoText>
            </View>
            {/* CREATED FILE SIZE */}
            <View style={{paddingTop: 10 }}>
              <AppText size={14} color={"white"}>
                {/* {"CREATED 01.23.2024"} */}
                {"CREATED   " + getCurrentDateTimeFormatted()}
              </AppText>
              <AppText size={14} color={"white"}>
                {"Image SIZE    2.3Kb"}
                {/* {imageSize.width} x {imageSize.height} */}
              </AppText>
            </View>
            
            {
              !accountSetupComplete &&  <LinearButton 
              buttonStyle={{  marginTop:10 }}
            //  colors={["#669AFF", "#D886FF"]}
              title={"Seller Account Setup"}
             onPress={accountSetup} 
             >
             
          </LinearButton>
            }
          {/* PUBLISH  */}
          <LinearButton
              title='PUBLISH'
              onPress={checkAccountSellerSetup}
              colors={["#669AFF", "#D886FF"]}
              buttonStyle={{ borderRadius: 80, marginBottom: 5,marginTop:10 }}
            />
            <Loader isLoading={uploading} />
          </ScrollView>
        </View>
        
      </SafeAreaView>
    );
  };
  
  export default PostPublish;
  
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
      borderRadius: 20,
      borderColor: "white",
      borderWidth: 1,
      resizeMode: "cover",
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
      top: 20,
      resizeMode: "contain",
      alignSelf: "flex-end",
      right: 15,
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
    loader: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white', // Optional: semi-transparent background
    
    },
    accountLinkContainer: {
      padding: 20,
      backgroundColor: '#f0f0f0',
      alignItems: 'center'
    },
    accountLinkText: {
      color: '#007BFF',
      textDecorationLine: 'underline'
    }
  });
  