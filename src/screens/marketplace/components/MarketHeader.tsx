import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { IS_ANDROID } from "../../../constants/utils";
import { useNavigation } from "@react-navigation/native";

const MarketHeader = ({ispaddingHorizontal}:any) => {
  const navigation:any = useNavigation()
  return (
    <View style={[{height:40,paddingTop:15,paddingHorizontal:ispaddingHorizontal?ispaddingHorizontal:0,backgroundColor:"#231F29"}]}>
      <View style={{flexDirection:"row",flex:1}}>
        <View style={{flex:1,}}>
        <Image 
       source={require('../../marketplace/assets/realmLogo.png')}
       style={{width:130,height:22,resizeMode:'contain',}}
       />
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}></View>

        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable onPress={()=>navigation?.navigate("Wallet")}>
            <Image
            source={require("../../marketplace/assets/message.png")}
            style={{
              width: 25,
              height: 25,
              resizeMode: "contain",
              position: "relative",
              right: 20,
            }}
          />
            </Pressable>
        
         <Pressable
         onPress={()=>navigation?.navigate("MarketSearchScreen")}
         >

          <Image
            source={require("../../marketplace/assets/search.png")}
            style={{ width: 25, height: 25, resizeMode: "contain" }}
          />
         </Pressable>

        </View>
      </View>
    </View>
  );
};

export default MarketHeader;

const styles = StyleSheet.create({});
