import { StyleSheet, Image,Text, View,SafeAreaView, ScrollView, TouchableOpacity, TextInput, Pressable, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import AppText from '../../../components/AppText';
import { Switch } from 'react-native';
import CustomMultiTabBtn from '../components/CustomMultiTabBtn';
import WalletButton from '../../wallet/src/components/WalletButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomSheet from '../components/BottomSheet';
import { SCREEN_HEIGHT } from '../../../constants/utils';
import BottomSheetDropdown from '../components/BottomSheetDropDown';
import Location_Post from '../components/LocationPost';
import Toast from 'react-native-toast-message';
import { useMe } from '../../../hooks/useMe';

import ImagePicker from 'react-native-image-crop-picker';
import { collection, doc, getDocs,query,where,updateDoc, getDoc, } from 'firebase/firestore';
import { firestore, storage } from '../../../store/firebase-configNew';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { more_list, options_condition_tag, payouts_options } from '../utils/market_data';
import Loader from '../../../components/Loader';

const EditListing = () => {
    const navigation:any = useNavigation()
    const route = useRoute();
    const { item } = (route.params as any); 
    const { republish } = (route.params as any); 
    console.log("==republish==",republish);
    console.log("===item Edit==",item);
    const [isLocationPostVisible, setLocationPostVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEnabledNFT, setIsEnabledNFT] = useState(item?.nft); // NFT
    const [isEnabledConditionTag, setisEnabledConditionTag] = useState(item?.conditionTag); // Condition
    const [isEnabledFeature, setisEnabledFeature] = useState(item?.isEnabledFeature); 
   
    const [selectedButton_condition, setSelectedButton_condition] = useState(item?.list_condition_tag);
    const [selectedButton_payment, setSelectedButton_payment] = useState(item?.payouts_method);
    const toggleSwitch1 = () => setIsEnabledNFT(previousState => !previousState);
    const toggleSwitch2 = () => setisEnabledConditionTag(previousState => !previousState);
    const toggleSwitch3 = () => setisEnabledFeature(previousState => !previousState);

    const [title, setTitle] = useState(item?.title);
    const [price, setPrice] = useState(item?.amount);
    const [quantity, setQuantity] = useState(item?.quantity);
    const [description, setDescription] = useState(item?.description);
    const [selectedLocation, setSelectedLocation] = useState(item?.location);
    const [selectedCategory, setSelectedCategory] = useState(item?.category);
    const [selectedListStatus, setSelectedListStatus] = useState(item?.listing_status);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [bottomSheetVisibleList, setBottomSheetVisibleList] = useState(false); 
    const me:any = useMe();
    const [uploading, setUploading] = useState(false);
    const [imagePath,setImagePath] = useState("")
    const [image, setImage] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(item?.image || "");


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
    const showToast = useCallback((field:any) => {
      Toast.show({
        type: 'error',
        text1: 'Fields',
        text2: `${field} cannot be empty`,
        visibilityTime: 2000,
      });
    }, []);
    const takePhotoFromCamera = () => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        console.log(image);
        setImage({ uri: image?.path });
        // uploadImage(image)
        toggleBottomSheet()
      }).catch(error => {
        console.log('Error:', error);
      });
    };
    const choosePhotoFromLibrary = () => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(image => {
        console.log("===imahe path==",image?.path);
        
        setImage({ uri: image?.path });
        setImagePath(image?.path)
        toggleBottomSheet()
        // uploadImage(image)
      }).catch(error => {
        console.log('Error:', error);
      });
    };
    const handleEditPublishToFirebase =()=> {
      if (!title) {
        showToast('Title is required');
        return;
      }
      if (!price) {
        showToast('Price is required');
        return;
      }
      if (!quantity) {
        showToast('Quantity is required');
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
      if (!image && !existingImageUrl) {
        showToast('Photo is required');
        return;
      }
       handleUpdateImage()
    };
    const handleUpdateImage = async () => {        
      try {
        const imagePath_storage = `marketBuyingSelling/${item?.fileName}`;
        const downloadURL = await uploadImage(imagePath_storage);
        if (!downloadURL) {
          throw new Error("Download URL is empty or undefined");
        }
        const documentId = item?.id; 
        await updateMarketDocument(documentId, downloadURL);
      } 
      catch (error) {
        console.error('Error: ', error);
        Alert.alert('Error', error.message);
      }
      finally{
        setUploading(false);
      }
    };
    const uploadImage = async (imagePath_storage:any) => {
      setUploading(true);
      let imageUri = imagePath || item.image; // Use item.image as fallback if imagePath is empty
      if (!imageUri) {
        console.error('Image path is empty.');
        setUploading(false);
        return null; 
      }
      const response = await fetch(imageUri);
      const blob = await response.blob(); 
      const storageRef = ref(getStorage(), imagePath_storage);    
      try {
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot?.ref);
        console.log('Uploaded a blob or file!', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image: ', error);
        throw error;
      }
      finally{
        setUploading(false);
      }
    };
    const updateMarketDocument = async (documentId,downloadURL) => {
      try {     
        console.log("==isEnabledFeature==",isEnabledFeature);
        
        setUploading(true);    
        // Reference the document you want to update
        const docRef = doc(firestore, "marketBuyingSelling", documentId); // Replace item?.id with the ID of the document you want to update 
        // Update the document with new data
        let image = downloadURL // for same name putting at firestore        
        await updateDoc(docRef, {
          title: title,
          amount: price,
          category: selectedCategory,
          description: description,
          location: selectedLocation,
          market_type: item?.market_type,
          listing_status: selectedListStatus,
          nft: isEnabledNFT,
          payouts_method: selectedButton_payment,
          conditionTag: isEnabledConditionTag,
          list_condition_tag: selectedButton_condition,
          userId: me?.uid,
          image:image,
          quantity:quantity,
          isEnabledFeature:isEnabledFeature,
          isMarkSold:republish ? false : item?.isMarkSold
        }).
        then(() => {
          Alert.alert(
            "Success",
            "Your Data has successfully updated!",
            [
              {
                text: "OK",
                onPress: () => navigation.goBack(), 
                
              },
            ],
            { cancelable: false }
          );
        })
      } catch (error) {
        console.error("Error updating document: ", error);
      }
      finally{
        setUploading(false);
      }
    };  
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
                backgroundColor: item?.text === selectedListStatus ? 'black' : 'transparent',
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
  
    return (
    <SafeAreaView style={{flex:1, backgroundColor:"#231F29",}}>
      <View style={{paddingHorizontal:18,flexDirection:"row",justifyContent:"space-between"}}>
      <AppText size={20} color={"white"}>EDIT LISTING</AppText>
      <Pressable onPress={()=>navigation.goBack()}>
      <Image source={require("../assets/close.png")} style={{width:20,height:20,resizeMode:"contain",tintColor:"white"}}  />
      </Pressable>
      </View>   
      <View style={{flex:1,}}>
        <ScrollView style={{flex:1}}
        contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}     
        >
        <View style={{paddingHorizontal:20}}>
        <View style={{paddingTop:30,flexDirection:"row",justifyContent:"space-between",}}>
           <View style={{ flex: 1, justifyContent: 'center',  }}>
          <Image
            source={image !== null ? image : { uri: item?.image }}
            style={{
              width: "90%",
              height: 150,
              resizeMode: "stretch",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "white"
            }}
            resizeMode="stretch"
          />
         {uploading && <ActivityIndicator size="large" color="white" style={{bottom:90,right:9}} />}
        </View>
          <TouchableOpacity
          onPress={()=>toggleBottomSheet()}
          style={{backgroundColor:"#3F3C46",width:"55%",height:150,borderRadius:20,borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center",}}
          >
          <Image  source={require("../assets/plus.png")} style={{width:"20%",height:40,resizeMode:"stretch"}}/>
          <AppText style={{paddingTop:10}} size={16} color={"white"}>Photo</AppText>
          <AppText style={{paddingTop:5}}   size={12} color={"gray"}>1/10</AppText>

          </TouchableOpacity>
        </View>
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
         placeholderTextColor="gray"
          keyboardType='numeric'
        />
          <TextInput
          style={styles.textInput}
          onChangeText={(value) => setQuantity(value)}
          value={quantity}
          placeholder="Quantity"
          keyboardType='decimal-pad'
          placeholderTextColor="gray"
        />
        <BottomSheetDropdown
          // categories={['Electronics', 'Books', 'Clothing', 'Toys']}
          categories={['All', 'Music', 'Art','PHOTOGRAPHY','GAMING']}
          defaultValue={item?.category}
          onSelect={handleSelect}
        />
        <TextInput style={{width:"100%",height:160,borderColor:"white",borderWidth:1,borderRadius:20,alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,marginVertical:5,fontSize:21,paddingTop:10,fontWeight:"500",color:"white"}}
        value={description}
        multiline
        placeholder='Description'
        placeholderTextColor={"white"}
        onChangeText={(value) => setDescription(value)}  
        >
        </TextInput>
        <TouchableOpacity
          style={{width:"100%",height:55,borderColor:"white",borderWidth:1,borderRadius:20,alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,marginVertical:5,flexDirection:"row"}}
          onPress={toggleLocationPost}
        >
        <AppText  size={23} color={"white"}>Location</AppText> 
        {selectedLocation && (
          <Text style={{color:"white",fontSize:20}} >
            {selectedLocation}
          </Text>
        )}
        <Image source={require("../assets/downArrow.png")}  style={{width:20,height:20,tintColor:"white",resizeMode:"contain",}}  />
        </TouchableOpacity>
        <View style={{borderBottomWidth:2,borderColor:"white",paddingTop:20}} />
        <Pressable onPress={()=>setBottomSheetVisibleList(true)}style={{paddingTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        <AppText style={{}}   size={20}  color={"white"}>More Listing Options</AppText>
        <Image source={require("../assets/downArrow.png")}  style={{width:22,height:22,tintColor:"white",resizeMode:"contain",}}  />
        </Pressable>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:20}}>
        <AppText style={{}}   size={20} color={"white"}>NFT</AppText>
        <View style={{flexDirection:"row",alignItems:"center",}}>
        <View style={styles.circle}>
        <AppText size={12}    color={"white"}>i</AppText>    
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
            <View style={{paddingTop:10,paddingLeft:20}}>
          <CustomMultiTabBtn
          selectedButton={selectedButton_condition}
          onSelect={handleButtonPressConditon}
          options={options_condition_tag} 
          purchaseFlag={false}
          />
        </View>
          }
         
          <View style={{paddingTop:20,paddingLeft:20,}}>
          <AppText style={{}}   size={20} color={"white"}>Payment Accepted</AppText>
          <CustomMultiTabBtn
            selectedButton={selectedButton_payment}
            onSelect={handleButtonPress_payment}
            options={payouts_options} 
            purchaseFlag={false}
            buttonStyle={{marginTop:10}}
            />        
          </View>
          <View style={{paddingBottom:90,paddingTop:20,paddingHorizontal:20,flex:1,justifyContent:'flex-end',}}>
          <WalletButton
              btnViewStyle={{width:'100%%',height:50,alignSelf:"center"}}
              title='PUBLISH'
              onPress={handleEditPublishToFirebase}
              bgClr={'#719AFF'}
              btnFillUp={false}         
              />
          </View>
          <Loader isLoading={uploading} />
          </ScrollView>
      </View>
      <BottomSheet
      visible={bottomSheetVisible} onClose={toggleBottomSheet}
      sheetView={{height:SCREEN_HEIGHT/2.9}}
      >
      <View style={{alignItems: 'center',paddingTop:20,}}>
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
        // onPress={() => bs?.current?.snapTo(1)}
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
      <BottomSheet visible={bottomSheetVisibleList} onClose={toggleBottomSheetList}
      sheetView={{height:SCREEN_HEIGHT/2.6}}
      > 
      <View style={{paddingTop:20,paddingHorizontal:20}}>
        <Image source={require('../assets/downArrow.png')} style={{tintColor:"black",width:15,height:15,alignSelf:"center",}}/>
        <AppText style={{paddingTop:10}} size={21}>
          LISTING
        </AppText>
        <FlatList
              data={more_list}
              renderItem={renderListItem}
              keyExtractor={item => item.id.toString()}
          />
        <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", paddingTop: 10 }} />

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

export default EditListing

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
      panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
       
      },
      header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      
      panelHeader: {
        alignItems: 'center',
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
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
      },
      textInput:{
        width:"100%",height:60,borderColor:"white",borderWidth:1,borderRadius:20,alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,marginVertical:5,flexDirection:"row",
        color:"white",fontSize:20
      }
})






