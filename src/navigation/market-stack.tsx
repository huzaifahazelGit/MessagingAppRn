import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import MarketScreen from "../screens/marketplace/screens/MarketScreen";
import DownloadDigital from "../screens/marketplace/screens/DownloadDigital";
import MessageSeller from "../screens/marketplace/screens/MessageSeller";
import SellerProfile from "../screens/marketplace/screens/SellerProfile";
import ApproveDelivery from "../screens/marketplace/screens/ApproveDelivery";
import CoinNotification from "../screens/marketplace/screens/CoinNotification";
import PurchaseDelivery from "../screens/marketplace/screens/PurchaseDelivery";
import CompleteApprove from "../screens/marketplace/screens/CompleteApprove";
import EditListing from "../screens/marketplace/screens/EditListing";
import SoldMarket from "../screens/marketplace/screens/SoldMarket";
import NewListing from "../screens/marketplace/screens/NewListing";
import Location_Post from "../screens/marketplace/screens/Location_Post";
import PostPublish from "../screens/marketplace/screens/PostPublish";
import BuyScreen from "../screens/marketplace/screens/BuyScreen";
import InboxNavigator from "./inbox-stack";
import MessageThread from "../screens/marketplace/screens/MessageThread";
import MarketSearchScreen from "../screens/marketplace/screens/MarketSearchScreen";
import PurchaseHistory from "../screens/marketplace/screens/PurchaseHistory";
import SellerHistory from "../screens/marketplace/screens/SellerHistory";
import OrderDetailsScreen from "../screens/marketplace/screens/OrderDetailsScreen";
import RefreshScreen from "../screens/marketplace/screens/RefreshScreen";
import PublishScreen from "../screens/marketplace/screens/PublishScreen";
import PaymentScreen from "../screens/marketplace/screens/PaymentScreen";
import ListingPage from '../screens/marketplace/screens/ListingPage/index';
import SellerEarningsScreen from '../screens/marketplace/screens/SellerEarningsScreen';
import PayoutHistory from '../screens/marketplace/screens/PayoutHistory';

const MarketStack = createNativeStackNavigator();

export default function MarketNavigator() {
  return (
    <MarketStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"MarketScreen"}
    
    >
      <MarketStack.Screen
        name="MarketScreen"
        component={MarketScreen}
      />
       <MarketStack.Screen
        name="ListingPage"
        component={ListingPage}
      />
        <MarketStack.Screen
        name="DownloadDigital"
        component={DownloadDigital}
      />
        <MarketStack.Screen
        name="MessageSeller"
        component={MessageSeller}
      />
         <MarketStack.Screen
        name="SellerProfile"
        component={SellerProfile}
      />
         <MarketStack.Screen
        name="PurchaseDelivery"
        component={PurchaseDelivery}
      />
        <MarketStack.Screen
        name="ApproveDelivery"
        component={ApproveDelivery}
      />
        <MarketStack.Screen
        name="CoinNotification"
        component={CoinNotification}
      />
         <MarketStack.Screen
        name="CompleteApprove"
        component={CompleteApprove}
      />

      <MarketStack.Screen
        name="EditListing"
        component={EditListing}
      />
       <MarketStack.Screen
        name="SoldMarket"
        component={SoldMarket}
      />
       <MarketStack.Screen
        name="NewListing"
        component={NewListing}
      />
          <MarketStack.Screen
        name="Location_Post"
        component={Location_Post}
      />
        <MarketStack.Screen
        name="PostPublish"
        component={PostPublish}
      />
        <MarketStack.Screen
        name="BuyNow"
        component={BuyScreen}
      />
      <MarketStack.Screen name="Inbox" component={InboxNavigator} />
      <MarketStack.Screen name="MessageThread" component={MessageThread} />

      <MarketStack.Screen name="MarketSearchScreen" component={MarketSearchScreen} />
      <MarketStack.Screen name="PurchaseHistory" component={PurchaseHistory} />
      <MarketStack.Screen name="SellerHistory" component={SellerHistory} />
      <MarketStack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <MarketStack.Screen name="SellerEarningsScreen" component={SellerEarningsScreen} />
      
      
      
      <MarketStack.Screen
  name="Refresh"
  component={RefreshScreen} // Create a nested navigator if needed
/>

<MarketStack.Screen
  name="Publish"
  component={PublishScreen}
/>

<MarketStack.Screen
  name="PaymentScreen"
  component={PaymentScreen}
/>

<MarketStack.Screen
  name="PayoutHistory"
  component={PayoutHistory}
/>
     
    </MarketStack.Navigator>
  );
}
