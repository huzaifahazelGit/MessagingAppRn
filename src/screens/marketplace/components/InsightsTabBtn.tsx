import { StyleSheet,  View, TouchableOpacity,Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import AppText from '../../../components/AppText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMe } from '../../../hooks/useMe';
import PayoutHistory from './PayoutHistory';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const InsightsTabBtn = () => {
  const navigation:any = useNavigation()
  const me:any = useMe();
  const [paybtn,setPayBtn] = useState(false)
  const [activeCount,setActiveCount] = useState(0)
  const [inactiveCount,setInActiveCount] = useState(0)
  const [renewCount,setRenewCount] = useState(0)
  const [loading,setLoading] = useState(true)
  let seller_id = me?.uid
  
  useFocusEffect(
    useCallback(() => {
     countListings();
    }, [])
  ); 
   // Fetch the documents and count them
   async function countListings() {
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
  const manageListing =()=>{
       setPayBtn(true)
  }
  
  return (
    <>
    <View style={{paddingHorizontal:10,}}>
    <View style={{flexDirection:"row",paddingVertical:30,alignItems:"center"}}>
    <Image source={require("../assets/image8.png")} style={{
        width:80,height:80,borderRadius:40,borderWidth:1,borderColor:"white"
        }} />
     <AppText style={{paddingLeft:45}}  size={25} color={"white"}>{me?.username}</AppText>
    </View>
    
    
       {/* INSIGHTS */}
    <View style={{paddingBottom:10}}>
    <AppText style={{paddingBottom:20}}  size={22} color={"white"}>INSIGHTS</AppText>
     <TouchableOpacity 
     disabled
     style={{width:"45%",height:34,backgroundColor:"white",borderRadius:80,paddingHorizontal:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"
     }}
     >
    <AppText style={{}} size={14} color={"#221F29"}>LAST WEEK</AppText>
     <Image 
     style={{width:30,height:30,tintColor:"#221F29"}}
     source={require("../assets/down-arrow.png")}
    
     />

     </TouchableOpacity>
    </View>

    {/* <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/eye.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>558</AppText>
    <AppText size={22} color={"white"}>CLICKS  ON   LISTINGS</AppText>
    </View>

    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/mark_box.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>10</AppText>
    <AppText size={22} color={"white"}>LISTING SAVES</AppText>
    </View>

    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/direction_box.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>12</AppText>
    <AppText size={22} color={"white"}>LISTING SHARE</AppText>
    </View>

    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/plus_sign.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>12</AppText>
    <AppText size={22} color={"white"}>MARKETPLACE FOLLOWS</AppText>
    </View> */}

    <View style={{borderBottomWidth:1.5,borderColor:"white",paddingTop:30}} />

   {/* YOUR LISTINGS */}
    <View style={{paddingTop:10,paddingBottom:20}}>
    <AppText style={{}}  size={22} color={"white"}>YOUR LISTINGS</AppText>
    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/mark_box.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>{activeCount}</AppText>
    <AppText size={22} color={"white"}>ACTIVE</AppText>
    </View>
    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/eye.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>{inactiveCount}</AppText>
    <AppText size={22} color={"white"}>INACTIVE</AppText>
    </View>
    <View style={{flexDirection:"row",paddingTop:15,alignItems:"center",}}>
    <Image style={{width:22,height:22,resizeMode:"contain",marginRight:15}} source={require("../assets/plus_sign.png")}/>
    <AppText size={22}  style ={{paddingRight:10}}color={"white"}>{renewCount}</AppText>
    <AppText size={22} color={"white"}>RENEW</AppText>
    </View>
    </View>
    

   
    <TouchableOpacity
    onPress={()=>navigation?.navigate("PurchaseDelivery")}
    style={{width:"100%",height:40,backgroundColor:"#2C2C2C",borderRadius:20,borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center",marginTop:10}}
    >
    <AppText size={20}  color={"white"}>Purchase History</AppText>
    </TouchableOpacity>

 
    <TouchableOpacity
    onPress={()=>navigation?.navigate("SoldMarket")}
    style={{width:"100%",height:40,backgroundColor:"#2C2C2C",borderRadius:20,borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center",marginTop:10}}
    >
    <AppText size={20}  color={"white"}>Seller History</AppText>
    </TouchableOpacity>

 
    
    
   
   
      

    

   
    </View>
    </>
  )
}

export default InsightsTabBtn

const styles = StyleSheet.create({})