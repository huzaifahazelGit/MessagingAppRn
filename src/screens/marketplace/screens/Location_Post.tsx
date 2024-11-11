import { StyleSheet, Image, View,SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import AppText from '../../../components/AppText';
import WalletButton from '../../wallet/src/components/WalletButton';
import { useNavigation } from '@react-navigation/native';
import { realm_poular } from '../../wallet/src/data';


const Location_Post = () => {
    const navigation:any = useNavigation()
    const [item,setItem] =realm_poular
    return (
    <SafeAreaView style={{flex:1, backgroundColor:"#231F29",}}>
    <View style={{paddingHorizontal:18,flexDirection:"row",justifyContent:"space-between"}}>
     <AppText size={20} color={"white"}>LOCATION</AppText>
     <Image source={require("../assets/close.png")} style={{width:20,height:20,resizeMode:"contain",tintColor:"white"}}  />
    </View>
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" enabled >
    <View style={{flex:1,paddingHorizontal:20}}>
      <ScrollView style={{flex:1}}
      contentContainerStyle={{flexGrow:1,}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps
      >

      <View style={{flex:1,justifyContent:"center"}}>
        <TextInput 
        style={{fontSize:26,color:"white",borderBottomWidth:2,borderBottomColor:"white",paddingBottom:10}}
        >
        </TextInput>
        <AppText size={26} color={"gray"} style={{paddingVertical:5}} >
          New York City{'\n'}
          New York{'\n'}
          New Hampshire{'\n'}
          Nebraska
          </AppText>
      </View>   
      <View style={{paddingBottom:20,flex:1,justifyContent:"flex-end"}}>    
           <WalletButton
          btnViewStyle={{width:'100%',height:50,alignSelf:"center",borderWidth:1,borderColor:"white"}}
          title='ADD'
          onPress={() => navigation?.navigate("ListingPage",{item})}
          btnFillUp={true}
          />
      </View>
      </ScrollView>
      
    </View>
    </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default Location_Post

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
})