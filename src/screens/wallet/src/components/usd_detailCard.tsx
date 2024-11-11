import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {  StyleSheet, View,Image, } from "react-native";
// @ts-ignore
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import WalletButton from "./WalletButton";

 export const Usd_detailCard = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  const { image, id } = (route.params as any).item;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
 
  return (

        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <View style={styles.btnView}>
          <WalletButton 
            title='Add'    
            onPress={() => navigation.navigate("Bank", { type: "add" })}
            btnFillUp={false}
          />
          <WalletButton
            title='Withdraw'
            onPress={() => navigation.navigate("Bank", { type: "withdraw" })}
            btnFillUp={false}
          />
          <WalletButton
            title='Transaction History'
            onPress={() => console.log("Withdraw")}
            btnFillUp={false}
          />
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
    flex:1
  },
   btnView: {
      flex: 0.1,
      justifyContent: "flex-end",
      paddingHorizontal: 22,
      paddingBottom: 50,
    },
 
 
});
