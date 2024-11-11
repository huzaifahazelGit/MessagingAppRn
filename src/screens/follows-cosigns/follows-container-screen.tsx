import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import NavBar from "../../components/navbar";
import { TopTabBar } from "../../components/top-tab-bar";
import { colors } from "../../constants/colors";
import { IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import MutualsList from "./follows/mutuals";
import FollowersList from "./follows/followers";
import FollowingList from "./follows/following";
import { useProfileColors } from "../../hooks/useProfileColors";
const Tab = createMaterialTopTabNavigator();

export default function FollowsContainerScreen() {
  const me = useMe();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [user, setUser] = useState(null);
  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const route = useRoute();
  let params = route.params as any;
  let userId = params.userId;

  useEffect(() => {
    setUser(JSON.parse(params.user));
  }, []);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  if (!user) {
    return <View />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <NavBar
        title={"Inbox"}
        includeBack={true}
        skipTitle={true}
        buttonColor={buttonColor}
      />

      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Tab.Navigator
          tabBar={(props) => (
            <TopTabBar
              buttonColor={buttonColor}
              {...props}
              containerStyle={{ borderBottomWidth: 0, marginBottom: 10 }}
              textColor={textColor}
              itemStyle={{
                width: SCREEN_WIDTH / 3 - 30,
              }}
              textStyle={{ fontSize: 14, paddingHorizontal: 0 }}
              dotIndexes={[]}
            />
          )}
          initialRouteName={"MUTUAL"}
          screenOptions={{
            tabBarPressOpacity: 1,
            tabBarStyle: { backgroundColor: colors.black },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name={"MUTUAL"}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <MutualsList
                  userId={userId}
                  user={user}
                  followers={followers}
                  following={following}
                />
              </View>
            )}
          />

          <Tab.Screen
            // name={`FOLLOWERS (${user.followersCount || 0})`}
            name={`FOLLOWERS`}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <FollowersList
                  userId={userId}
                  user={user}
                  followers={followers}
                  setFollowers={setFollowers}
                />
              </View>
            )}
          />

          <Tab.Screen
            // name={`FOLLOWING (${user.followingCount || 0})`}
            name={`FOLLOWING`}
            children={() => (
              <View style={{ flex: 1, backgroundColor: colors.black }}>
                <FollowingList
                  userId={userId}
                  user={user}
                  following={following}
                  setFollowing={setFollowing}
                />
              </View>
            )}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}
