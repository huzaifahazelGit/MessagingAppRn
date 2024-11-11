import {  Alert, SafeAreaView, ScrollView, StyleSheet, Image, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import MarketHeader from '..//components/MarketHeader'
import TabSelector from '../components/tab-selector'
import MultiSelectButtons from '..//components/tab-button'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import AllTabBtn from '../components/AllTabBtn';
import ArtTabBtn from '../components/ArtTabBtn'
import AppText from '../../../components/AppText'
import InboxTabBtb from '../components/InboxTabBtb'
import ListTabBtn from '../components/ListTabBtn'
import InsightsTabBtn from '../components/InsightsTabBtn';
import { useEffect } from 'react';
import { addDoc, collection, doc, getDocs, query, setDoc,where } from "firebase/firestore";
import { firestore } from "../../../store/firebase-configNew";
import { useMe } from '../../../hooks/useMe'
import MusicTabBtn from '../components/MusicTabBtn'
import PhotographyTabBtn from '../components/PhotographyTabBtn'
import GamingTabBtn from '../components/GamingTabBtn'
import PayoutHistory from '../components/PayoutHistory'
import WalletButton from '../../wallet/src/components/WalletButton'


const MarketScreen = () => {
      const navigation:any = useNavigation()
      const route = useRoute();
      const me:any = useMe();
          
  
      const [selectedTab, setSelectedTab] = useState("BUYING");
      const [selectedBuyingBtn, setSelectedBuyingBtn] = useState<string | null>('All');
      const [selectedSellingBtn, setSelectedSellingBtn] = useState<string | null>('YOUR LISTINGS');
      const options = ['All', 'Music', 'Art','PHOTOGRAPHY','GAMING']; 
      const options_selling = ['INBOX', 'YOUR LISTINGS', 'INSIGHTS']; 

      useFocusEffect(
        useCallback(() => {
          // fetchMarketData()
        }, [])
      );  

     
      const handleBuyingBtnPress = (buttonName: string) => {
        setSelectedBuyingBtn(buttonName);
      };
      const handleSellingBtnPress = (buttonName: string) => {
        setSelectedSellingBtn(buttonName);
      };
      const renderAllSlectedBtn = ()=>{
        return (
          <View style={{flex:1,}}>
          <AllTabBtn />
          </View>
        )
      }
      const renderArtSlectedBtn = ()=>{
        return (
          <View style={{flex:1,}}>
          <ArtTabBtn />
          </View>
        )
      }
      const renderMusicSlectedBtn = ()=>{
        return (
          <View style={{flex:1,}}>
          <MusicTabBtn />
          </View>
        )
      }
      const rendePhotographySlectedBtn = ()=>{
        return (
          <View style={{flex:1,}}>
          <PhotographyTabBtn />
          </View>
        )
      }
      const rendeGamingSlectedBtn = ()=>{
        return (
          <View style={{flex:1,}}>
          <GamingTabBtn />
          </View>
        )
      }
      const renderListSlectedBtn = () => {
        return (
          <View style={{paddingBottom:0}}>
          <ListTabBtn  />
          </View>
        )
      }
      const renderInboxSlectedBtn = ()=>{
        return (
          <View style={{flex:1}}>
          <InboxTabBtb />
          </View>
        )
      }
      const renderInSightSlectedBtn = ()=>{
        return (
          <View style={{flex:1,paddingLeft:20}}>
          <InsightsTabBtn />
          </View>
        )
      }
      const fetchMarketData = async () => {
        try {
          const citiesRef = collection(firestore, "marketBuyingSelling");
          const stateQuery = query(citiesRef, where("userId", "!=",me?.uid));
          const querySnapshot = await getDocs(stateQuery);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs.map(doc => ({        
              id: doc.id,
              ...doc.data()         
            }));
            setMarketData(data);
          // Filter data based on category
          const art = data.filter((item:any) => item?.category === 'Art');
          const music = data.filter((item:any) => item?.category === 'Music');
          const game = data.filter((item:any) => item?.category === 'GAMING');
          const all = data.filter((item:any) => item?.category === 'All');
          const photography = data.filter((item:any) => item?.category === 'PHOTOGRAPHY');
    
          } else {
            console.log('No Data found against this user');
          }
        } catch (error) {
          console.error('Error fetching market data:', error);
          console.log("Error fetching market data")
        }
      };
      const renderPayoutsHistory = () =>{
      return(
        <View style={{paddingHorizontal:20}}>
        <PayoutHistory NewListBtn/>  
        </View>
      )
      }
     
  return (
    <SafeAreaView style={{flex:1}}>
       <MarketHeader  ispaddingHorizontal={20}/>
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}
        style={{flex:1}}
        contentContainerStyle={{flexGrow:1,}} >       
        <View style={[styles.tabView]}>
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
       {  
        selectedTab === 'BUYING' ?
        <>
        <MultiSelectButtons
        selectedButton={selectedBuyingBtn}
        onSelect={handleBuyingBtnPress}
        options={options} 
        purchaseFlag={true}
        />
        {
        selectedBuyingBtn === 'All' ? renderAllSlectedBtn() :
        selectedBuyingBtn === 'Art' ? renderArtSlectedBtn() :
        selectedBuyingBtn === 'Music' ? renderMusicSlectedBtn() :
        selectedBuyingBtn === 'PHOTOGRAPHY' ? rendePhotographySlectedBtn() :
        selectedBuyingBtn === 'GAMING' ? rendeGamingSlectedBtn() :
        null
        }
        </> 
       :
       <>
       {/*Selling Tab*/}
       <View style={{flex:1,paddingTop:10}}>
        <MultiSelectButtons
        selectedButton={selectedSellingBtn}
        onSelect={handleSellingBtnPress}
        options={options_selling} 
        purchaseFlag={false}
        />
        {
        selectedSellingBtn === 'INBOX' ? renderInboxSlectedBtn() :
        selectedSellingBtn === 'YOUR LISTINGS' ? renderListSlectedBtn() :
        selectedSellingBtn === 'INSIGHTS' ? renderInSightSlectedBtn() : 
        renderPayoutsHistory() 
        }
       </View>
       </>
       }
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default MarketScreen;

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
    // paddingHorizontal:15,
  },
  tabView:{
    paddingTop:5,
  }
})
