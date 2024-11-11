import React, { memo, useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SharedElement } from "react-navigation-shared-element";
import {
  CARD_BORDER_RADIUS,
  CARD_HEIGHT,
  CARD_WIDTH,
  mobileKeyCardTranslateYOutput,
} from "./constants";
import { BoldMonoText } from "../../../../components/text";
import { View } from "react-native";
import { getEthBalance } from "../utils/walletServices";
import { useMe } from "../../../../hooks/useMe";
import AppText from "../../../../components/AppText";

type Props = {
  onPress?: () => void;
  index: number;
  scrollY: SharedValue<number>;
  shouldDisplayAsStack?: boolean;
  sharedElementId: string;
  imageSource: ImageSourcePropType;
  item:any
};

const CardInner: React.FC<Props> = ({
  shouldDisplayAsStack = false,
  sharedElementId,
  onPress,
  scrollY,
  imageSource,
  index: i,
  item
}) => {  
  const animatedStyle = useAnimatedStyle(() => {

    const animatedTop = interpolate(
      scrollY.value,
      [-50, 0, 50, 300],
      mobileKeyCardTranslateYOutput,
      Extrapolation.CLAMP
    );

    return {
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      borderRadius: CARD_BORDER_RADIUS,
      transform: [
        {
          translateY: withSpring(
            shouldDisplayAsStack ? i * animatedTop : 0,
            {
              damping: 15,
              mass: 0.8,
              stiffness: 100,
              overshootClamping: false,
              restDisplacementThreshold: 0.1,
              restSpeedThreshold: 0.1,
            }
          ),
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
  const getTextColor = (id) => {
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
  const [ethBalance, setEthBalance] = useState('0.00');
  const me:any = useMe()
  console.log("==me==",me);
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (me?.walletInfo?.walletAddress) {
        const balance = await getEthBalance(me.walletInfo.walletAddress);
        setEthBalance(balance);
      }
    };
    
    fetchBalance();
  }, [me?.walletInfo?.walletAddress]);

  const renderValue = (coin) =>{
    if (coin === 'ETH'){
     return ethBalance + ' ' + coin
    }
    else{
     return 0.00
    }
   }

  return (
    <SharedElement id={sharedElementId}>
      <Animated.View style={animatedStyle}>
        <BaseButton style={{ flex: 1 }} onPress={onPress}>
          <Animated.Image style={imageStyle} source={imageSource} resizeMode={'contain'}  />
          {item?.coin_name === 'crypto' &&
          <>
          <View style={{position:"absolute",flexDirection:'column',}}>
          <AppText
          style={{ 
          fontSize:30,
          left:10,
          top:30,
          color: getAmountColor(item.id),
          fontWeight:"bold"
          }}
        >
          {"Crypto"}
        </AppText>
        <AppText
          style={{ 
          fontSize:30,
          left:10,
          top:30,
          color: getAmountColor(item.id),
          fontWeight:"bold",
          paddingTop:90
          }}
        >
          {me?.username}
        </AppText>
          </View>
          
          </>
          }

{item?.coin_name === 'r' &&
          <>
          <View style={{position:"absolute",flexDirection:'column',}}>
          <AppText
          style={{ 
          fontSize:30,
          left:10,
          top:30,
          color: getAmountColor(item.id),
          fontWeight:"bold"
          }}
        >
          {"Realm"}
        </AppText>
        <AppText
          style={{ 
          fontSize:30,
          left:10,
          top:30,
          color: getAmountColor(item.id),
          fontWeight:"bold",
          paddingTop:90
          }}
        >
          {me?.username}
        </AppText>
          </View>
          
          </>
          }
          <View style={{position:"absolute",
          alignSelf:"flex-end",flexDirection:"column-reverse",top:8,alignItems:'center'}}>
          <BoldMonoText
          style={{ 
          fontSize:8,
          right:27,
          color: getAmountColor(item.id),
          }}
        >
          {item?.coin_parts}
        </BoldMonoText>

        <BoldMonoText
          style={{ 
          fontSize:40,
          right:27,
          color: getAmountColor(item.id),
          paddingTop:5
          }}
        >
          {item?.amount}
        </BoldMonoText>
          </View>      
        </BaseButton>
      </Animated.View>
    </SharedElement>
  );
};

export const Card = memo(CardInner);

const imageStyle = {
  // width: 350,
  // height: 180,
  // borderRadius: 15,

  width: CARD_WIDTH + 20,
  height: CARD_HEIGHT - 5,
  borderRadius: 15,
  alignSelf:'center'

};
