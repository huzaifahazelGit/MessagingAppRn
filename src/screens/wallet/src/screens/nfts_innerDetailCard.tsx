import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {  StyleSheet, View,Image, FlatList,ImageBackground} from "react-native";
// @ts-ignore
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
// import { nfts_data } from "../data";
import AppOverlay from '../../../../components/AppOverlay';
import WalletHeader from "../components/WalletHeader";
import WalletInnerHeader from "../components/WalletInnerHeader";
import { nfts_data } from "../data";
import { SimpleMonoText } from "../../../../components/text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../../constants/utils";

 export const Nfts_innerDetailCard = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  // const { image, id } = (route.params as any).item;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderFirstItem1 = () => (
    <View style={{}}>
      <Image source={require('../../assets/nfts1.png')} style={styles.image1} />
    </View>
  );

  const renderItem = () => (
    <>
      <View style={styles.flatContent}>
            <SimpleMonoText style={styles.text}>{"NFT NAME"}</SimpleMonoText>
            <SimpleMonoText style={styles.text}>{'$'+20}</SimpleMonoText>
      </View>
      <View style={styles.flatContent}>
            <SimpleMonoText style={styles.text}>{"by Artist"}</SimpleMonoText>
            <SimpleMonoText style={styles.text}>{'abcdf'}</SimpleMonoText>
      </View>
      <View style={styles.flatContent}>
            <SimpleMonoText style={styles.text}>{"Date Verification"}</SimpleMonoText>
            <SimpleMonoText style={styles.text}>{"10-30-2024"}</SimpleMonoText>
      </View>
      <View style={styles.flatContent}>
            <SimpleMonoText style={styles.text}>{"NFT Rate"}</SimpleMonoText>
            <SimpleMonoText style={styles.text}>{'$'+10}</SimpleMonoText>
      </View>
      </>
  );


  

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
          {renderFirstItem1()}

          {renderItem()}
  

        </Animated.ScrollView>
        </View>
</ImageBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    flexGrow:1,
  },
  btnView: {
    flex: 0.1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
  container:{
    flex:1,
    marginHorizontal:20,
  },
   walletContainer:{
    flex: 1,
    backgroundColor: "white",
    // borderRadius: 40,
    marginTop: 5,
    borderTopLeftRadius:40,
    borderTopRightRadius:40,

  },
  image:{
    width:165,
    height:175,
    resizeMode:"contain",
    marginRight:20
    
  },
  image1:{
    width:390,
    height:SCREEN_HEIGHT/2.5,
    resizeMode:'cover',
    borderRadius:15
  },
  flatListContainer: {
    paddingHorizontal:20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    color: '#221F29',
    fontSize: 20,
    lineHeight: 34.58,
  },
  flatContent:{
    flexDirection:"row",
    marginTop:10,
    justifyContent:"space-between",
    paddingHorizontal:10
  }
});
