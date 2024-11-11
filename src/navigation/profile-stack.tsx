import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LeaderboardContainerScreen from "../screens/arena/leaderboard/leaderboard-container";
import CosignsScreen from "../screens/follows-cosigns/cosigns-screen";
import CosignFormScreen from "../screens/follows-cosigns/cosigns-form";
import { OtherProfileScreen } from "../screens/profile/profile-wrappers";
import ProfileXPActivityScreen from "../screens/profile/screens/profile-xp-activity";
import FollowsContainerScreen from "../screens/follows-cosigns/follows-container-screen";

const ProfileStack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"ProfileScreen"}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        component={OtherProfileScreen}
      />

      <ProfileStack.Screen
        name="FollowsScreen"
        component={FollowsContainerScreen}
      />

      <ProfileStack.Screen
        name="ProfileXPScreen"
        component={ProfileXPActivityScreen}
      />
      <ProfileStack.Screen
        name="LeaderboardScreen"
        component={LeaderboardContainerScreen}
      />

      <ProfileStack.Screen name="CosignsScreen" component={CosignsScreen} />
      <ProfileStack.Screen
        name="CosignFormScreen"
        component={CosignFormScreen}
      />
      
    </ProfileStack.Navigator>
  );
}
