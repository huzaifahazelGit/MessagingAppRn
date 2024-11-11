import React, { useCallback, useState } from 'react'
import { useMe } from '../../../hooks/useMe'
import { ImageBackground } from 'react-native'
import Loader from '../../../components/Loader';
import AppText from '../../../components/AppText'
import {  SimpleMonoText } from '../../../components/text'
import { firestore } from "../../../store/firebase-configNew";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StyleSheet, Image, View,ScrollView,Pressable, Alert } from 'react-native'
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc,updateDoc,where } from "firebase/firestore";


const MusicTabBtn = () => {
    const me:any = useMe();
    const navigation:any = useNavigation()
    const [loading,setLoading]= useState(true)
    const [musicData, setMusicData] = useState([]);
    const [imageLoading,setImageLoading]= useState(false)
    const [musicPopularData, setMusicPopularData] = useState([]);
    const [musicFeatureData, setMusicFeatureData] = useState([]);

    useFocusEffect(
      useCallback(() => {
        fetchMarketMusicData()
      }, [])
    );  
    const fetchMarketMusicData = async () => {      
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
          const music = data.filter((item:any) => item?.category === 'Music' && item?.isMarkSold === false);
          const music_data = music.filter((item:any) => item?.category === 'Music' && item?.isEnabledFeature === false && item?.isBookMark === false);
          const popular_music = music.filter((item:any) =>  item?.isBookMark === true && item?.isEnabledFeature === false );        
          const feature_All = music.filter((item:any) => item?.isEnabledFeature === true);
          setMusicData(music_data);
          setMusicFeatureData(feature_All)
          setMusicPopularData(popular_music)
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
                fetchMarketMusicData(); // Refresh the data to reflect the changes
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
              fetchMarketMusicData(); // Refresh the data to reflect the changes
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
          ) : musicPopularData.length === 0 ? (
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
              {musicPopularData.map((item, index) => (
                <Pressable 
                onPress={() => navigation.navigate("ListingPage", { item })}
                key={index}
                >
                <ImageBackground 
                  key={index}
                  source={{uri:item?.image}}
                  style={styles.imagePopular}
                  imageStyle={styles.imagePopularView}
                >
                  <Loader isLoading={imageLoading} />
                  <Pressable
                  onPress={() => item?.isBookMark ? handle_DisLike(item) :  handle_Like(item) }
                  style={styles.imagePopularLikeView} 
                  >
                  <Image source={item?.isBookMark ?  require("../../marketplace/assets/onlike.png"): require("../../marketplace/assets/like.png")}  style={styles.imageLike_popular} />
                  </Pressable>
                  <View style={styles.contentPopularView}>
                    <View style={styles.leftPopularTitleView}>
                      <AppText color={"white"}  style={styles.leftPopularTitle} >
                        {item?.title}
                      </AppText>
                      <AppText  color={"white"} style={styles.leftPopularTitle}  >
                      {  
                      item?.market_type === 'Digital Assets' ? "Digital Assets" :
                      item?.market_type === 'Services' ? "Services" :
                      item?.market_type === 'Buying/Selling' ? "Product" :
                      item?.market_type === 'Gig' ? "Gig" :
                      "" }
                      </AppText>
                    </View>
                    <View style={styles.rigthPopularTitleView}>
                    <AppText color={"white"} style={styles.rigthPopularTitle} >
                    {item?.amount + " "+renderSign(item?.payouts_method)}
                    </AppText> 
                    </View>
                  
                  </View>
                </ImageBackground>
                </Pressable>       
              ))}
        
          </ScrollView>
      )}
        </View> 
        <View style={styles.justAddedView}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <SimpleMonoText style={styles.addedText}>
            {'Just Added'}
        </SimpleMonoText> 
          <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />       
          </View> 
          {loading ? (
            <View style={{ height:170,}}>
            <Loader   isLoading={imageLoading} />
            </View>
          ) : musicData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center",}}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{ flex: 1 }}
          >
              {musicData.map((item, index) => (
                <Pressable 
                onPress={() => navigation.navigate("ListingPage", { item })}
                key={index}
                >
                <ImageBackground 
                  key={index}
                  source={{uri:item?.image}}
                  style={styles.imageAdded}
                  imageStyle={styles.imageAddedView}
                >
                  <Loader isLoading={imageLoading} />
                  <Pressable
                  onPress={() => item?.isBookMark ? handle_DisLike(item) :  handle_Like(item) }
                  style={styles.imageAddedLikeView} 
                  >
                  <Image source={item?.isBookMark ?  require("../../marketplace/assets/onlike.png"): require("../../marketplace/assets/like.png")}  style={styles.imageAdded_popular} />
                  </Pressable>
                  <View style={styles.contentAddedView}>
                    <View style={styles.leftAddedtitleView}>
                      <AppText color={"white"} style={styles.lefAddedTitle} >
                        {item?.title}
                      </AppText>
                      <AppText  color={"white"}  style={styles.lefAddedTitle}>
                      {  
                      item?.market_type === 'Digital Assets' ? "Digital Assets" :
                      item?.market_type === 'Services' ? "Services" :
                      item?.market_type === 'Buying/Selling' ? "Product" :
                      item?.market_type === 'Gig' ? "Gig" :
                      "" }
                      </AppText>
                    </View>
                    <View style={styles.rigthAddedTitleView}>
                    <AppText color={"white"} style={styles.rigthAddedTitle} >
                    {item?.amount + " "+renderSign(item?.payouts_method)}
                    </AppText> 
                    </View>
                  
                  </View>
                </ImageBackground>
                </Pressable>       
              ))}
        
          </ScrollView>
      )}
        </View> 
        <View style={styles.featureView}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <SimpleMonoText style={styles.featureText}>
            {'FEATURED CREATORS'}
        </SimpleMonoText> 
          <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />       
          </View> 
          {loading ? (
            <View style={{ height:170,}}>
            <Loader   isLoading={imageLoading} />
            </View>
          ) : musicFeatureData.length === 0 ? (
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
              {musicFeatureData.map((item, index) => (
                <Pressable 
                onPress={() => navigation.navigate("ListingPage", { item })}
                key={index}
                >
                <ImageBackground 
                  key={index}
                  source={{uri:item?.image}}
                  style={styles.imageAdded}
                  imageStyle={styles.imageAddedView}
                >
                  <Loader isLoading={imageLoading} />               
                  <View style={styles.contentFeatureView}>
                    <View style={styles.leftFeaturetitleView}>
                    <AppText color={"white"} style={styles.lefAddedTitle} >
                      {item?.seller_username ? item?.seller_username : item?.sellerInfo?.displayName}
                      </AppText>
                      <AppText  color={"white"}  style={styles.lefAddedTitle}>
                      {item?.category}
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

export default MusicTabBtn

const styles = StyleSheet.create({
  scrollViewContent: {
      paddingTop:20,
      flexGrow:1
    },
    scrollViewAllContent: {
      paddingTop:20,
      paddingHorizontal:15
    },
    popularText:{
      fontSize:20,
      paddingRight:10,
      paddingHorizontal:20
    },
    addedText:{
      fontSize:20,
      paddingRight:10,
      paddingHorizontal:20
    },
    featureText:{
      fontSize:20,
      paddingRight:10,
      paddingHorizontal:20
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
    imagePopularView: {
      borderRadius: 20,
      resizeMode:'cover',
      borderWidth: 2,
      borderColor: 'white',
    },
    imagePopular: {
      width: 245,
      height: 310,
      marginRight:10,
    },
    imagePopularLikeView:{
      alignSelf:"flex-end",
    },
    imageLike_popular: {
      width: 22,
      height: 22,
      tintColor:"white",
      resizeMode:"contain",
      top:15,
      right:10
    },
    contentPopularView:{
      position: "absolute", 
      bottom: 20,
      flexDirection: 'row',
      paddingHorizontal:10
    },
    leftPopularTitleView:{
      flexDirection: "column",
      width:"55%",
    },
    rigthPopularTitleView:{
      justifyContent:"flex-end",width:"45%"
    },
    rigthPopularTitle:{
      fontSize:14,
      textAlign:"right"
    },
    leftPopularTitle:{
      fontSize:23,
    },
    imageAdded: {
      width: 146,
      height: 184,
      marginRight:10,
    },
    imageAddedView: {
      borderRadius: 10,
      resizeMode:'cover',
      borderWidth: 2,
      borderColor: 'white',
    },
    imageAddedLikeView:{
      alignSelf:"flex-end",
    },
    imageAdded_popular: {
      width: 15,
      height: 15,
      tintColor:"white",
      resizeMode:"contain",
      top:10,
      right:8
    },
    contentAddedView:{
      position: "absolute", 
      bottom: 20,
      flexDirection: 'row',
      paddingHorizontal:10
    },
    leftAddedtitleView:{
      flexDirection: "column",
      width:"55%",
    },
    rigthAddedTitleView:{
      justifyContent:"flex-end",width:"45%",

    },
    rigthAddedTitle:{
      fontSize:12,
      textAlign:"right"
    },
    lefAddedTitle:{
      fontSize:14,
    },
    contentFeatureView:{
      position: "absolute", 
      bottom: 20,
      flexDirection: 'row',
      paddingHorizontal:10
    },
    leftFeaturetitleView:{
      flexDirection: "column",
      width:"100%%",
    },
    imageArrow: {
      width: 22,
      height: 22,
      tintColor:"white",
      top:2,
    },
})