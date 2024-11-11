import { NavigationContainer } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { Platform } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { CardData } from "./data";
import  CardDetail from "./screens/card-detail";
import CardList from "./screens/card-list";
import Bank from './screens/bank';
import { Nfts_innerDetailCard } from "./screens/nfts_innerDetailCard";
import Wallet from "./Wallet";
import WalletHistory from "./WalletHistory";
// import { usd_detail } from "./screens/usd_detail";
// import { nfts_detail } from "./screens/nfts_detail";
// import { r_detail } from "./screens/r_detail";
// import { crypto_detail } from "./screens/crypto_detail";

type CardStackParamList = {
  CardList: undefined;
  CardDetail: { item: CardData };
  Bank:{item: CardData}
  usd_detail:{item: CardData}
  nfts_detail:{item: CardData},
  r_detail:{item: CardData},
  crypto_detail:{item: CardData}
};

export type CardStackScreenProps<
  RouteName extends keyof CardStackParamList
> = StackScreenProps<CardStackParamList, RouteName>;

const SharedElementStack =
  createSharedElementStackNavigator<CardStackParamList>();

export default function CardsStack() {
  return (
      <SharedElementStack.Navigator initialRouteName="CardList"
      screenOptions={{
        
      }}
      
      >
        <SharedElementStack.Screen
          name="CardList"
          component={CardList}
          options={{
            gestureEnabled: false,
            headerLeftContainerStyle: {
              paddingLeft: 12,
            },
            headerRightContainerStyle: {
              paddingRight: 12,
            },
            headerTitle: "My Wallet",
            headerShown:false,
            keyboardHandlingEnabled:true
          }}
        />
        <SharedElementStack.Screen
          name="CardDetail"
          component={CardDetail}
          options={{
            headerTitle: "Card Detail",
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
          sharedElements={(route, otherRoute, _showing) => {
            const { item } = route.params;
            // console.log("--item--",item);
            // we want to execute shared element transition only in iOS
            // and when transitioning from card list screen
            if (
              otherRoute.name === "CardList" &&
              Platform.OS === "ios"
            ) {
              return [
                {
                  id: item.id,
          
                },
              ];
            }
          }}
        />
         <SharedElementStack.Screen
          name="Bank"
          component={Bank}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />
          <SharedElementStack.Screen
          name="NftsCardInnerDetail"
          component={Nfts_innerDetailCard}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />

        <SharedElementStack.Screen
          name="Wallet"
          component={Wallet}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />
         <SharedElementStack.Screen
          name="WalletHistory"
          component={WalletHistory}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />
         {/* <SharedElementStack.Screen
          name="usd_detail"
          component={usd_detail}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
          sharedElements={(route, otherRoute, _showing) => {
            const { item } = route.params;

            // we want to execute shared element transition only in iOS
            // and when transitioning from card list screen
            if (
              otherRoute.name === "CardList" &&
              Platform.OS === "ios"
            ) {
              return [
                {
                  id: item.id,
                },
              ];
            }
          }}
          
        />
          <SharedElementStack.Screen
          name="nfts_detail"
          component={nfts_detail}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />
         <SharedElementStack.Screen
          name="r_detail"
          component={r_detail}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        />
          <SharedElementStack.Screen
          name="crypto_detail"
          component={crypto_detail}
          options={{
            cardStyle: {
              backgroundColor: "#EFEFF4",
            },
            headerShown:false
          }}
        /> */}
        {/* <SharedElementStack.Screen
          name="Bank"
          component={Bank}
          options={{
            gestureEnabled: false,
            headerLeftContainerStyle: {
              paddingLeft: 12,
            },
            headerRightContainerStyle: {
              paddingRight: 12,
            },
            // headerTitle: "My Wallet",
            headerShown:false
          }}
        /> */}
      </SharedElementStack.Navigator>
  );
}
