import { StyleSheet, Text, View ,Image, FlatList} from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import Loader from '../../../components/Loader';
import WalletButton from '../../wallet/src/components/WalletButton';
import BottomSheet from './BottomSheet';
import { SCREEN_HEIGHT } from '../../../constants/utils';

 const payment_history = [
    {
      id: '1',
      title: 'Title',
      coin:"NTF",
      soldOn: '03/21',
      fundsAvailable: '00/00',
      price: '$899',
      image: require("../assets/image64.png"),
    },
    {
      id: '2',
      title: 'Item 2',
      coin:"",
      soldOn: '03/21',
      fundsAvailable: '00/00',
      price: '$200',
      image: require("../assets/image65.png"),
    },
    {
      id: '3',
      title: 'Item 3',
      coin:"",
      soldOn: '03/21',
      fundsAvailable: '00/00',
      price: '$100',
      image: require("../assets/image66.png"),
    },
    // Add more items as needed
  ];
 const market_list = [
    { id: 1, text: 'Gig', image: require("../assets/gig.png"), },
    { id: 2, text: 'Service',image: require("../assets/person.png"), },
    { id: 3, text: 'Buying/Selling',image: require("../assets/cart.png"), },
    { id: 4, text: 'Digital Assets',image: require("../assets/message.png"), },
  ];
const PayoutHistory = ({NewListBtn}:any) => {
    const navigation :any= useNavigation()
    const [pendingPayouts,setPendingPayouts] = useState([])
    const [payoutsHistory,setPayoutsHistory] = useState([])
    const [loading,setLoading] = useState(true)
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    useFocusEffect(
      useCallback(() => {
        fetchPendingPayments();
      }, [])
    );  
    const fetchPendingPayments =()=> {
      setPayoutsHistory([])
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
    // Render individual purchase history item
    const renderItem = ({ item }) => (
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Image source={item.image} style={{ width: 110, height: 115, resizeMode: "stretch" }} />
          <View style={{ paddingLeft: 15 }}>
            <View style={{flexDirection:"row",bottom: 7}}>
            <AppText size={24}  color={"white"}>{item.title}</AppText>
            <AppText  size={24} color={"#d886ff"} style={{paddingLeft:10}} >{item.coin}</AppText>
            </View>
  
            <View style={{}}>
              <AppText size={12} style={{ paddingTop: 3 }} color={"gray"}>SOLD ON {item.soldOn}</AppText>
              <AppText size={12} style={{ paddingTop: 3 }} color={"gray"}>FUNDS AVAILABLE {item.fundsAvailable}</AppText>
              <AppText size={12} style={{ paddingTop: 3 }} color={"white"}>MESSAGE SELLER</AppText>
              {/* <Image source={require("../assets/download.png")} style={{ width: 16, height: 16, resizeMode: "contain", marginTop: 10 }} /> */}
            </View>
          </View>
        </View>
        <AppText size={24} style={{ bottom: 5 }} color={"white"}>{item.price}</AppText>
      </View>
    );
    const renderEmptyComponent = () => (
      <View style={styles.emptyContainer}>  
      {loading ?  <Loader isLoading={loading} /> :
     <Text style={styles.emptyText}>No Payouts Pending found</Text> }    
      </View>
    );
    const renderEmptyHistoryComponent = () => (
      <View style={styles.emptyContainer}>  
      {loading ?  <Loader isLoading={loading} /> :
     <Text style={styles.emptyText}>No Payouts History found</Text> }    
      </View>
    );
    const toggleBottomSheet = () => {
      setBottomSheetVisible(!bottomSheetVisible);
    };
    const hnadleBottomSheet =(item:any) =>{
      setBottomSheetVisible(!bottomSheetVisible);
      navigation.navigate("NewListing",{market_type:item?.text})
    }
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
  return (
    <View>
      {
        NewListBtn &&
            <View style={{flexDirection:"row",paddingVertical:30,alignItems:"center",}}>
            <Image source={require("../assets/image8.png")} style={{
              width:80,height:80,borderRadius:40,borderWidth:1,borderColor:"white",
              }} />
            <WalletButton
            btnViewStyle={{width:'70%',height:56,marginLeft:20}}
            title='NEW LISTING'
            onPress={() => toggleBottomSheet()}
            bgClr={'#719AFF'}
            btnFillUp={false}        
              />
            </View>  
      }
        <AppText size={22} color={"white"} style={[{}]}>{"PENDING PAYOUTS"}</AppText> 
         <FlatList
        data={pendingPayouts}
        contentContainerStyle={{flexGrow:1,paddingTop:20}}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyComponent}
      />
       <AppText size={22} color={"white"} style={[{}]}>{"PAYOUT HISTORY"}</AppText> 
         <FlatList
        data={pendingPayouts}
        contentContainerStyle={{flexGrow:1,paddingTop:20}}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyHistoryComponent}
      />

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
                renderItem={renderListItem}
                keyExtractor={item => item.id.toString()}
           />
          <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />
        </View>

        </BottomSheet>     
    </View>
  )
}

export default PayoutHistory

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    borderColor: 'white',
  },
  emptyText: {
    fontSize: 15,
    color: 'white',
  },
})