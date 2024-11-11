import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, setDoc, getDoc, arrayUnion, arrayRemove, deleteDoc, updateDoc } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { firestore } from '../../../store/firebase-configNew';
import { useMe } from '../../../hooks/useMe';
import { SimpleMonoText } from '../../../components/text';
import { Image } from 'react-native';
import Loader from '../../../components/Loader';
import AppText from '../../../components/AppText';
import { Pressable } from 'react-native';

const MarketSearchScreen = ({ navigation }) => {
  const [marketData, setMarketData] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false); 
  const user = useMe();

  // const [loading,setLoading]= useState(true)
  const [allData, setAllData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  const [popularData ,setPopularData] = useState([])
  const [imageLoading,setImageLoading]= useState(true)

  // useEffect(() => {
  //   fetchSearchHistory();
  // }, []);

  useEffect(() => {
    if (searchQuery === '') {
      fetchSearchHistory();
    } else {
      fetchMarketData(searchQuery);
    }
  }, [searchQuery]);

  const fetchMarketData = async (queryStr) => {
    setLoading(true);
    try {
      const citiesRef = collection(firestore, "marketBuyingSelling");
      const stateQuery = query(citiesRef, where("userId", "!=", user?.uid));
      const querySnapshot = await getDocs(stateQuery);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter data based on search query
        const filteredData = data.filter((item) =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(queryStr.toLowerCase())
          )
        );

        // Set state for no results found
        setShowNoResults(filteredData.length === 0);

        // 

        

        const all = filteredData.filter((item:any) =>  item?.isMarkSold === false);
        const all_data = all.filter((item:any) =>  item?.isEnabledFeature === false && item?.isBookMark === false );
        const popular_all = all.filter((item:any) =>  item?.isBookMark === true && item?.isEnabledFeature === false);        
        const feature_All = all.filter((item:any) => item?.isEnabledFeature === true);

        
        setAllData(all_data);
        setFeatureData(feature_All)
        setPopularData(popular_all)

        setMarketData(filteredData);
      } else {
        setMarketData([]);
        setShowNoResults(true); // Show no results if query snapshot is empty
        console.log('No Data found against this user');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setImageLoading(false);
      }, 2000);
    }
  };

  // const fetchMarketData = async () => {
  //   try {
  //     const citiesRef = collection(firestore, "marketBuyingSelling");
  //     const stateQuery = query(citiesRef, where("userId", "!=", user?.uid));
  //     const querySnapshot = await getDocs(stateQuery);
  
  //     if (!querySnapshot.empty) {
  //       const data = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data()
  //       }));

  //       // Save the recent search query
  //       await saveSearchHistory(searchQuery);

  //       // Filter data based on search query
  //       const filteredData = data.filter((item) =>
  //         Object.values(item).some(value =>
  //           String(value).toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  //       );
  //       setMarketData(filteredData);
  //     } else {
  //       console.log('No Data found against this user');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching market data:', error);
  //   }
  //   finally{
  //     setLoading(false)
  //   }
  // };

  const saveSearchHistory = async (query) => {
    try {
      const historyRef = doc(firestore, "searchHistory", user?.uid);
      const historySnapshot = await getDoc(historyRef);
      const currentHistory = historySnapshot.exists() ? historySnapshot.data().searches : [];

      // Check for duplicate queries
      const isDuplicate = currentHistory.some(item => item.query === query);
      if (!isDuplicate) {
        const timestamp = new Date().toISOString();
        await setDoc(historyRef, {
          searches: arrayUnion({ query, timestamp })
        }, { merge: true });
        fetchSearchHistory();
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const historyRef = doc(firestore, "searchHistory", user?.uid);
      const historySnapshot = await getDoc(historyRef);
      if (historySnapshot.exists()) {
        const data = historySnapshot.data();
        setSearchHistory(data.searches || []);
      } else {
        setSearchHistory([]);
        console.log('No search history found');
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const removeAllSearchHistory = async () => {
    try {
      const historyRef = doc(firestore, "searchHistory", user?.uid);
      await deleteDoc(historyRef);
      setSearchHistory([]);
      console.log('All search history deleted successfully');
    } catch (error) {
      console.error('Error removing all search history:', error);
    }
  };

  const removeSearchHistory = async (query) => {
    try {
      const historyRef = doc(firestore, "searchHistory", user?.uid);
      await setDoc(historyRef, {
        searches: arrayRemove(query)
      }, { merge: true });
      fetchSearchHistory();
    } catch (error) {
      console.error('Error removing search history:', error);
    }
  };

  const handleSearch = (query:any) => {
    setSearchQuery(query);
    if (query) {
      saveSearchHistory(query);
      fetchMarketData(query); 
    } else {
      fetchSearchHistory();
    }
  };

  const onSubmitSearch = () => {
    if (searchQuery.trim() !== '') {
      setLoading(true); // Show loader when submitting search
      handleSearch(searchQuery.trim());
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setShowHistory(true);
  };

  const onPressCross = () => {
    setSearchQuery('');
    setShowHistory(true);
    fetchSearchHistory(); 
  };

  const renderHistory = () => (
    <>
    <View style={[{flexDirection:"row",justifyContent:"space-between"}]}>
    <Text style={[styles.title,{color:"#CDCDCD"}]}>Recent Searches:</Text>
    {searchHistory.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={removeAllSearchHistory}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
    <ScrollView>
      {searchHistory.map((item, index) => (
        <View key={index} style={styles.tagContainer}>
          <TouchableOpacity style={styles.tag} onPress={() => handleSearch(item.query)}>
            <Text style={{ color: "white", fontSize: 15 }}>{item.query}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagClose} onPress={() => removeSearchHistory(item)}>
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    
    </ScrollView>
    </>
  );

  const renderMarketData = () => (
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
          ) : popularData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center", }}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{ }}
          >
              {popularData.map((item, index) => (
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
                        {'63 ETH'}
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
          ) : allData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center",}}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{  }}
          >
              {allData.map((item, index) => (
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
                        {'63 ETH'}
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
          ) : featureData.length === 0 ? (
            <View style={{ height:170,justifyContent:"center", }}>
              <AppText center size={15} color={"white"}>No Data found</AppText>
            </View>
          ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewAllContent}
            style={{ }}
          >
              {featureData.map((item, index) => (
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
  );

  const renderNoResults = () => (
    <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
      <Text style={{color:'white'}}>No results found</Text>
    </View>
  );
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
              setLoading(true)
              const itemRef = doc(firestore, "marketBuyingSelling", item.id);
              await updateDoc(itemRef, { isBookMark: false });
              Alert.alert("Success", "Item Disliked!");
              fetchMarketData(searchQuery); // Refresh the data to reflect the changes
            } catch (error) {
              Alert.alert("Error Liking item as: ", error);
            }
            finally{
              
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
            setLoading(true)
            const itemRef = doc(firestore, "marketBuyingSelling", item.id);
            await updateDoc(itemRef, { isBookMark: true });
            Alert.alert("Success", "Item liked!");
            fetchMarketData(searchQuery); // Refresh the data to reflect the changes
          } catch (error) {
            Alert.alert("Error Liking item as: ", error);
          }
        }
      }
    ]
  );
 }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          onPress={onPressCross}
          style={styles.closeIcon}
        >
          <MaterialIcons name="close" size={24} color="#669AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          multiline={false}
          autoCapitalize={"none"}
          placeholderTextColor='rgba(255, 255, 255, 0.4)'
          placeholder={`Search by product name`}
          value={searchQuery}
          onChangeText={onChangeSearch}
          onSubmitEditing={onSubmitSearch}
          autoFocus={true}
        />
        <TouchableOpacity onPress={onSubmitSearch} style={styles.searchIcon}>
          <MaterialIcons name="search" size={30} color="#669AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#669AFF" />
        </View>
      ) : searchQuery === '' ? (
        renderHistory()
      ) : showNoResults ? (
        renderNoResults()
      ) : (
        renderMarketData()
      )}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    textAlign: "left",
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    borderBottomColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1,
  },
  searchIcon: {
    // marginLeft: 10,
    position:'relative',
    right:30
  },
  closeIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: "space-between",
    marginVertical: 5
  },
  tag: {
    // padding: 10,
    // borderRadius: 20,
  },
  tagClose: {
    marginLeft: 5,
    backgroundColor: '#ff6666',
    borderRadius: 2,
    padding: 5,
  },
  clearButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ff6666',
    fontSize: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // backgroundColor:'red'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


    scrollViewContent: {
        paddingTop:20,
        flexGrow:1
      },
      scrollViewAllContent: {
        paddingTop:10,
        paddingHorizontal:15,
        
        
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

});

export default MarketSearchScreen;

