import React, { useEffect, useState } from "react";
import { Image, ImageBackground, ImageSourcePropType, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SharedElement } from "react-navigation-shared-element";
import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_WIDTH,
} from "./constants";
import AppText from "../../../../components/AppText";
import { useMe } from "../../../../hooks/useMe";
import { getEthBalance } from "../utils/walletServices";
import { decryptRealmPrivateKey, getRealmWalletBalance } from "../utils/realm-tokenService";

type Props = {
  image: ImageSourcePropType;
  sharedElementId: string;
  scrollY: SharedValue<number>;
  name:string
};

export const DetailCard: React.FC<Props> = ({
  sharedElementId,
  image,
  scrollY,
  name
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-210, -30, 0, 30, 210],
      [1.05, 0.75, 0.7, 0.65, 0.4],
      Extrapolation.CLAMP
    );

    return {
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      borderRadius: CARD_BORDER_RADIUS,
      transform: [
        {
          scale,
        },
      ],
    };
  });
  const getAmountColor = (id) => {
    switch (id) {
      case '1':
        return 'white';
      case '2':
        return 'black';
      case '3':
        return 'white';
      case '4':
        return 'white';
      default:
        return 'black'; // Default color
    }
  };
  const me =useMe()
  const [ethBalance, setEthBalance] = useState('0.00');
  const [rBalance, setrBalance] = useState('0.00');

  useEffect(() => {
    const fetchBalance = async () => {
      if (me?.walletInfo?.walletAddress) {
        const balance = await getEthBalance(me.walletInfo.walletAddress);
        setEthBalance(balance);
      }
    };

    const fetchRealmBalance = async () => {
      const encryptionKey = 'your-strong-encryption-key'; 
      const decryptedPrivateKey = decryptRealmPrivateKey(me?.walletInfo?.encryptedPrivateKey, encryptionKey);
      // Optionally check balance before transferring
      const balance = await getRealmWalletBalance(decryptedPrivateKey,me?.walletInfo?.walletAddress);
      setrBalance(balance)
  
    };
    
    fetchBalance();

    fetchRealmBalance();

  
  }, [me?.walletInfo?.walletAddress]);





  return (
    <SharedElement id={sharedElementId}>
      <Animated.View style={animatedStyle}>
        {/* {name ===  'crypto' ? 
        <>
         <Image style={cardDetailStyle} source={image} resizeMode="contain" />
        </>:
        <>
        <Image style={cardDetailStyle} source={image} resizeMode="contain" />
        
        </>
        } */}
        <ImageBackground
         source={image}
         resizeMode="contain"
        //  imageStyle={cardDetailStyle}
         style={cardDetailStyle}
        >
           {name === 'crypto' &&
          <>
          <View style={{position:'relative'}}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <AppText
          style={{ 
          fontSize:50,
          left:20,
          top:50,
          color: "white",
          fontWeight:"bold"
          }}
        >
          {"Crypto"}
        </AppText>
        <AppText
          style={{ 
          fontSize:50,
          top:50,
          color: "white",
          fontWeight:"bold",
          right:30
          }}
        >
          {ethBalance}
        </AppText>
            </View>
        
        <AppText
          style={{ 
          fontSize:40,
          left:30,
          top:80,
          color: "white",
          fontWeight:"bold",
          paddingTop:90
          }}
        >
          {me?.username}
        </AppText>
          </View>
          
          </>
          }
           {name === 'r' &&
          <>
          <View style={{position:'relative'}}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <AppText
          style={{ 
          fontSize:50,
          left:20,
          top:50,
          color: "white",
          fontWeight:"bold"
          }}
        >
          {"Realm"}
        </AppText>
        <AppText
          style={{ 
          fontSize:50,
          top:50,
          color: "white",
          fontWeight:"bold",
          right:30
          }}
        >
          {rBalance}
        </AppText>
            </View>
        
        <AppText
          style={{ 
          fontSize:40,
          left:30,
          top:80,
          color: "white",
          fontWeight:"bold",
          paddingTop:90
          }}
        >
          {me?.username}
        </AppText>
          </View>
          
          </>
          }

        </ImageBackground>
      </Animated.View>
    </SharedElement>
  );
};

const cardDetailStyle = {
  width: CARD_WIDTH + 170,
  height: CARD_HEIGHT+90,
  borderRadius: 20,
  alignSelf:'center',
   left:30,top:-50
  
};
