import { useMe } from '../../../hooks/useMe'
import { ImageBackground } from 'react-native'
import Loader from '../../../components/Loader';
import AppText from '../../../components/AppText'
import React, { useCallback, useState } from 'react'
import {  SimpleMonoText } from '../../../components/text'
import { firestore } from "../../../store/firebase-configNew";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Image, View,ScrollView,Pressable, Alert } from 'react-native'
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc,updateDoc,where } from "firebase/firestore";

const GamingTabBtn = () => {
  const me:any = useMe();
  const navigation:any = useNavigation()
  const [loading,setLoading]= useState(true)
  const [gameData, setGameData] = useState([]);
  const [imageLoading,setImageLoading]= useState(false)
  const [gamePopularData, setGamePopularData] = useState([]);
  const [gameFeatureData, setGameFeatureData] = useState([]);

    useFocusEffect(
      useCallback(() => {
        fetchMarketGamingData()
      }, [])
    );  
    const fetchMarketGamingData = async () => {      
      try {
        setImageLoading(true);
        setLoading(true);
    
        const citiesRef = collection(firestore, "marketBuyingSelling");
        const stateQuery = query(
          citiesRef,
          where("userId", "!=", me?.uid),
          where("isMarkSold", "==", false),
        );
        const querySnapshot = await getDocs(stateQuery);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const game = data.filter((item:any) => item?.category === 'GAMING' && item?.isMarkSold === false);
          const game_data = game.filter((item:any) => item?.category === 'GAMING' && item?.isEnabledFeature === false);
          const popular_game = game.filter((item:any) =>  item?.isBookMark === true && item?.isEnabledFeature === false && item?.isBookMark === false);        
          const feature_Game = game.filter((item:any) => item?.isEnabledFeature === true);
          setGameData(game_data);
          setGameFeatureData(feature_Game)
          setGamePopularData(popular_game)
        } else {
          console.log('No Data found against this category');
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setImageLoading(false);
        }, 1000);
      }
    };
    const  handle_DisLike = (item:any) => {
      Alert.alert(
        "Confirm",
        "Are you sure you want to dislike this item as buy?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                const itemRef = doc(firestore, "marketBuyingSelling", item.id);
                await updateDoc(itemRef, { isBookMark: false });
                Alert.alert("Success", "Item Disliked!");
                fetchMarketGamingData(); // Refresh the data to reflect the changes
              } catch (error) {
                Alert.alert("Error Liking item as: ", error);
              }
            }
          }
        ]
      );
    }
    const  handle_Like = (item:any) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to like this item as buying?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const itemRef = doc(firestore, "marketBuyingSelling", item.id);
              await updateDoc(itemRef, { isBookMark: true });
              Alert.alert("Success", "Item liked!");
              fetchMarketGamingData(); // Refresh the data to reflect the changes
            } catch (error) {
              Alert.alert("Error Liking item as: ", error);
            }
          }
        }
      ]
    );
   }
   const renderSign =(payouts_method)=>{
    if(payouts_method == 'ETH'){
     return "ETH"
    }
    if(payouts_method == 'CRYPTO'){
     return "Crypto"
    }
    if(payouts_method == 'USD'){
     return "$"
    }
    if(payouts_method == 'REALM COIN'){
     return "realm"
    }
   
   }

  return (
    <>
    <View style={styles.popularView}>
      <View style={{flexDirection:"row",alignItems:"center"}}>
      <SimpleMonoText style={styles.popularText}>
        {'Most Popular'}
    </SimpleMonoText> 
      <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />       
      </View> 
      {loading ? (
        <View style={{ height:170,}}>
        <Loader   isLoading={imageLoading} />
        </View>
      ) : gamePopularData.length === 0 ? (
        <View style={{ height:170,justifyContent:"center", }}>
          <AppText center size={15} color={"white"}>No Data found</AppText>
        </View>
      ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewAllContent}
        style={{ flex: 1 }}
      >
          {gamePopularData.map((item, index) => (
            <Pressable 
                 onPress={() => navigation.navigate("ListingPage", { item })}
            key={index}
            >
            <ImageBackground 
              key={index}
              source={{uri:item?.image}}
              style={styles.image}
              imageStyle={styles.imageView}
            >
              <Loader isLoading={imageLoading} />
              <Pressable
              onPress={() => handle_DisLike(item) }
              style={styles.imageLikeView} 
              >
              <Image source={item?.isBookMark ?  require("../../marketplace/assets/onlike.png"): require("../../marketplace/assets/like.png")}  style={styles.imageLike} />
              </Pressable>
              <View style={styles.contentView}>
                <View style={styles.leftTitleView}>
                  <AppText color={"white"} size={23} >
                    {item?.title}
                  </AppText>
                  <AppText  color={"white"} size={23} >
                    {'Content'}
                  </AppText>
                </View>
                <AppText color={"white"} style={styles.rigthTitleView} >
                {item?.amount + " "+renderSign(item?.payouts_method)}
                </AppText> 
              </View>
            </ImageBackground>
            </Pressable>       
          ))}
    
      </ScrollView>
  )}
    </View> 
    <View style={styles.justAddedView}>
      <View style={{flexDirection:"row",alignItems:"center"}}>
      <SimpleMonoText style={styles.popularText}>
        {'JUST ADDED'}
    </SimpleMonoText> 
      <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />       
      </View> 
      {loading ? (
        <View style={{ height:170, }}>
        <Loader loaderView={{}}  isLoading={imageLoading} />
          </View>
      ) : gameData.length === 0 ? (
        <View style={{ height:170,justifyContent:"center" }}>
          <AppText center size={15} color={"white"}>No Data found</AppText>
        </View>
      ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewAllContent}
        style={{ flex: 1 }}
      >
          {gameData.map((item, index) => (
            <Pressable 
                 onPress={() => navigation.navigate("ListingPage", { item })}
            key={index}
            >
            <ImageBackground 
              key={index}
              source={{uri:item?.image}}
              style={styles.small_image}
              imageStyle={styles.small_imageView}
            >
              <Loader isLoading={imageLoading} />
              <Pressable
              onPress={() => handle_Like(item) }
              style={styles.imageLikeView} 
              >
              <Image source={item?.isBookMark ?  require("../../marketplace/assets/onlike.png"): require("../../marketplace/assets/like.png")}  style={styles.imageLike} />
              </Pressable>
              <View style={styles.small_contentView}>
                <View style={styles.small_leftAddedTitleView}>
                  <AppText color={"white"} size={14} >
                    {item?.title}
                  </AppText>
                  <AppText  color={"white"} size={14} >
                    {'Content'}
                  </AppText>
                </View>
                <AppText color={"white"} style={styles.small_rigthTitleView} >
                {item?.amount + " "+renderSign(item?.payouts_method)}
                </AppText> 
              </View>
            </ImageBackground>
            </Pressable>       
          ))}
    
      </ScrollView>
  )}
    </View> 
    <View style={styles.featureView}>
      <View style={{flexDirection:"row",alignItems:"center"}}>
      <SimpleMonoText style={styles.popularText}>
        {'FEATURED CREATORS'}
    </SimpleMonoText> 
      <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />       
      </View> 
      {loading ? (
        <View style={{ height:170, }}>
        <Loader   isLoading={imageLoading} />
        </View>
      ) : gameFeatureData.length === 0 ? (
        <View style={{ height:170,justifyContent:"center" }}>
          <AppText center size={15} color={"white"}>No Data found</AppText>
        </View>
      ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewAllContent}
        style={{ flex: 1,paddingBottom:10 }}
      >
      
          {gameFeatureData.map((item, index) => (
            <Pressable 
                 onPress={() => navigation.navigate("SellerProfile", { item })}
                 key={index}
            >
  
            <ImageBackground 
              key={index}
              source={{uri:item?.image}}
              style={styles.small_image}
              imageStyle={styles.small_imageView}
            >
              <Loader isLoading={imageLoading} />        
              <View style={styles.small_contentView}>
                    <View style={styles.small_leftTitleView}>
                    <AppText color={"white"} size={14} >
                        {item?.category}
                      </AppText>
                    <AppText  color={"white"} size={14} >
                        {/* {"PERSON"} */}
                        {item?.seller_username ? item?.seller_username : item?.sellerInfo?.displayName}
                      </AppText>
                    
                     
                    </View>
                  </View>
            </ImageBackground>
            </Pressable>       
          ))}
    
      </ScrollView>
  )}
    </View> 
    </>
  )
}

export default GamingTabBtn

const styles = StyleSheet.create({
  scrollViewContent: {
      paddingTop:20,
      flexGrow:1
    },
    scrollViewAllContent: {
      paddingTop:20,
      paddingHorizontal:15
    },
    popularView:{
        paddingTop:10
    },
    justAddedView:{
      paddingTop:20
  },
  featureView:{
    paddingTop:20
},
    imageView: {
      borderRadius: 20,
      resizeMode:'cover',
      borderWidth: 2,
      borderColor: 'white',
    },
    small_imageView: {
      borderRadius: 10,
      resizeMode:'cover',
      borderWidth: 2,
      borderColor: 'white',
    },
    image: {
      width: 245,
      height: 310,
      marginRight:10,
      borderRadius: 20,
    },
    large_image: {
      width: 245,
      height: 310,
      marginRight:10,
      borderRadius: 20,
    },
    small_image: {
      width: 146,
      height: 184,
      marginRight:10,
      borderRadius: 10,
    },
    contentView:{
      position: "absolute", 
      left: 10, 
      bottom: 30,
      flexDirection: 'row'
    },
    small_contentView:{
      position: "absolute", 
      // left: 10, 
      bottom: 20,
      flexDirection: 'row',
      paddingHorizontal:10
    },
    leftTitleView:{
      flexDirection: "column",
      width:"60%",
    },
    small_leftTitleView:{
      flexDirection: "column",
      width:"95%",
    },
    small_leftAddedTitleView:{
      flexDirection: "column",
      width:"65%",
    },
    rigthTitleView:{
      fontSize:14,
      position:"relative",
      top:40,
      left:70,
    },
    small_rigthTitleView:{
      fontSize:11,
      position:"relative",
      top:20,
      left:3
    },
    imageArrow: {
      width: 22,
      height: 22,
      tintColor:"white",
      top:2,
    },
    imageLikeView:{
      top:10,
      position:"absolute",
      zIndex:10,
      alignSelf:"flex-end",
      right:10,
    },
    imageLike: {
      width: 15,
      height: 15,
      tintColor:"white",
      resizeMode:"contain",
    },
    imageDislike: {
      width: 22,
      height: 22,
      tintColor:"white",
      resizeMode:"contain",
    },
    popularText:{
      fontSize:20,
      paddingRight:10,
      paddingHorizontal:20
    },
})