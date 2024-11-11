import { SafeAreaView, StyleSheet,View,ScrollView,Image, ImageBackground ,Text,Animated,TextInput, KeyboardAvoidingView, Platform} from 'react-native'
import React,{useEffect,useRef, useState} from 'react'
import MarketHeader from '../components/MarketHeader'
import { SimpleMonoText } from '../../../components/text'
import { SCREEN_HEIGHT } from '../../../constants/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import AppText from '../../../components/AppText'
import WalletButton from '../../wallet/src/components/WalletButton'
import { useKeyboardhook } from '../../../hooks/useKeyboardhook'
import { InteractionManager } from 'react-native';
const MessageSeller = () => {
  const route = useRoute();
  const { image, id } = (route.params as any).item;
  const navigation : any =useNavigation()
  const translateY = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState('');
  const [textLength,setTextLength] = useState("")
  const [loading,setLoading]= useState(true)
  const isKeyboradVsible = useKeyboardhook()

  const onChangeText = (inputText:any) => {
    // Check the length of the inputText
    if (inputText.length === 10) {
      // Perform any action when the text reaches 116 characters
      console.log('Text reached 116 characters!');
    }
    // Update the state with the new text
    setText(inputText);
  };
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
    Animated.timing(
      translateY,
      {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: true,
      }
    ).start();
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  });

  return () => interaction.cancel();

  }, []);

  return (
    <SafeAreaView style={{flex:1}}>
     <View style={styles.container}>
        <MarketHeader ispaddingHorizontal={15} />
          <SimpleMonoText style={styles.textItem}>
            {"All  > Art  >  Item Title "}
          </SimpleMonoText>
          <KeyboardAvoidingView 
              behavior='padding'
              style={[{flex:1,}]}
              contentContainerStyle={{flexGrow:1,}}
              keyboardVerticalOffset={50}
              >
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1,}}>
              <View style={styles.walletContainer}>
                <Image source={require("../assets/down-arrow.png")} 
                style={styles.imageArrow}
                resizeMode='contain'
                />
              
                <View style={{paddingTop:50,paddingHorizontal:20}}>
                <AppText size={20} style={{}} color={"white"} >YOUR MESSAGE</AppText>
                    
                <TextInput
                  style={[styles.input,{}]}
                  placeholder="Need to compose a custom track for my upcoming scifi short."
                  placeholderTextColor="white"
                  multiline
                  onChangeText={onChangeText}
                  value={text}
                >
                </TextInput>
                
                <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:10}}>
                <View style={[{flexDirection:"row"}]}>
                <Image source={require("../assets/camera.png")} 
                  style={[styles.imageListner,{marginRight:10}]}
                  resizeMode='contain'
                  />
                  <Image source={require("../assets/signal.png")} 
                    style={styles.imageListner}
                    resizeMode='contain'
                  />
                </View>
                <AppText size={15} style={{}} color={"white"}>{text.length + '/' + 2500 }</AppText>
                </View>
                
                </View>

                <View style={{paddingHorizontal:22,paddingTop:20,}}>
                  <AppText color={"#D886FF"} size={14}>👋  What is your experience with album cover design?</AppText>
                  <AppText color={"#D886FF"} size={14}>👋  Looking for someone to shoot a music video</AppText>
                </View>


          
              <View style={{paddingTop:30,alignItems:"center",paddingBottom:160,}}>
                
                <WalletButton
                    btnViewStyle={{width:'90%',}}
                    title='SEND'
                    onPress={() =>  (navigation as any).navigate("Inbox")}
                    btnFillUp
                    bgClr={'#719AFF'}
                />
                
              </View>
              
              </View> 
              {loading && <AppText style={{position:'absolute',zIndex:99,top:70,alignSelf:"center"}} size={30} color={"white"}>Processing...</AppText>}          
              <ImageBackground
                source={{uri:image}}
                style={styles.image}
                resizeMode="cover"
                imageStyle={{borderRadius: 30,borderColor: "white",borderWidth:1,}}
              >
            
                <View style={styles.overlayImage} />
  

              </ImageBackground>   
            
            </ScrollView>
          </KeyboardAvoidingView>

     </View>
    </SafeAreaView>
  )
}

export default MessageSeller

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
    backgroundColor: "#2F2C36",
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    marginTop: 5,
    top:140,
    // alignItems:"center"
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
    alignSelf:"center",
    tintColor:"white"
  },
  btnView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    color: 'white', 
    fontSize: 16,
    marginVertical: 10,
    height:300,
    width:"100%",
    paddingHorizontal: 20,
    backgroundColor:"#2F2C36",
    paddingTop:20
  },
  imageListner:{
    width:15,
    height:15,
    resizeMode:"contain",
    // alignSelf:"center",
    // tintColor:"white"
  },
  inputFocused: {
    marginBottom: 50, // Adjust according to your button height
  },
})