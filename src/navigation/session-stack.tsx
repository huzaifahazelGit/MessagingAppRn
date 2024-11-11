import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import SessionCreate from "../screens/sessions/create/session-create";
import SessionEdit from "../screens/sessions/create/session-edit";
import SessionViewContainer from "../screens/sessions/view/session-view-container";
import StorySeenList from "../screens/sessions/list/seen-list";

const SessionStack = createNativeStackNavigator();

export default function SessionNavigator() {
  return (
    <SessionStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
    >
      <SessionStack.Screen name="SessionCreate" component={SessionCreate} />
      <SessionStack.Screen name="SessionEdit" component={SessionEdit} />
      <SessionStack.Screen
        name="SessionView"
        component={SessionViewContainer}
      />
      <SessionStack.Screen name="StorySeenList" component={StorySeenList} />
    </SessionStack.Navigator>
  );
}
