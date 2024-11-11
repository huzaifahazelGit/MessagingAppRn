import { StyleSheet, View, TouchableOpacity ,Image,FlatList, Pressable} from 'react-native'
import React,{useCallback, useState} from 'react'
import WalletButton from '../../wallet/src/components/WalletButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import BottomSheet from './BottomSheet';
import { SCREEN_HEIGHT } from '../../../constants/utils';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useMe } from '../../../hooks/useMe';
import Loader from '../../../components/Loader';

const market_list = [
  { id: 1, text: 'Gig', image: require("../assets/gig.png"), },
  { id: 2, text: 'Service',image: require("../assets/person.png"), },
  { id: 3, text: 'Buying/Selling',image: require("../assets/cart.png"), },
  { id: 4, text: 'Digital Assets',image: require("../assets/message.png"), },

];

const InboxTabBtb = () => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [activeCount,setActiveCount] = useState(0)
  const [inactiveCount,setInActiveCount] = useState(0)
  const [renewCount,setRenewCount] = useState(0)
  const [loading,setLoading] = useState(true)
  const navigation:any = useNavigation()  
  const me:any =useMe()
  let seller_id = me?.uid
  
  useFocusEffect(
    useCallback(() => {
     countRenewListings();
    }, [])
  );  
  // Fetch the documents and count them
  async function countRenewListings() {
    try {
      setLoading(true)
      const firestore = getFirestore();
      const dataRef = collection(firestore, "marketBuyingSelling");
      const renewQuery = query(dataRef, 
        where("listing_status", "==", "RENEW"), 
        where("userId", "==", seller_id)
      );
      const activeQuery = query(dataRef, 
        where("listing_status", "==", "ACTIVE"), 
        where("userId", "==", seller_id)
      );
      const inactiveQuery = query(dataRef, 
        where("isMarkSold", "==", true), 
        where("userId", "==", seller_id)
      );
      const inactiveSnapshot = await getDocs(inactiveQuery);
      const acitveSnapshot = await getDocs(activeQuery);
      const renewSnapshot = await getDocs(renewQuery);

      const activeCount = acitveSnapshot.size;
      const inactiveCount = inactiveSnapshot.size;
      const renewCount = renewSnapshot.size;

      setActiveCount(activeCount)
      setInActiveCount(inactiveCount)
      setRenewCount(renewCount)

    } catch (error) {
      console.error("Error counting documents: ", error);
    }
    finally{
      setLoading(false)
    }
  }

  const toggleBottomSheet = () => {
      setBottomSheetVisible(!bottomSheetVisible);
    };
  const hnadleBottomSheet =(item:any) =>{
    setBottomSheetVisible(!bottomSheetVisible);
    navigation.navigate("NewListing",{market_type:item?.text})
  }
  const renderItem = ({ item }:any) => (
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
      
      {/* <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} /> */}
    </View>
  );
  return (
    <View style={{paddingBottom:10,paddingHorizontal:20}}>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:30}}>
        <Image source={require("../assets/image8.png")} style={{
            width:80,height:80,borderRadius:40,borderWidth:1,borderColor:"white"
        }} />
        <WalletButton
                  btnViewStyle={{width:'70%',height:56,}}
                  title='NEW LISTING'
                  onPress={() => toggleBottomSheet()}
                  bgClr={'#719AFF'}
                  btnFillUp={false}        
          />
        </View>

        <View style={{}}>
        <AppText style={[styles.textFillUp,{paddingBottom:10}]}>{"OVERVIEW"}</AppText> 
          {/* <TouchableOpacity
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{"19"}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"SOLD"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity> 
          <TouchableOpacity
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{"5"}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"CHATS TO ANSWER"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity>   */}
          <TouchableOpacity
          disabled
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{activeCount}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"ACTIVE LISTINGS"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity>  
          <TouchableOpacity
          disabled
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{renewCount}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"LISTINGS TO RENEW"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity> 
          <TouchableOpacity
          disabled
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{inactiveCount}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"INACTIVE LISTINGS"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity>  
          {/* <TouchableOpacity
          onPress={()=>navigation?.navigate("PayoutHistory")}
          style={{flexDirection:'row',justifyContent:"space-between",width:"100%",height:60,borderRadius:20,borderColor:"white",borderWidth:1,backgroundColor:"#2C2C2C",
            alignItems:"center",
            paddingHorizontal:20,
            marginVertical:5
          }}
          >
          <AppText style={styles.overviewText}>{inactiveCount}</AppText> 
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <AppText size={16}  style={{color:"white",paddingRight:20}}>{"View Dashboard By Payouts"}</AppText> 
          <Image source={require("../assets/next.png")} style={{
            width:16,height:16,tintColor:"white",
        }} />
          </View>

          </TouchableOpacity>   */}
          <TouchableOpacity
          onPress={()=>navigation?.navigate("SellerEarningsScreen")}
          style={{width:"100%",height:40,backgroundColor:"#2C2C2C",borderRadius:20,borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center",marginTop:10}}
          >
          <AppText size={20}  color={"white"}>Seller Earnings</AppText>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={()=>navigation?.navigate("PayoutHistory")}
          style={{width:"100%",height:40,backgroundColor:"#2C2C2C",borderRadius:20,borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center",marginTop:10}}
          >
          <AppText size={20}  color={"white"}>View Dashboard By Payouts</AppText>
          </TouchableOpacity>

    
          <Loader isLoading={loading}/>
        </View>

        {/* <View style={{paddingTop:20}}>
        <AppText style={[styles.textFillUp,{paddingBottom:10}]}>{"PERFORMANCE"}</AppText> 
        <View style={{flexDirection:"row",justifyContent:'space-between'}}>
          <TouchableOpacity
          style={{width:"48%",height:80,borderRadius:10,borderWidth:1,borderColor:"white",backgroundColor:"#2C2C2C",justifyContent:"center",
          paddingHorizontal:10
          }}
          >
          <AppText size={37}  style={[{color:"white"}]}>{'$'}{""}</AppText> 
          <AppText size={12}  style={[{color:"white"}]}>{"PAYOUT HISTORY"}</AppText> 

          </TouchableOpacity>
          <TouchableOpacity
          style={{width:"48%",height:80,borderRadius:10,borderWidth:1,borderColor:"white",backgroundColor:"#2C2C2C",justifyContent:"center",
          paddingHorizontal:10
          }}
          >
          <AppText size={37}  style={[{color:"white",height:50,}]}>{'0'}</AppText> 
          <AppText size={12}  style={[{color:"white"}]}>{"CLICKS ON LISTINGS"}</AppText> 

          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row",justifyContent:'space-between',paddingTop:20}}>
          <TouchableOpacity
          style={{width:"48%",height:80,borderRadius:10,borderWidth:1,borderColor:"white",backgroundColor:"#2C2C2C",justifyContent:"center",
          paddingHorizontal:10
          }}
          >
            <View style={{flexDirection:"row",alignItems:"center",}}>
            <AppText size={37}  style={[{color:"white"}]}>{'$'}{""}</AppText> 
            </View>
        
          <AppText size={12}  style={[{color:"white"}]}>{"SELLER RATING"}</AppText> 

          </TouchableOpacity>
          <TouchableOpacity
          style={{width:"48%",height:80,borderRadius:10,borderWidth:1,borderColor:"white",backgroundColor:"#2C2C2C",justifyContent:"center",
          paddingHorizontal:10
          }}
          >
          <AppText size={37}  style={[{color:"white",height:50,}]}>{'000'}</AppText> 
          <AppText size={12}  style={[{color:"white"}]}>{"MARKETPLACE FOLLOWERS"}</AppText> 

          </TouchableOpacity>
        </View>
        </View> */}

        <BottomSheet visible={bottomSheetVisible} onClose={toggleBottomSheet}
        sheetView={{height:SCREEN_HEIGHT/2.6}}
        > 
        <View style={{paddingTop:20,paddingHorizontal:20}}>
          <Image source={require('../assets/downArrow.png')} style={{tintColor:"black",width:15,height:15,alignSelf:"center",}}/>
          <AppText style={{paddingTop:10}} size={21}>
          NEW LISTING
          </AppText>
    
          <FlatList
                data={market_list}
                renderItem={renderItem}
                contentContainerStyle={{flexGrow:1,height:400,}}
                keyExtractor={item => item.id.toString()}
          />
          <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />


        </View>


        </BottomSheet>
      
    </View>
  )
}

export default InboxTabBtb

const styles = StyleSheet.create({
    textFillUp: {
        color: 'white',
        fontSize: 23,
        // lineHeight: 34.58,
      },
      overviewText: {
        color: 'white',
        fontSize: 35,
        // lineHeight: 42,
      },
})