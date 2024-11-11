import { PlatformPressable } from "@react-navigation/elements";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  LayoutAnimation,
  ListRenderItemInfo,
  PlatformColor,
  StyleSheet,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { CardStackScreenProps } from "../cards-stack";
import { Card } from "../components/card";
import { CardData, data } from "../data";
import AppOverlay from "../../../../components/AppOverlay";
import WalletHeader from "../components/WalletHeader";
import WalletButton from "../components/WalletButton";
import WalletInnerHeader from "../components/WalletInnerHeader";
import { useFocusEffect } from "@react-navigation/native";
import { useMe } from "../../../../hooks/useMe";
import { getEthBalance } from '../utils/walletServices';

export default function CardList({
  navigation,
}: CardStackScreenProps<"CardList">) {
  const flatListRef = useRef<FlatList | null>(null);
  const [cardsData, setCardsData] = useState<Array<CardData>>(data);
  const [shouldDisplayAsStack, setShouldDisplayAsStack] = useState(true);
  const scrollY = useSharedValue(0);
  const me:any = useMe()
  const [ethBalance, setEthBalance] = useState('0.00');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <PlatformPressable
            onPress={() =>
              setShouldDisplayAsStack((prev) => {
                if (prev === false) {
                  flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                  });
                }
                return !prev;
              })
            }>
            <Image
              style={{
                width: 25,
                height: 27,
                tintColor: PlatformColor("systemBlue"),
              }}
              source={require("../../assets/wallet-icon.png")}
            />
          </PlatformPressable>
        );
      },
    });
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onCardPress = useCallback(
    (item: CardData, index: number) => () => {
      const isLastItem = cardsData.length - 1 === index;

      // pressed card is the last item, navigate to the card detail
      
      // console.log("--item--",item);
      // console.log("--isLastItem--",isLastItem);
      
      if (isLastItem) {
        navigation.navigate("CardDetail", {
          item,
        });
        
        // switch (item?.coin_name ) {
        //   case 'usd':
        //     navigation.navigate("usd_detail", {
        //         item,
        //       });
        //   case 'nfts':
        //     navigation.navigate("nfts_detail", {
        //       item,
        //     });
        //   case 'r':
        //     navigation.navigate("r_detail", {
        //       item,
        //     });
        //   case 'crypto':
        //     navigation.navigate("crypto_detail", {
        //       item,
        //     });
        //   default:
        //     return 'black'; // Default color
        // }    
          }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setCardsData((prev) => [
        ...prev.filter((prevData) => prevData.id !== item.id),
        item,
      ]);
    },
    []
  );

  const renderListItem = ({ item, index }: ListRenderItemInfo<CardData>) => {
    return (
      <Card
        scrollY={scrollY}
        imageSource={item.image}
        index={index}
        onPress={onCardPress(item, index)}
        shouldDisplayAsStack={shouldDisplayAsStack}
        sharedElementId={item.id}
        item={item}
      />
    );
  };

  const renderListItemSeparator = () => <View style={styles.separator} />;

  useEffect(() => {
    const fetchBalance = async () => {
      if (me?.walletInfo?.walletAddress) {
        const balance = await getEthBalance(me.walletInfo.walletAddress);
        setEthBalance(balance);
      }
    };
    
    fetchBalance();
  }, [me?.walletInfo?.walletAddress]);


  return (
    <ImageBackground
      source={require("../../../../../assets/profile_pic.png")}
      style={{ flex: 1 }}>
      <AppOverlay />
      <WalletHeader
        title='TRACK LIST'
        icon='keyboard-arrow-down'
        image={require("../../../../../assets/avatar.png")}
      />

      <View
        style={styles.walletContainer}>
        <WalletInnerHeader title="Wallet" image={require("../../../../screens/wallet/assets/plus_circle.png")} onPressImage={()=>navigation?.navigate("Wallet")}  />

        <View style={{ flex: 3, }}>
          <Animated.FlatList
            ref={flatListRef}
            bounces
            bouncesZoom
            scrollEventThrottle={16}
            data={cardsData}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderListItemSeparator}
            contentContainerStyle={styles.contentContainer}
            keyExtractor={(item) => item.id}
            onScroll={scrollHandler}
            renderItem={renderListItem}
          />
          <View style={styles.btnView}>
          <WalletButton title='Add' onPress={() => navigation.navigate("Bank",{type:"add"})}
          btnFillUp={false}
        
          />
          <WalletButton
            title='Withdraw'
            onPress={() => navigation.navigate("Bank",{type:"withdraw"})} 
            btnFillUp={false}
          />
        </View>
        </View>

       
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderRadius: 30,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  separator: {
    paddingVertical: 5,
  },
  btnView: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 100,
  },
  walletContainer:{
    flex: 1,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop: 5,
  }
});
