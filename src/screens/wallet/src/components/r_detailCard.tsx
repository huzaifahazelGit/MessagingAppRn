import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import {  FlatList, StyleSheet, View,Text } from "react-native";
// @ts-ignore
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import WalletButton from "./WalletButton";
import { BoldText, SimpleMonoText } from "../../../../components/text";
import { crypto_data, realm_data } from "../data";

 export const R_detailCard = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  const { image, id } = (route.params as any).item;
  const scrollY = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    animateProgress();
  }, []);

  

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
 
  const renderItem = ({ item }) => (
    <View style={styles.flatContent}>
      <View style={{flexDirection:"row"}}> 
      <SimpleMonoText style={styles.text}>{item?.coin_name} </SimpleMonoText>
      <SimpleMonoText style={{
        fontSize: 20,
      lineHeight: 34.58,
      paddingTop:5,
      color:"#221F29"
      }}>{item?.coin_token} </SimpleMonoText>
      {/* <SimpleMonoText style={[styles.textToken]}>{item?.coin_token} </SimpleMonoText> */}
      </View>
    
      <SimpleMonoText style={styles.textValue}>{'VALUE'}</SimpleMonoText>
    </View>
  );

  const animateProgress = () => {
    progress.value = withTiming(80, { duration: 2000 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });
  
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

          <View style={{flexDirection:'row-reverse',paddingTop:10}}>
          <View style={{alignItems:'flex-end'}}>
            <BoldText style={{color:"#221F29",fontSize: 22,}}>{'25'}</BoldText>
            <SimpleMonoText style={{color:"#221F29",fontSize: 12,}}>{'XP POINTS'}</SimpleMonoText>
            <SimpleMonoText style={{color:"#221F29",fontSize: 12,}}>{'TO NEXT COIN'}</SimpleMonoText>
          </View>     
          </View>
         
          <View style={{}}>
          <SimpleMonoText style={styles.text}>{'Achievements'}</SimpleMonoText>
          <View style={{borderBottomWidth:3,borderBottomColor:"#221F29"}} />
          </View>

          <View style={{}}>
            <FlatList
                data={realm_data} 
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={{flex:1}}
                contentContainerStyle={{}}
              />

            <View style={{paddingTop:20,paddingBottom:20}}>
              <WalletButton 
              title="Full Dashboard" 
              btnFillUp={true} 
              onPress={()=>console.log("")}
              bgClr={'#221F29'}
              />
              
            </View>

          </View>

      

      
        </Animated.ScrollView>

  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    flexGrow:1
  },
  container:{
    flex:1,
    paddingHorizontal:25,
  },
   btnView: {
      flex: 0.1,
      justifyContent: "flex-end",
      paddingHorizontal: 22,
      paddingBottom: 50,
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
      color: 'whitw',
      fontSize: 20,
      lineHeight: 34.58,
    },
    flatContent:{
      flexDirection:"row",
      paddingHorizontal:10,
      justifyContent:'space-between',
      borderBottomWidth:0.2,
      borderBottomColor:"#221F29",
      paddingBottom:5,
      // backgroundColor:"orange",
      
    },
    containeBar: {
      height: 20,
      backgroundColor: '#red',
      borderRadius: 10,
      margin: 10,
    },
    bar: {
      height: 27,
      backgroundColor: '#669AFF',
      borderRadius: 15,
    },
 
 
});
