import { StyleSheet, Text, Image,SafeAreaView,View, ImageBackground, ScrollView, FlatList} from 'react-native'
import React from 'react'
import AppText from '../../../components/AppText'
import LinearButton from '../components/linearButton'
import { useNavigation } from '@react-navigation/native'

const data = [
  {
    id: '1',
    text: 'Questions, comments or message about the items.',
    buttonText: 'APPROVE',
    bgClor:"#669AFF",
    // image: require("../assets/image64.png"),
  },
  {
    id: '2',
    text: 'More conversation about the item being sold.',
    buttonText: 'APPROVE',
    bgClor:"#D886FF",
    // image: require("../assets/image64.png"),
  },
  {
    id: '3',
    text: 'Purchase notification',
    buttonText: 'APPROVE',
    bgClor:"#669AFF",
    image: require("../assets/image64.png"),
  },
  
];
const CompleteApprove = () => {
  const navigation:any=useNavigation()
  // Render individual item
  const renderItem = ({ item }) => (
    <>
    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",paddingTop:20}}>
    <View style={[styles.circle,{backgroundColor:item?.bgClor}]}>
    <Text style={styles.text}>{"M"}</Text>
    </View>
    <AppText  size={15} style={{textAlign:'justify',width:"80%"}}  color={"white"}>{item.text}</AppText>
    </View>
    {
     item?.image &&
    <Image  source={item?.image}  style={{width:'50%',height:250,resizeMode:'cover',borderColor:"white",borderWidth:1,borderRadius:3,top:10,left:70}}/>
    }
    </>


  );
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#231F29",}}>
      <View style={{flex:1,paddingHorizontal:25,paddingTop:15}}> 
      <ScrollView style={{flex:1}}contentContainerStyle={{flexGrow:1}}>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
      <Image  source={require("../assets/drawer.png")}  style={{width:25,height:25,resizeMode:'contain'}}/>
      <ImageBackground
      source={require("../assets/logo_w.png")}  style={{width:50,height:50,alignItems:"center",justifyContent:"center"}}
      >
      <AppText center size={20} bold color={"white"}>W</AppText>
      </ImageBackground>
      <View />
      </View>
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",paddingTop:4,paddingLeft:50}}>
      <AppText  size={20}  color={"white"}>Seller Name</AppText>
      <Image  source={require("../assets/down-arrow.png")}  style={{width:30,height:30,tintColor:"white",resizeMode:"contain",top:1}}/>
      </View>

      <View style={{borderBottomWidth:2,borderColor:"white",paddingTop:15}} />

       <View style={{flex:1,justifyContent:"flex-end",paddingBottom:20}}>
  
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{flexGrow:1,}}
          />
        
         {/* APPROVE  */}
         <LinearButton
            title='APPROVE'
            onPress={()=>navigation.navigate("CompleteApprove")}
            colors={["#669AFF", "#D886FF"]}
            buttonStyle={{ borderRadius: 80, marginBottom: 5, marginVertical:10,width:"90%",alignSelf:"center"}}
            textStyle={{color:"#221F29",fontSize:20}}
          />  
       </View>
       
      </ScrollView>

        


    
      </View>
      
    </SafeAreaView>
  )
}

export default CompleteApprove

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  
})