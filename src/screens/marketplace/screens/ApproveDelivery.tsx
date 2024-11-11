import {  SafeAreaView, ScrollView, StyleSheet,  TouchableOpacity,  View } from 'react-native'
import React, { useState } from 'react'
import MarketHeader from '..//components/MarketHeader'
import TabSelector from '../components/tab-selector'
import MultiSelectButtons from '..//components/tab-button'
import { useNavigation } from '@react-navigation/native'
import AllTabBtn from '../components/AllTabBtn';
import ArtTabBtn from '../components/ArtTabBtn'
import AppText from '../../../components/AppText'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from 'react-native'
import { Image } from 'react-native'

const ApproveDelivery = () => {
      const navigation:any = useNavigation()
      const [selectedTab, setSelectedTab] = useState("BUYING");
      const [selectedButton, setSelectedButton] = useState<string | null>('All');
      const options = ['All', 'Music', 'Art','PHOTOGRAPHY','GAMING']; // Define options array
      const handleButtonPress = (buttonName: string) => {
        setSelectedButton(buttonName);
      };

    const renderAllSlectedBtn = ()=>{
      return (
        <AllTabBtn />
      )
    }
    const renderArtSlectedBtn = ()=>{
      return (
        <ArtTabBtn />
      )
    }
    

  return (
    <SafeAreaView style={{flex:1}}>
        <MarketHeader ispaddingHorizontal={15} />

    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tabView}>
          <TabSelector
            options={["BUYING", "SELLING"]}
            selected={selectedTab}
            setSelected={(tab:any) => {
              switch (tab) {
                case "BUYING":
                  setSelectedTab("BUYING");
                  break;
                case "SELLING":
                  setSelectedTab("SELLING");
                  break;
              
              }
            }}
            equalSpacing={true}
            // textColor={"red"}
            // buttonColor={"orange"}
          />
        </View>

            {/* APPROVE YOUR DELIVERY*/}
            <TouchableOpacity 
            onPress={()=>navigation.navigate("PurchaseDelivery")}
            style={{paddingVertical:15}} >
              <LinearGradient
                 colors={['#669AFF','#D886FF']} 
                start = {{x: 0, y: 0}}
                end = {{x: 1, y: 0 }}
                style={[styles.button, ]}
              >
                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                <Text style={[styles.text,]}>{"APPROVE YOUR DELIVERY"}</Text>
                 <Image source={require("../assets/next.png")} style={{width:22,height:22,resizeMode:"contain",tintColor:"#221F29"}}></Image>
                </View>
              
              </LinearGradient>
            </TouchableOpacity>

       {
        selectedTab === 'BUYING' ?
        <>
        <MultiSelectButtons
        selectedButton={selectedButton}
        onSelect={handleButtonPress}
        options={options} 
        />
        {
        selectedButton === 'All' ? renderAllSlectedBtn() :
        selectedButton === 'Art' ? renderArtSlectedBtn() :
        selectedButton === 'GAMING' ? renderAllSlectedBtn() :
        null
        }
        </> 
       :
       <>
       {/*Selling Tab*/}
       <View style={{flex:1,paddingTop:20}}>
        <AppText center color={"white"} size={25}>Coming Soon</AppText>
       </View>
       </>
       }

    
      </ScrollView>

    </View>
    </SafeAreaView>
  );
};

export default ApproveDelivery;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingTop:20
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 242,
    height: 307,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  imageArrow: {
    width: 22,
    height: 22,
    tintColor: "white",
    position: "relative",
    top: 2,
  },
  imageLike: {
    width: 22,
    height: 22,
    tintColor:"white",
    position:'absolute',
    top:20,
    resizeMode:"contain",
    alignSelf:"flex-end",
    right:15
  },
  popularText:{
    fontSize:20,paddingRight:10
  },
  container:{
    flex:1,
    backgroundColor:"#231F29",
    paddingHorizontal:15,
  },
  tabView:{
    paddingTop:5
  },
  button: {
    borderRadius: 80,
    justifyContent:"center",
    height:50,
  },
  text: {
    color: '#221F29', // default text color
    fontSize: 20,
    fontWeight: '500',
  },
})
