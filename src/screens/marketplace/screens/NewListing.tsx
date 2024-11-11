

import { StyleSheet, Image,Text, View,SafeAreaView, ScrollView, TouchableOpacity, TextInput, Pressable, FlatList, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useCallback, useState } from 'react'
import AppText from '../../../components/AppText';
import { Switch } from 'react-native';
import CustomMultiTabBtn from '../components/CustomMultiTabBtn';
import WalletButton from '../../wallet/src/components/WalletButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomSheet from '../components/BottomSheet';
import { SCREEN_HEIGHT } from '../../../constants/utils';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheetDropdown from '../components/BottomSheetDropDown';
import Location_Post from '../components/LocationPost';
import { realm_poular } from '../../wallet/src/data';
import Toast from 'react-native-toast-message';
import SellingHeader from '../components/SellingHeader';
import { more_list, options_condition_tag, payouts_options } from '../utils/market_data';

const NewListing = (props) => {
    const navigation:any = useNavigation()
    const route = useRoute();
    const { market_type } = (route?.params as any); 
    console.log("::market_type NewListing ::",market_type);
    const [isLocationPostVisible, setLocationPostVisible] = useState(false);
    const [isEnabledNFT, setIsEnabledNFT] = useState(true); 
    const [isEnabledConditionTag, setisEnabledConditionTag] = useState(true); 
    const [isEnabledFeature, setisEnabledFeature] = useState(false); 
    const bs:any = React.createRef();
    const [image, setImage] = React.useState (null);
    const [imageData, setImageData] = React.useState (null);
    const [loading, setLoading] = useState(false);
    const [selectedButton_condition, setSelectedButton_condition] = useState("");
    const [selectedButton_payment, setSelectedButton_payment] = useState("");
    const toggleSwitch1 = () => setIsEnabledNFT(previousState => !previousState);
    const toggleSwitch2 = () => setisEnabledConditionTag(previousState => !previousState);
    const toggleSwitch3 = () => setisEnabledFeature(previousState => !previousState);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState('Select a category');
    const [selectedListStatus, setSelectedListStatus] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bottomSheetVisibleList, setBottomSheetVisibleList] = useState(false);
    const handleSelectLocation = (location:any) => {
      setSelectedLocation(location);
      toggleLocationPost();
    };
    const toggleLocationPost = () => {
      setLocationPostVisible(!isLocationPostVisible);
    };
    const handleSelect = (category:any) => {
      setSelectedCategory(category);
    };
    const handleButtonPressConditon = (buttonName: string) => {      
      setSelectedButton_condition(buttonName);
    };
    const handleButtonPress_payment = (buttonName: string) => {
      setSelectedButton_payment(buttonName);
    };
    const toggleBottomSheet = () => {
      setBottomSheetVisible(!bottomSheetVisible);
    };
    const toggleBottomSheetList = () => {
      setBottomSheetVisibleList(!bottomSheetVisibleList);
    };
    const DEFAULT_OPTIONS = {
      onSelectCurrency: () => { },
      style: {},
      showFlag: true,
      showCurrencyName: true,
      darkMode: true
  }
    const propsModel = {
      ...DEFAULT_OPTIONS,
      ...props
  }
    const handleItemPress = (item:any) => {
      setSelectedItemId(item.id);
      setSelectedListStatus(item?.text);
      toggleBottomSheetList()
    };
    const renderListItem = ({ item }) => (   
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={{ paddingTop: 10 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />
          <View style={{ flexDirection: "row", paddingTop: 15, alignItems: "center" }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: item?.id === selectedItemId ? 'black' : 'transparent',
                marginLeft: 20,
                borderWidth:1
            
              }}
            />
            <AppText style={{ paddingLeft: 20, lineHeight: 20 }} size={21}>
              {item.text}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
    const takePhotoFromCamera = () => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setLoading(true)
        setImage({ uri: image?.path }); 
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }).catch(error => {
        console.log('Error:', error);
      }
      
    )
    };
    const choosePhotoFromLibrary = () => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).
      then(image => {
          setLoading(true)
        const { path } = image;
        setImage({ uri: path });
        setImageData(image)
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        toggleBottomSheet();
      }).catch(error => {
        console.log('Error:', error);
      });
    }; 
    const showToast = useCallback((field:any) => {
      Toast.show({
        type: 'error',
        text1: 'Info',
        text2: `${field}`,
        visibilityTime: 2000,
      });
    }, []);
    const handlePreviewBtn = async() => {
      if (!image) {
        showToast('Photo is required');
        return;
      }
      if (!title) {
        showToast('Title is required');
        return;
      }
      if (!price) {
        showToast('Price is required');
        return;
      }
      if (!quantity) {
        showToast('Price is required');
        return;
      }
      if (!selectedCategory) {
        showToast('Select a Category');
        return;
      }
      if (!description) {
        showToast('Description is Required');
        return;
      }
      if (!selectedListStatus) {
        showToast('Select Status Active or Renew');
        return;
      } 
      if (!payouts_options) {
        showToast('Select Payment Method');
        return;
      } 
      const item = {
        image,
        title, 
        price,
        selectedCategory,
        description,
        selectedLocation,
        isEnabledNFT,
        isEnabledConditionTag,
        selectedListStatus,
        selectedButton_condition,
        selectedButton_payment,
        market_type,
        quantity,
        imageData,
        isEnabledFeature
      };
        //  let upload_response = await uploadImage()
        navigation?.navigate('PostPublish', { item });
    };
  
    return (
    <SafeAreaView style={styles.safeAreaView}>
      <SellingHeader title='New Listing' /> 
      <KeyboardAvoidingView style={{flex:1}} behavior='padding'>
       <ScrollView style={{flex:1}}
        contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        >
        <View style={styles.textInputConatiner}>
        <View style={styles.imageContainer}>
          <View style={styles.imageContainerView}>
          <Image
            source={image !== null ? image : require("../assets/dumy.jpg")}
            style={styles.image}
            resizeMode="stretch"
          />
         {loading && <ActivityIndicator size='large' color="white" style={{position:"absolute",alignSelf:"center"}}  />}
          </View>
          <TouchableOpacity
          onPress={()=>toggleBottomSheet()}
          style={styles.viewTextInput}
          >
          <Image  source={require("../assets/plus.png")} style={styles.plusImage}/>
          <AppText style={{paddingTop:10}} size={16} color={"white"}>Photo</AppText>
          {/* <AppText style={{paddingTop:5}}   size={12} color={"gray"}>1/10</AppText> */}
          </TouchableOpacity>
        </View>
        {/* FORM INFO */}
        <View style={{paddingTop:20}}>
        <TextInput
          style={styles.textInput}
          onChangeText={(value) => setTitle(value)}
          value={title}
          placeholder="Title"
          placeholderTextColor="gray"
        />

        <TextInput
          style={styles.textInput}
          onChangeText={(value) => setPrice(value)}
          value={price}
          placeholder="Price"
          keyboardType='decimal-pad'
        />

         <TextInput
          style={styles.textInput}
          onChangeText={(value) => setQuantity(value)}
          value={quantity}
          placeholder="Quantity"
          keyboardType='decimal-pad'

        />
        <BottomSheetDropdown
          // categories={['Electronics', 'Books', 'Clothing', 'Toys']}
          categories={['Music', 'Art','PHOTOGRAPHY','GAMING']}
          defaultValue="Select a category"
          onSelect={handleSelect}
        />
        <TextInput style={styles.descriptionView}
        value={description}
        multiline
        placeholder='Description'
        placeholderTextColor={"gray"}
        onChangeText={(value) => setDescription(value)}  
        >
        </TextInput>
        <TouchableOpacity
          style={styles.locationView}
          onPress={toggleLocationPost}
        >
        <AppText  size={23} color={"gray"}>Location</AppText> 
        {selectedLocation && (
          <Text style={{color:"white",fontSize:20}} >
            {selectedLocation}
          </Text>
        )}
        <Image source={require("../assets/downArrow.png")}  style={styles.downArrowImage}  />
        </TouchableOpacity>
        <View style={styles.moreListView} />
        <Pressable onPress={()=>setBottomSheetVisibleList(true)}style={{paddingTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        <AppText style={{}}   size={20}  color={"white"}>More Listing Options</AppText>
        <Image source={require("../assets/downArrow.png")}  style={{width:22,height:22,tintColor:"white",resizeMode:"contain",}}  />
        </Pressable>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:20}}>
        <AppText style={{}}   size={20} color={"white"}>NFT</AppText>
        <View style={{flexDirection:"row",alignItems:"center",}}>
        <View style={styles.circle}>
        <AppText size={12} color={"white"}>i</AppText>    
        </View> 
        
        <Switch
        
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabledNFT ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch1}
            value={isEnabledNFT}
          />
        
        </View>
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:20}}>
        <AppText style={{}}   size={20} color={"white"}>Condition</AppText>
        <View style={{flexDirection:"row",alignItems:"center",}}>   
        <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabledConditionTag ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch2}
            value={isEnabledConditionTag}
          />     
        </View>
        </View>     
        </View>
        </View>
        { 
          isEnabledConditionTag &&
        <View style={styles.condtionTagView}>
          <CustomMultiTabBtn
          selectedButton={selectedButton_condition}
          onSelect={handleButtonPressConditon}
          options={options_condition_tag} 
          purchaseFlag={false}
          />
        </View> 
        }         
        <View style={styles.paymentView}>
        <AppText size={20} color={"white"}>Payment Accepted</AppText>
        <CustomMultiTabBtn
          selectedButton={selectedButton_payment}
          onSelect={handleButtonPress_payment}
          options={payouts_options} 
          purchaseFlag={false}
          buttonStyle={{marginTop:10}}
          />        
        </View>
        <View style={styles.btnView}>
        <WalletButton
            btnViewStyle={styles.btnPreview}
            title='PREVIEW'
            onPress={handlePreviewBtn }
            bgClr={'#719AFF'}
            btnFillUp={false}         
            />
        </View>
      </ScrollView>
      </KeyboardAvoidingView> 
      <BottomSheet
      visible={bottomSheetVisible} onClose={toggleBottomSheet}
      sheetView={{height:SCREEN_HEIGHT/2.9}}
      >
      <View style={styles.bottomPhotoView}>
      <Text style={styles.panelTitle}>
        {'Upload Photo'}
      </Text>
      <Text style={styles.panelSubtitle}>
        {'Choose Your Listing Picture'}
      </Text>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
        >
        <Text style={styles.panelButtonTitle}>
          {'Take Photo'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}
        >
        <Text style={styles.panelButtonTitle}>
          {"Choose From Gallery"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={()=>toggleBottomSheet()}
        >
        <Text style={styles.panelButtonTitle}>
          {"Cancel"}
        </Text>
      </TouchableOpacity>  
      </View>
      </BottomSheet>
      <Location_Post
        visible={isLocationPostVisible}
        onClose={toggleLocationPost}
        onSelectLocation={handleSelectLocation}
      />  
       <BottomSheet
        visible={bottomSheetVisibleList}
        onClose={toggleBottomSheetList}
        sheetView={{height:SCREEN_HEIGHT/2.6}}
        > 
        <View style={styles.bootomListViewStaus}>
          <Image source={require('../assets/downArrow.png')} 
          style={styles.downListImage}/>
          <AppText style={{paddingTop:10}} size={21}>
           Listing Status
          </AppText>
          <FlatList
            data={more_list}
            renderItem={renderListItem}
            keyExtractor={item => item.id.toString()}
           />
          <View style={styles.lineView} />


         <View style={{paddingTop:20,flexDirection:"row",justifyContent:"space-between",paddingHorizontal:10,}}>
          <AppText size={25}> Add Feature</AppText>
         <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabledConditionTag ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch3}
            value={isEnabledFeature}
          />
         </View>
        </View>

      
        
       </BottomSheet>
    </SafeAreaView>
  )
}

export default NewListing

const styles = StyleSheet.create({
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11, 
        marginRight:10,
        borderWidth:1,
        borderColor:"white",
        alignItems:'center',
        justifyContent:"center"
      },
    textInput:{
      width:"100%",
      height:60,
      borderColor:"white",
      borderWidth:1,
      borderRadius:20,
      alignItems:"center",
      justifyContent:"space-between",
      paddingHorizontal:20,
      marginVertical:5,
      flexDirection:"row",
      color:"white",fontSize:20
    },
    safeAreaView:{
      flex:1,
      backgroundColor:"#231F29",
    },
    imageContainer:{
      paddingTop:30,flexDirection:"row",justifyContent:"space-between",
    },
    image:{
      width: "90%",
      height: 150,
      resizeMode: "stretch",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "white"
    },
    imageContainerView:{
      flex:1,
      justifyContent:"center",
    },
    viewTextInput:{
      backgroundColor:"#3F3C46",
      width:"55%",
      height:150,
      borderRadius:25,
      borderColor:"white",
      borderWidth:1,
      justifyContent:"center",
      alignItems:"center",
    },
    plusImage:{
      width:"20%",
      height:40,
      resizeMode:"stretch"
    },
    downArrowImage:{
      width:20,
      height:20,
      tintColor:"white",
      resizeMode:"contain",
    },
    descriptionView:{
      width:"100%",
      height:160,
      borderColor:"white",
      borderWidth:1,
      borderRadius:20,
      alignItems:"center",
      justifyContent:"space-between",
      paddingHorizontal:20,
      marginVertical:5,
      fontSize:21,
      paddingTop:10,
      fontWeight:"500",
      color:"white"
    },
    locationView:{
      width:"100%",
      height:55,
      borderColor:"white",
      borderWidth:1,
      borderRadius:20,
      alignItems:"center",
      justifyContent:"space-between",
      paddingHorizontal:20,
      marginVertical:5,
      flexDirection:"row"
    },
    moreListView:{
      borderBottomWidth:2,
      borderColor:"white",
      paddingTop:20
    },
    btnView:{
      paddingBottom:20,
      paddingTop:20,
      paddingHorizontal:20,
      flex:1,
      justifyContent:'flex-end'
    },
    btnPreview:{
      width:'100%%',
      height:50,
      alignSelf:"center"
    },
    paymentView:{
      paddingTop:20,
      paddingLeft:20,
    },
    condtionTagView:{
      paddingTop:10,
      paddingLeft:20
    },
    textInputConatiner:{
      paddingHorizontal:20
    },
    bootomListViewStaus:{
      paddingTop:20,
      paddingHorizontal:20
    },
    lineView:{
      borderBottomWidth: 1, 
      borderBottomColor: "lightgray", 
      paddingTop: 10
    },
    downListImage:{
      tintColor:"black",
      width:15,
      height:15,
      alignSelf:"center"
    },
    loadindView:{
      bottom:90,
      right:9
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
   
    }, 
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'gray',
      alignItems: 'center',
      marginVertical: 7,
      width:"80%"
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'black',
    },
    bottomPhotoView:{
      alignItems: 'center',
      paddingTop:20,
    }
})

