import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import MarketScreen from "../screens/marketplace/screens/MarketScreen";

const PostStack = createNativeStackNavigator();

export default function PostNavigator() {
  return (
    <PostStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"MarketScreen"}
    >
      <PostStack.Screen
        name="PosttScreen"
        component={MarketScreen}
      />
    

     
    </PostStack.Navigator>
  );
}
