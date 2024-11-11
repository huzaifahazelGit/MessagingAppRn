import { SafeAreaView, StyleSheet,View,ScrollView,Image, ImageBackground ,Text,Animated,TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Pressable} from 'react-native'
import React,{useCallback, useEffect,useRef, useState} from 'react'
import MarketHeader from '../components/MarketHeader'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import AppText from '../../../components/AppText'
import CustomButton from '../components/CustomButton'
import { SimpleMonoText } from '../../../components/text';
import { realm_added, realm_feature, realm_poular } from '../../wallet/src/data'
import { SCREEN_HEIGHT } from '../../../constants/utils'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../../../store/firebase-configNew'
import { Alert } from 'react-native'
import { FlatList } from 'react-native'
import Loader from '../../../components/Loader'

const SellerProfile = () => {
  const route:any = useRoute();
  const { image, id,sellerInfo,seller_username,description,title,amount,userId,category } = (route?.params as any)?.item;
  const navigation : any = useNavigation()
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState([]);
  const [imageLoading,setImageLoading]= useState(true)
  const [sellerFeatureData,setSellerFeatureData] = useState([])  
  let seller_userId = userId


  useFocusEffect(
    useCallback(() => {
      fetchSellerUserData();
    }, [])
  );  
  const fetchSellerUserData = async () => {
    setLoading(true);
    try {
      const dataRef = collection(firestore, "marketBuyingSelling");
      const stateQuery = query(dataRef, where("userId", "==", seller_userId), where("isMarkSold", "==", false));
      const querySnapshot = await getDocs(stateQuery);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const seller = data.filter((item:any) =>  item?.isMarkSold === false);
        const seller_data = seller.filter((item:any) =>   item?.isEnabledFeature === false || item?.isEnabledFeature === true);
        const seller_feature = seller.filter((item:any) =>  item?.isEnabledFeature === true);
        // const seller = data.filter((item:any) => item?.category === category && item?.isMarkSold === false);
        // const seller_data = seller.filter((item:any) => item?.category === category && item?.isEnabledFeature === false);
        // const seller_feature = seller.filter((item:any) => item?.category === category && item?.isEnabledFeature === true);
        setSellerData(seller)
        setSellerFeatureData(seller_feature)
      }
      else {
        console.log('No Data found against this Sellar');
      }    
    } catch (error) {
      Alert.alert("Error Sellar fetching documents: ");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
   useEffect(()=>{
  },[])
  const renderItem = ({ item }) => (
    <Pressable  style={styles.imageContainer}
    onPress={() => navigation.navigate("ListingPage", { item })}
    >
      <Image source={{uri:item?.image}} style={styles.image} />
      <View style={{position:"absolute",flexDirection:'row',paddingHorizontal:15,bottom:30,justifyContent:'space-between',}}>
        <View style={{flexDirection:"column",width:"60%",}}>
          <SimpleMonoText style={{fontSize:32}} >
            {item?.title}
        </SimpleMonoText>
        <SimpleMonoText style={{fontSize:32}} >
            {item?.category}
        </SimpleMonoText>
        </View>
        <View style={{flexDirection:'row',width:"40%",paddingLeft:40,paddingTop:10}}>
        <SimpleMonoText style={{fontSize:20,position:"relative",top:40,paddingRight:10,}} >
            {item?.amount}
        </SimpleMonoText>
        <SimpleMonoText style={{fontSize:20,position:"relative",top:40,}} >
            {'ETH'}
        </SimpleMonoText>
        </View>
      </View>
      <Loader isLoading={loading} />
    </Pressable>
  );
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>  
    {loading ?  <Loader isLoading={loading} /> :
   <Text style={styles.emptyText}>No Data found agaisnt this seller</Text> }
    </View>
  );
  const renderFeatureItem = ({ item,index }) => (
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
      <Loader isLoading={loading} />
      <View style={styles.small_contentView}>
        <View style={styles.small_leftTitleView}>
          <AppText color={"white"} size={13} >
            {"PERSON"}
          </AppText>
          <AppText style={{width:"100%",}}  color={"white"} size={14} >
            {item?.seller_username ? item?.seller_username : item?.sellerInfo?.displayName}
          </AppText>
        </View>

      </View>
    </ImageBackground>
    </Pressable>    
  );
  const renderFeatureEmptyComponent = () => (
    <View style={styles.emptyFeatureContainer}>  
    {loading ?  <Loader isLoading={loading} /> :
    <Text style={styles.emptyText}>No Data found agaisnt this seller</Text> }
       
    </View>
  );

  return (
    <SafeAreaView style={{flex:1}}>
     <MarketHeader ispaddingHorizontal={20} />
     <View style={styles.container}>
     <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow:1}}> 
        <View style={styles.profileImageView}>
        <Image source={sellerInfo?.photoURL ? {uri:sellerInfo?.photoURL} : require("../assets/image8.png")} style={styles.imageAvatar} />
        </View>
        <View style={styles.personView}>
          <AppText center size={32} color={"white"}>PERSON{'\n'}{seller_username}</AppText>
        </View>
        <View style={styles.personDescriptionView}>
          <AppText center size={14} color={"white"} >{"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</AppText>
        </View>
        <TouchableOpacity style={styles.btnView} 
        onPress={() => {
          (navigation as any).navigate("ProfileStack", {
            screen: "ProfileScreen",
            params: { userId: seller_userId },
          });
        }}
        >
            <AppText size={14} color={"white"}>
              {"Connect"}
            </AppText>
        </TouchableOpacity>
         <View style={styles.sellerImageListView}> 
            <FlatList
              data={sellerData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={sellerData.length === 0 ? styles.flatListEmpty : styles.flatListContent}
              ListEmptyComponent={renderEmptyComponent}
             />
        </View> 
        <View style={styles.sellerFeatureListView}> 
        <View style={styles.featureTextView}>
        <SimpleMonoText 
          style={styles.popularText}
        >
          {'FEATURED ITEMS'}
        </SimpleMonoText>
        <Image source={require("../../marketplace/assets/next.png")} style={styles.imageArrow} />  
        </View>   
        <FlatList
        data={sellerFeatureData}
        renderItem={renderFeatureItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sellerFeatureData.length === 0 ? styles.flatListEmpty : styles.flatListFeatureContent}
        ListEmptyComponent={renderFeatureEmptyComponent}
        />   
        </View>   
     </ScrollView>      
     </View>
    </SafeAreaView>
  )
}

export default SellerProfile

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#231F29",
  },
  btnView: {
    width: 140,
    height: 37,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    alignSelf:"center"
  },
  imageContainer: {
    flex:1,
    marginRight:20

  },
  image: {
    width: 327,
    height: 410,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  topView:{
    paddingVertical:30,
    alignSelf:"center"
  },
  imageLast: {
    width: 150,
    height: 185,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  imageArrow:{
    width:25,
    height:25,
    resizeMode:"contain",
    tintColor:"white"
  },
  popularText:{
    fontSize:20,paddingRight:10
  },
  flatListContent: {
    paddingHorizontal: 15,
  },
  flatListFeatureContent: {
    paddingHorizontal: 15,
    paddingTop:15
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 360,
    height: 415,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },

  emptyFeatureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 200,
    // borderRadius: 10,
    // borderWidth: 2,
    borderColor: 'white',
  },
  emptyText: {
    fontSize: 18,
    color: 'white',
    textAlign:"center"
  },
  
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAvatar:{
    width:150,
    height:150,
    borderRadius:70,
  },
  profileImageView:{
    paddingTop:40,
    alignItems:"center"
  },
personView:{
  paddingTop:20
},
personDescriptionView:{
  paddingTop:20,
  paddingHorizontal:35,
  paddingBottom:30
},
sellerImageListView:{
  alignItems:"center",
  paddingTop:30
},
sellerFeatureListView:{
  paddingTop:30,
  paddingBottom:20
},
featureTextView:{
  flexDirection:"row",
  alignItems:"center",
  paddingLeft:20
},
small_imageView: {
  borderRadius: 10,
  resizeMode:'cover',
  borderWidth: 2,
  borderColor: 'white',
},
small_image: {
  width: 146,
  height: 184,
  marginRight:10,
  borderRadius: 10,
},
small_contentView:{
  position: "absolute", 
  left: 10, 
  bottom: 20,
  flexDirection: 'row'
},
small_leftTitleView:{
  flexDirection: "column",
  width:"95%",
},

})