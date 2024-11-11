import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import ChatDetailScreen from "../screens/inbox/chat/chat-detail";
import InboxScreen from "../screens/inbox/inbox";
import RoomDetailScreen from "../screens/inbox/rooms/room-detail";
import RoomMetadataScreen from "../screens/inbox/rooms/room-metadata";

const InboxStack = createNativeStackNavigator();

export default function InboxNavigator() {
  return (
    <InboxStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"InboxScreen"}
    >
      <InboxStack.Screen name="InboxScreen" component={InboxScreen} />

      <InboxStack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />

      <InboxStack.Screen name="RoomDetailScreen" component={RoomDetailScreen} />

      <InboxStack.Screen
        name="RoomMetadataScreen"
        component={RoomMetadataScreen}
      />
    </InboxStack.Navigator>
  );
}
