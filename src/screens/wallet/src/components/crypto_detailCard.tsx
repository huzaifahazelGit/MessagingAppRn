import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {  StyleSheet, View,Image, FlatList, } from "react-native";
// @ts-ignore
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import WalletButton from "./WalletButton";
import { SimpleMonoText } from "../../../../components/text";
import { crypto_data } from "../data";
import { getEthBalance } from "../utils/walletServices";
import { useMe } from "../../../../hooks/useMe";
import AppText from "../../../../components/AppText";
import { Pressable } from "react-native";

 export const Crypto_detailCard = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  const { image, id } = (route.params as any).item;
  const scrollY = useSharedValue(0);
  const me =useMe()
  const [ethBalance, setEthBalance] = useState('0.00');

  const progress = useSharedValue(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (me?.walletInfo?.walletAddress) {
        const balance = await getEthBalance(me.walletInfo.walletAddress);
        setEthBalance(balance);
      }
    };
    
    fetchBalance();
  }, [me?.walletInfo?.walletAddress]);

  useEffect(() => {
    animateProgress();
  }, []);


  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animateProgress = () => {
    progress.value = withTiming(80, { duration: 2000 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  const renderItem = ({ item }) => (
    <Pressable
    style={styles.flatContent}
    onPress={()=>navigation.navigate("WalletHistory",{item:me?.walletInfo})}
    >
      <SimpleMonoText style={styles.text}>{item?.coin_name}
      </SimpleMonoText>
      <SimpleMonoText style={[styles.textToken]}>{item?.coin_token} </SimpleMonoText>
      <SimpleMonoText style={styles.textValue}>{renderValue(item?.coin_token)}</SimpleMonoText>

      
    </Pressable>
  );

  const renderValue = (coin) =>{
   if (coin === 'ETH'){
    return ethBalance + ' ' + coin
   }
   else{
    return 0.00
   }
  }

  return (

        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >

        <View style={{backgroundColor:"#DCDCDC",height: 27, borderRadius: 15,marginTop:20}}>
        <Animated.View style={[ animatedStyle]} >
        <LinearGradient
        colors={['#FFFFFF', '#669AFF', '#D886FF']}
        style={[styles.bar,]}
        >
        </LinearGradient>
        </Animated.View>
       </View>

        <View style={{paddingTop:20}}>
        <SimpleMonoText style={styles.text}>{'Currencies'}</SimpleMonoText>
        <View style={{borderBottomWidth:2,borderBottomColor:"#221F29"}} />
        </View>
         
         <View>
        <FlatList
            data={crypto_data} 
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{}}
          />
         </View>
         
        </Animated.ScrollView>

  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    flexGrow:1,
  },
  container:{
    flex:1,
    paddingHorizontal:25,
  },
  text: {
    color: '#221F29',
    fontSize: 20,
    lineHeight: 34.58,
    paddingTop:5,
  },
  textValue: {
    color: '#D886FF',
    fontSize: 20,
    lineHeight: 34.58,
    paddingTop:10,
  },
  textToken: {
    color: '#221F29',
    fontSize: 20,
    lineHeight: 34.58,
  },
  flatContent:{
    flexDirection:"row",
    paddingHorizontal:10,
    justifyContent:'space-between',
    borderBottomWidth:0.2,
    borderBottomColor:"#221F29",
    paddingBottom:5
  },
  bar: {
    height: 27,
    backgroundColor: '#669AFF',
    borderRadius: 15,
  },
  
 
});
