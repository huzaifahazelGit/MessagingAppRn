import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LeaderboardContainerScreen from "../screens/arena/leaderboard/leaderboard-container";
import CosignsScreen from "../screens/follows-cosigns/cosigns-screen";
import CosignFormScreen from "../screens/follows-cosigns/cosigns-form";

import { MyProfileScreen } from "../screens/profile/profile-wrappers";
import ProfileXPActivityScreen, {
  MyProfileXPActivityScreen,
} from "../screens/profile/screens/profile-xp-activity";
import FollowsContainerScreen from "../screens/follows-cosigns/follows-container-screen";
import WalletCard from "../screens/wallet/src/WalletCard";
import MarketNavigator from "./market-stack";

const MyProfileStack = createNativeStackNavigator();

export default function MyProfileNavigator() {
  return (
    <MyProfileStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName="MyProfileXPActivityScreen">
      <MyProfileStack.Screen
        name="MyProfileXPActivityScreen"
        component={MyProfileXPActivityScreen}
      />

      <MyProfileStack.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
      />

      <MyProfileStack.Screen
        name="FollowsScreen"
        component={FollowsContainerScreen}
      />

      <MyProfileStack.Screen
        name="LeaderboardScreen"
        component={LeaderboardContainerScreen}
      />

      <MyProfileStack.Screen name="CosignsScreen" component={CosignsScreen} />

      <MyProfileStack.Screen
        name="CosignFormScreen"
        component={CosignFormScreen}
      />
      <MyProfileStack.Screen
        name="Wallet"
        component={WalletCard}
      />
      
      <MyProfileStack.Screen name="Market" component={MarketNavigator} />
    </MyProfileStack.Navigator>
  );
}
