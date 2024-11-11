import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
// @ts-ignore
import { RowItem, TableView } from "react-native-ios-kit";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { DetailCard } from "../components/detail-card";
import WalletHeader from "../components/WalletHeader";
import WalletInnerHeader from "../components/WalletInnerHeader";
import AppOverlay from "../../../../components/AppOverlay";
import WalletButton from '../components/WalletButton';
import { Nfts_detail } from "../components/nfts_detailCard";
import { Usd_detailCard } from '../components/usd_detailCard';
import { R_detailCard } from "../components/r_detailCard";
import { Crypto_detailCard } from "../components/crypto_detailCard";

 const CardDetail = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  console.log("===",(route.params as any).item);
  
  const { image, id,name,coin_name } = (route.params as any).item;
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });


  
  
  return (
  
    <ImageBackground
      source={require("../../../../../assets/profile_pic.png")}
      style={{ flex:1}}
    >
      <AppOverlay />
     <WalletHeader
        title='TRACK LIST'
        icon='keyboard-arrow-down'
        image={require("../../../../../assets/avatar.png")}
      />
        <View
        style={styles.walletContainer}>
        <WalletInnerHeader title="Wallet" image={require("../../../../screens/wallet/assets/dots.png")} onPressImage={()=>console.log("")}  />
         
        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
        <DetailCard
          scrollY={scrollY}
          image={image}
          sharedElementId={id}
          name={coin_name}
        />
      { 
      id == 1 ? 
      (
        <Usd_detailCard />
      ) : id == 2 ? (
         <Nfts_detail    />
      ) : id == 3 ? (
         <R_detailCard />
      ) : id == 4 ? (
         <Crypto_detailCard />
      ) : (
    <>
    
    </>
  )}
        

        </Animated.ScrollView>

       </View>
     </ImageBackground>
  );
};

export default CardDetail

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    // flex: 1,
    flexGrow:1
  },
  btnView: {
    flex: 0.1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
  container:{
    flex:1
  },
   walletContainer:{
    flex: 1,
    backgroundColor: "white",
    // borderRadius: 40,
    marginTop: 5,
    borderTopLeftRadius:40,
    borderTopRightRadius:40
    
  }
});
