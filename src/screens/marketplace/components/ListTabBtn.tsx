import { StyleSheet, Image, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import WalletButton from '../../wallet/src/components/WalletButton'
import AppText from '../../../components/AppText';
import { useFocusEffect, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import PayoutHistory from './PayoutHistory';
import { SCREEN_HEIGHT,  } from '../../../constants/utils';
import BottomSheet from './BottomSheet';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firestore } from "../../../store/firebase-configNew";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSeller } from '../../../hooks/useSelling';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMe } from '../../../hooks/useMe';
import SwitchTabSelector from './SwitchTabSelector';
import { defaultTheme } from '../theme';
  const market_list = [
    { id: 1, text: 'Gig', image: require("../assets/gig.png"),marketType:"Gig" },
    { id: 2, text: 'Service',image: require("../assets/person.png"),marketType:"Service" },
    { id: 3, text: 'Buying/Selling',image: require("../assets/cart.png"),marketType:"Buying/Selling" },
    { id: 4, text: 'Digital Assets',image: require("../assets/message.png"),marketType:"Digital Assets" },
  ];
 
const ListTabBtn = () => {
    const navigation:any = useNavigation()  
    const route  = useRoute()    
    const [paybtn,setPayBtn] = useState(false)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [activeListings, setActiveListings] = useState([]);
    const [renewListings, setRenewListings] = useState([]);
    const [InactiveListings, setInactiveListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingActive, setLoadingActive] = useState(true);
    const [loadingRenew, setLoadingRenew] = useState(true);
    const [loadingInactive, setLoadingInactive] = useState(true);
    const [noActiveItems, setNoActiveItems] = useState(false);
    const [noRenewItems, setNoRenewItems] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [downloadImageUrl, setDownloadImageUrl] = useState('');
    const me:any = useMe()
    const [selectedMarket, setSelectedMarket] = useState(market_list[0]); // Initialize with the first item
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0); // Initialize with the index of the first item
  

    useFocusEffect(
      useCallback(() => {
        if (selectedMarket && selectedMarket.marketType) {
          fetchData(selectedMarket.marketType);
          fetchDataInactive(selectedMarket.marketType);
        }
      }, [selectedMarket])
    );
    const handleOptionSelect = (index) => {
      setSelectedMarket(market_list[index]);
      setTabSelectedIndex(index);
    };    
    const fetchData = async (marketType: string) => {
      console.log("Fetching data for market type:", marketType); // Check if marketType is correct
      
      setLoading(true);
      try {
        const dataRef = collection(firestore, "marketBuyingSelling");
        
        const stateQuery = query(dataRef,
          where("userId", "==", me?.uid),
          where("isMarkSold", "==", false),
          where("market_type", "==", marketType)
        );
    
        console.log("Firestore query:", stateQuery); // Check the Firestore query being executed
        
        const querySnapshot = await getDocs(stateQuery);
        const activeList = [];
        const renewList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dataWithId: any = {
            id: doc.id,
            ...data
          };
          if (dataWithId.listing_status === "ACTIVE") {
            activeList.push(dataWithId);
          } else if (dataWithId.listing_status === "RENEW") {
            renewList.push(dataWithId);
          }
        });
        setActiveListings(activeList);
        setRenewListings(renewList);
    
      } catch (error) {
        Alert.alert("Error fetching documents: ");
        console.log("--error---", error);
    
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setLoadingActive(false);
        setLoadingRenew(false);
      }
    }; 
    const toggleBottomSheet = () => {
      setBottomSheetVisible(!bottomSheetVisible);
    };
    const hnadleBottomSheet =(item:any) =>{
      setBottomSheetVisible(!bottomSheetVisible);
      navigation.navigate("NewListing",{market_type:item?.text})
    }
    const renderItem = ({ item }) => (   
      <>
      <View style={{ flexDirection: "row", justifyContent: "space-between",marginVertical:15}}>
        <View style={{ flexDirection: "row",width:"100%",}}>
          <View style={{width:"30%",}}>       
          <Image source={{uri:item?.image}} style={{ width: "100%", height: 120, resizeMode: 'cover',borderWidth:1,borderColor:"white",borderRadius:10,}} />
         {loading && <ActivityIndicator size="large" color="white" style={{position:"absolute",alignSelf:"center",top:37}}  />}       
          </View>
          <View style={{flexDirection:"column"}}>
          <AppText size={25} style={{width:'100%',height:30,paddingLeft:10,bottom:15}}  color={"white"}>{item.title}</AppText>
           <View style={{flexDirection:"row",width:"100%"}}>
           <View style={{width:"45%",paddingLeft:10,bottom:20,}}>
            <View style={{flexDirection:"row",bottom:10,}}>
            <AppText  size={25} color={"#d886ff"} style={{paddingLeft:10}} >{item?.coin}</AppText>
            </View>
            <View>  
                <AppText size={12} style={{}} color={"gray"}>LISTED ON {item?.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}</AppText>
                <AppText size={12}  style={{color:"white" }} color={"gray"}>${item?.amount}</AppText>
                <AppText size={12} style={{ paddingTop: 10 ,height:30,width:"90%"}} color={"white"}>{item?.description}</AppText>
            </View>
           </View> 
           <View style={{width:"40%",justifyContent:"flex-end",paddingRight:10,bottom:10}}>
              <TouchableOpacity
              onPress={()=>navigation.navigate("EditListing",{item,republish:"true"})}
              style={{borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",borderRadius:20,height:30,alignItems:"center",justifyContent:"center",}}>
              <AppText size={11} color={"white"}>{item?.isMarkSold ? "REPUBLISH/EDIT" : 'EDIT LISTING'}</AppText>
              </TouchableOpacity> 
              <TouchableOpacity
              onPress={()=>item?.isMarkSold ? deleteListingItem(item) : mark_sold(item)}
              style={{backgroundColor:"white",borderRadius:20,marginTop:5,height:30,alignItems:"center",justifyContent:"center",}}>
              <AppText size={11} color={"#221F29"}>{item?.isMarkSold ? "REMOVE" : 'MARK SOLD'}</AppText>
              </TouchableOpacity>
          </View>    
           </View>
          </View>  
        </View>
      </View>
      </>
    ); 
    const renderListItem = ({ item }) => (  
        <View style={{  paddingTop: 10 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />
          <View style={{ flexDirection: "row", paddingTop: 15, alignItems: "center" }}>
            <Image style={{ width: 25, height: 25, tintColor: "#221F29",resizeMode:"contain" }} source={item?.image} />
            <AppText style={{ paddingLeft: 20, lineHeight: 20 }} size={21}
            onPress={()=>hnadleBottomSheet(item)}
            >
              {item.text}
            </AppText>
          </View>
        </View>
      );
    // const fetchData = async () => {
    //   setLoading(true);
    //   try {
    //     // const querySnapshot = await getDocs(collection(firestore, "market"));
    //     const dataRef = collection(firestore, "marketBuyingSelling");
    //     // const stateQuery = query(dataRef, where("userId", "==",me?.uid));
    //     const stateQuery = query(dataRef, where("userId", "==", me?.uid), where("isMarkSold", "==", false));
    //     const querySnapshot = await getDocs(stateQuery);
    //     const activeList = [];
    //     const renewList = [];
    //     querySnapshot.forEach((doc) => {
    //       const data = doc.data();
    //       const dataWithId:any = {
    //         id: doc.id,
    //         ...data
    //       }; 
    //       if (dataWithId.listing_status === "ACTIVE") {
    //         activeList.push(dataWithId);
    //       } else if (dataWithId.listing_status === "RENEW") {
    //         renewList.push(dataWithId);
    //       }
    //     });
    //     setActiveListings(activeList);
    //     setRenewListings(renewList);
       
    //   } catch (error) {
    //     Alert.alert("Error fetching documents: ");
    //   } finally {
    //     setTimeout(() => {
    //       setLoading(false);
    //     }, 1000);
    //     setLoadingActive(false);
    //     setLoadingRenew(false);
    //   }
    // };
    const fetchDataInactive = async (marketType: string) => {
      setLoading(true);
      try {
        const dataRef = collection(firestore, "marketBuyingSelling");
        const stateQuery = query(dataRef,
          where("userId", "==", me?.uid),
          where("isMarkSold", "==", true),
          where("market_type", "==", marketType)
        );
        const querySnapshot = await getDocs(stateQuery);
        const inactiveList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dataWithId: any = {
            id: doc.id,
            ...data
          };
          inactiveList.push(dataWithId);
        });
        setInactiveListings(inactiveList);
    
      } catch (error) {
        Alert.alert("Error fetching documents: ");
        console.log("--error---", error);
    
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setLoadingInactive(false);
      }
    };
    const mark_sold = (item:any) => {
      Alert.alert(
        "Confirm",
        "Are you sure you want to mark this item as sold?",
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
                await updateDoc(itemRef, { isMarkSold: true });
                Alert.alert("Success", "Item marked as sold!");
                fetchData(selectedMarket.marketType); // Refresh the data to reflect the changes
                fetchDataInactive(selectedMarket.marketType)
              } catch (error) {
                Alert.alert("Error marking item as sold: ", error);
              }
            }
          }
        ]
      );
    };
    // Function to delete a document from Firestore
    const deleteListingItem = async (item:any) => {
        Alert.alert(
        "Confirm",
        "Are you sure you want to permanently remove as sold?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                setLoadingInactive(true)
                await deleteDoc(doc(firestore, "marketBuyingSelling", item?.id));
                Alert.alert("Success", "This Item has been successfully deleted!");
                fetchDataInactive(selectedMarket.marketType)
                fetchData(selectedMarket.marketType)
              } catch (error) {
                console.error("Error removing document: ", error);
              }
              finally{
                setLoadingInactive(false)
              }
            }
          }
        ]
      );

      
    };

    
      
  return (
    <View>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginVertical:30,paddingHorizontal:20}}>
        <Image source={require("../assets/image8.png")} style={{
            width:80,height:80,borderRadius:40,borderWidth:1,borderColor:"white"
         }} />
         <WalletButton
          btnViewStyle={{width:'70%',height:56,}}
          title='NEW LISTING'
          // onPress={() => console.log("")}
          bgClr={'#719AFF'}
          btnFillUp={false}
          onPress={() => toggleBottomSheet()}           
          />
        </View>
        <View style={{ flexDirection: 'row', paddingBottom:20, }}>
          <ScrollView horizontal style={{flex:1,}}
          contentContainerStyle={{flexGrow:1}}>
          <SwitchTabSelector
          marginH={10}
          options={market_list.map(item => item.text)}
          onSelect={handleOptionSelect}
          tabSelectedIndex={tabSelectedIndex}
          setTabSelectedIndex={setTabSelectedIndex}
          conatinerBackgroundColor={defaultTheme?.colors?.skyBlue}
          selectedTextColor={defaultTheme?.colors?.black}
          unSelectedTextColor={defaultTheme?.colors?.white}
        />  
        </ScrollView>
        </View>  
        <View style={{paddingHorizontal:20,paddingBottom:50}}>
        <AppText style={[styles.textFillUp,{paddingBottom:0}]}>{"ACTIVE"}</AppText>         
        {loadingActive ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingTop: 50,  }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <>
          
          <FlatList
            data={activeListings}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingTop: 50,  }}>
                <AppText color={"white"} size={20}>No items found</AppText>
              </View>
            )}
            
          />
          </>
        )}
        <AppText style={[styles.textFillUp,{paddingTop:20,paddingBottom:0}]}>{"RENEW"}</AppText> 
        {loadingRenew ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingTop: 50,  }}>
          <ActivityIndicator size="large" color="white"  />
        </View>
      ) : (
        <FlatList
          data={renewListings}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingTop: 50,  }}>
              <AppText color={"white"} size={20}>No items found</AppText>
            </View>
          )} 
        />
      )}
        <AppText style={[styles.textFillUp,{paddingTop:30,paddingBottom:0}]}>{"INACTIVE"}</AppText> 
        {loadingInactive ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',paddingTop:50 }}>
          <ActivityIndicator size="large" color="white"  />
        </View>
      ) : (
        <FlatList
          data={InactiveListings}
          contentContainerStyle={{ flexGrow: 1, }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{  justifyContent: 'center', alignItems: 'center',paddingTop:50}}>
              <AppText color={"white"} size={20}>No items found</AppText>
            </View>
          )} 
        />
      )}
      {/* <AppText style={[styles.textFillUp,{}]}>{"PENDING PAYOUTS"}</AppText> 
      <FlatList
        data={data}
        contentContainerStyle={{flexGrow:1,}}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
        <AppText style={[styles.textFillUp,{}]}>{"PAYOUT HISTORY"}</AppText> 
      <FlatList
        data={data}
        contentContainerStyle={{flexGrow:1,}}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
        </View>     
        <BottomSheet visible={bottomSheetVisible} onClose={toggleBottomSheet}
        sheetView={{height:SCREEN_HEIGHT/2.6,}}
        > 
        <View style={{paddingTop:20,paddingHorizontal:20,}}>
          <Image source={require('../assets/downArrow.png')} style={{tintColor:"black",width:15,height:15,alignSelf:"center",}}/>
          <AppText style={{paddingTop:10}} size={21}>
          NEW LISTING
          </AppText>  
          <FlatList
                data={market_list}
                renderItem={renderListItem}
                contentContainerStyle={{flexGrow:1,height:400,}}
                keyExtractor={item => item.id.toString()}
           />
          <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />
        </View>

        </BottomSheet>     
    </View>
  )
}



export default ListTabBtn

const styles = StyleSheet.create({
    textFillUp:{
        color: 'white',
        fontSize: 23,
    }
})