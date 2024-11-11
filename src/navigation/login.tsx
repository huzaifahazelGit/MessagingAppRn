import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LoginScreen from "../screens/login/login";

// import LoginScreen from "../screens/login/login";
// import WalletCard from "../screens/wallet/src/WalletCard";

const LoginStack = createNativeStackNavigator();

export default function LoginNavigator() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
       </LoginStack.Navigator>
  );
}
