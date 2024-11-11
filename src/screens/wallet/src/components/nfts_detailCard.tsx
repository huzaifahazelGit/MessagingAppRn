import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {  StyleSheet, View,Image, FlatList} from "react-native";
// @ts-ignore
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { nfts_data } from "../data";
import { Pressable } from "react-native";
import { SCREEN_WIDTH } from "../../../../constants/utils";
// import { Nfts_innerDetailCard } from "./nfts_innerDetailCard";

 export const Nfts_detail = () => {
  const navigation:any = useNavigation()
  const route = useRoute();
  const {  } = (route.params as any).item;
  const scrollY = useSharedValue(0);
  const [showInnerDetail, setShowInnerDetail] = useState(false);


  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const renderItem = ({ item }) => (
    <View style={{}}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const openInsideDetail = () => {
    navigation.navigate("NftsCardInnerDetail",{route})
  };
  const renderFirstItem1 = () => (
    <Pressable 
    onPress={openInsideDetail}
    >
      <Image source={require('../../assets/nfts1.png')} style={styles.image1} />
    </Pressable>
  );
  
  useEffect(()=> {
    console.log("---showInnerDetail--",showInnerDetail);
  },[showInnerDetail])

  return (
    <>
        <Animated.ScrollView
          onScroll={scrollHandler}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          {renderFirstItem1()}
         <FlatList
            data={nfts_data.slice(1)} 
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
          />
          

        </Animated.ScrollView>
        </>

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
   walletContainer:{
    flex: 1,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop: 5,
  },
  image:{
    width:165,
    height:175,
    resizeMode:"contain",
    marginRight:20
    
  },
  image1:{
    width:365,
    height:190,
    alignSelf:'center',
    resizeMode:"contain",
    // backgroundColor:"red"
    // marginLeft:10

  },
  flatListContainer: {
    paddingHorizontal:40,
    flex:1,
    paddingTop:5
    
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
 
});
