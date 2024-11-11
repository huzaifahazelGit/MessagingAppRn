import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { CompanyProfileScreen } from "../screens/company/company-profile";
import EditCompanyProfileScreen from "../screens/company/edit-company-profile";

const CompanyStack = createNativeStackNavigator();

export default function CompanyNavigator() {
  return (
    <CompanyStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"CompanyProfileScreen"}
    >
      <CompanyStack.Screen
        name="CompanyProfileScreen"
        component={CompanyProfileScreen}
      />
      <CompanyStack.Screen
        name="EditCompanyProfileScreen"
        component={EditCompanyProfileScreen}
      />
    </CompanyStack.Navigator>
  );
}
