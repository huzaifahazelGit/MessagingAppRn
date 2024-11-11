import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import HomeScreen from "../screens/home/home";
import ChatDetailScreen from "../screens/inbox/chat/chat-detail";
import PostDetail from "../screens/comments/post-detail";
import PlaylistDetail from "../screens/jukebox/playlist-detail-screen";
import MarketNavigator from "./market-stack";
import MainPage from "../screens/weather";
import RAIChatScreen from "../screens/search/rai/rai-chat";
import Contacts from "../screens/contacts";
import ViewProfileScreen from "../screens/ViewProfile";

const HomeStack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"HomeScreen"}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen
        name="HomeChatDetailScreen"
        component={ChatDetailScreen}
      />

      <HomeStack.Screen name="HomePostDetail" component={PostDetail} />

      <HomeStack.Screen name="HomePlaylistDetail" component={PlaylistDetail} />

      <HomeStack.Screen name="Weather" component={MainPage} />
      <HomeStack.Screen name="RAIChatScreen" component={RAIChatScreen} />
      <HomeStack.Screen name="Contacts" component={Contacts} />

      <HomeStack.Screen name="ViewProfile" component={ViewProfileScreen} />
    

      
      

    </HomeStack.Navigator>
  );
}
