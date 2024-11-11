import React, { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView, ImageBackground, Button } from 'react-native';
import AppText from '../../../components/AppText';

const OrderDetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [loading,setLoading] = useState(true)

  console.log("==item.product_details===",item.product_details);
  

  useEffect(()=>{
    setTimeout(() => {
        setLoading(false)
    }, 1000);
  },[])
  
  const convertTimestampToDateTime = (timestamp:any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderStatus =( status:any)=>{

    if(status == 'pending'){
      return "Pending"
    }
    else{
      return status
    }
  } 

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#231F29",}}>

    <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1,paddingBottom:50}}>
      <Text style={styles.title}>Order Details</Text>
      <ImageBackground source={{ uri: item.product_details.image }} style={styles.image} imageStyle={{borderRadius:10,borderColor:"white",borderWidth:2}} >
        {loading &&  <Text style={{fontSize:25,color:'white'}}>Processing......</Text>}   
      </ImageBackground>
      <Text style={styles.label}>Description: <Text style={styles.value}>{item.product_details.description}</Text></Text>
      <Text style={styles.label}>Market Type: <Text style={styles.value}>{item.product_details.market_type}</Text></Text>
      <Text style={styles.label}>Category: <Text style={styles.value}>{item.product_details.category}</Text></Text>
      <Text style={styles.label}>Condition: <Text style={styles.value}>{item.product_details.list_condition_tag}</Text></Text>
      <Text style={styles.label}>Price: <Text style={styles.value}>{item.product_details.amount} {item.currency.toUpperCase()}</Text></Text>
      <Text style={styles.label}>Quantity: <Text style={styles.value}>{item.product_details.quantity}</Text></Text>
      <Text style={styles.label}>Location: <Text style={styles.value}>{item.product_details.location}</Text></Text>
      <Text style={styles.label}>Status: <Text style={[styles.value,{color: item.status =="pending" ? "red" : "#d886ff"}]}>{renderStatus(item.status)}</Text></Text>
      <Text style={styles.label}>Seller Name: <Text style={styles.value}>{item.product_details.seller_username}</Text></Text>
      <Text style={styles.label}>Creation Time: <Text style={styles.value}>{convertTimestampToDateTime(item?.createdAt)}</Text></Text>
      <Text style={styles.label}>Approved Time:  <Text style={styles.value}>{convertTimestampToDateTime(item?.approvalTimestamp)}</Text></Text>
      <Text style={styles.label}>Payment Id: <Text style={styles.value}>{item.product_details.paymentId ?item.product_details.paymentId:item.paymentId}</Text></Text>
      <Text style={styles.label}>Product Id: <Text style={styles.value}>{item.productId}</Text></Text>
      <Text style={styles.label}>Order Id: <Text style={styles.value}>{item.id}</Text></Text>
      <Text style={styles.label}>Currency: <Text style={styles.value}>{item.currency}</Text></Text>
      <Text style={styles.label}>Buyer Id: <Text style={styles.value}>{item.buyerId}</Text></Text>
      <Text style={styles.label}>Payment Method: <Text style={styles.value}>{'Stripe Payout'}</Text></Text>
      <Text style={styles.label}>Payment Time: <Text style={styles.value}>{convertTimestampToDateTime(item?.payTimestamp)}</Text></Text>

  
      {/* <Pressable
      onPress={()=>Alert.alert("Are you want to dowload order info? Pls wait for coming soon")}
      style={{height:40,borderRadius:10,justifyContent:"center",alignItems:"center",backgroundColor:"#d886ff",marginTop:20,flex:1}}>
      <AppText size={18} color={"white"}>{'Download'}</AppText>
      </Pressable> */}

      
    </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color:"white",
    textAlign:"center"
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    alignItems:"center",
    justifyContent:"center"
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
      color:"#669AFF"
  },
  value: {
    fontSize: 16,
    fontWeight: 'normal',
    color:"white"
  },
});

export default OrderDetailsScreen;
