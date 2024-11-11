import { SafeAreaView, StyleSheet,View,ScrollView,Image, ImageBackground ,Text,Animated, Alert} from 'react-native'
import React,{useEffect,useRef, useState} from 'react'
import MarketHeader from '../components/MarketHeader'
import { SimpleMonoText } from '../../../components/text'
import { SCREEN_HEIGHT } from '../../../constants/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import AppText from '../../../components/AppText'
import WalletButton from '../../wallet/src/components/WalletButton'
import { InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import Loader from '../../../components/Loader';

const DownloadDigital = () => {
  const route = useRoute();
  const { image, id,title } = (route.params as any).item;
  const navigation : any =useNavigation()
  const translateY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      Animated.timing(translateY, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: true,
      }).start();
    });

    return () => interaction.cancel();
  }, []);

  const translateYInterpolate = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Change the value to adjust the final position
  });

  const downloadFile = async () => {
    setLoading(true)
    const imageUrl = image
    const fileName = 'downloaded-image.jpg';
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    console.log("Downloading from", imageUrl);

    try {
      const response = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      }).promise;

      if (response?.statusCode === 200) {
        Alert.alert('Download complete', 'Your image has been downloaded.');
        setTimeout(() => {
          navigation?.navigate("MarketScreen")
        }, 1000);
      } else {
        throw new Error('Failed to download image');
      }
    } catch (error) {
      Alert.alert('Download failed', error.message);
    } finally {
      setLoading(false);
    }
   
  };

  return (
    <SafeAreaView style={{flex:1}}>
     <View style={styles.container}>
        <MarketHeader ispaddingHorizontal={15} />
          <SimpleMonoText style={styles.textItem}>
            {"All  > Art  >  " +  title}
          </SimpleMonoText>
          <ScrollView contentContainerStyle={{flexGrow:1,}}>
            <View style={[styles.walletContainer,{}]}>
              <Image source={require("../assets/down-arrow.png")} 
              style={styles.imageArrow}
              resizeMode='contain'
              />
             <Animated.View style={{ transform: [{ translateY: translateYInterpolate }] }}>
            <ImageBackground
              source={{uri:image}}
              style={styles.innerImage}
              resizeMode="cover"
              imageStyle={{borderRadius: 20,borderColor: "white",borderWidth:1,}}
            >
              {loading && <AppText style={{position:'absolute',zIndex:99,top:240,alignSelf:"center"}} size={30} color={"white"}>Processing...</AppText>}      
              <Loader isLoading={loading} />
            </ImageBackground>
            </Animated.View>
              
            <AppText size={25} center style={{paddingVertical:20}}>Thank you for your {"\n"} Purchase!</AppText>
            <AppText size={14} center >Download your file below.</AppText>
          
            <View style={{paddingTop:20,alignItems:"center",paddingBottom:20}}>
              <WalletButton
                  btnViewStyle={{width:'90%',}}
                  title='DOWNLOAD'
                  // onPress={() => navigation.navigate("MessageSeller", { item: (route.params as any).item })}
                onPress={downloadFile}
                  btnFillUp
                  bgClr={'#719AFF'}
              />
            </View>
            
            </View> 
            <ImageBackground
              source={{uri:image}}
              style={styles.image}
              resizeMode="cover"
              imageStyle={{borderRadius: 30,borderColor: "white",borderWidth:1,}}
            >
              <View style={styles.overlayImage} />
              

            </ImageBackground>   
           
          </ScrollView>
     </View>
    </SafeAreaView>
  )
}

export default DownloadDigital

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#231F29",
  },
  textItem: {
    fontSize: 16,
    paddingTop:15,
    paddingLeft:15
  },
  image: {
    width: "95%",
    height: SCREEN_HEIGHT * 0.5,
    marginBottom: 10,
    zIndex:-10,
    position:"absolute",
    top:30,
    left:20,
  },
  walletContainer:{
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    marginTop: 5,
    top:140,
    paddingBottom:150
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    // ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.5)', // Adjust the opacity as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  overlayImage:{
    position: 'absolute',
    top: 0,
    right: 20,
    bottom: 0,
    left: 0,
    backgroundColor: '#2F2C36',
    opacity: 0.6,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  innerImage:{
    width: 241,
    height: 320,
    // marginBottom: 10,
    // zIndex:-10,
    // position:"absolute",
    // top:30,
    // left:20,
    // alignSelf:"center"
    marginTop:20,
    alignSelf:"center"
  },
  imageArrow:{
    width:45,
    height:45,
    resizeMode:"contain",
    alignSelf:"center"
  },
  btnView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
})