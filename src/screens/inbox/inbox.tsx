import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView, View } from "react-native";
import NavBar from "../../components/navbar";
import { TopTabBar } from "../../components/top-tab-bar";
import { colors } from "../../constants/colors";
import { IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import MessagesList from "./chat/messages-list";
import NotificationsList from "./notifications/notifications";
import * as Notifications from "expo-notifications";
import MarketMessagesList from "./chat/MarketMessagesList";
const Tab = createMaterialTopTabNavigator();

export default function InboxScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // const { } = (route.params as any);
  const me = useMe();

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
    Notifications.setBadgeCountAsync(0);
  }, []);

  let dotIndexes = useMemo(() => {
    console.log("me", me.unreadActivityCount);
    let indexes = [];
    if (me && me.unreadActivityCount > 0) {
      indexes.push(0);
    }
    if (me && me.unreadChatCount > 0) {
      indexes.push(1);
    }
    if (me && me.unreadRoomChatCount > 0) {
      indexes.push(2);
    }
    return indexes;
  }, [me.unreadActivityCount, me.unreadChatCount]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <NavBar title={"Inbox"} includeBack={true} skipTitle={true} />

      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Tab.Navigator
          tabBar={(props) => (
            <TopTabBar
              buttonColor={colors.blue}
              {...props}
              containerStyle={{ borderBottomWidth: 0 }}
              textColor={colors.white}
              itemStyle={{
                width: SCREEN_WIDTH / 2 - 90,
              }}
              textStyle={{ fontSize: 14 }}
              dotIndexes={dotIndexes}
            />
          )}
          initialRouteName={"MESSAGES"}
          screenOptions={{
            tabBarPressOpacity: 1,
            tabBarStyle: { backgroundColor: colors.black },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name={"NOTIFICATIONS"}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <NotificationsList />
              </View>
            )}
          />

          <Tab.Screen
            name={"MESSAGES"}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <MessagesList />
              </View>
            )}
          />

           {/* <Tab.Screen
            name={"MARKETPLACE"}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <MarketMessagesList />
              </View>
            )}
          /> */}

        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}
