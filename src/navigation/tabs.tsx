import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileImage from "../components/images/profile-image";
import { colors } from "../constants/colors";
import { IS_IOS, PREMIUM_IS_TURNED_ON, SCREEN_WIDTH } from "../constants/utils";
import { useMe } from "../hooks/useMe";
// import ArenaListScreen from "../screens/arena/arena-list";
import HomeNavigator from "./home-stack";
import MyProfileNavigator from "./my-profile-stack";
import SearchScreen from "../screens/search/search";
import * as ScreenOrientation from "expo-screen-orientation";
import { useOrientation } from "../hooks/useOrientation";
import ArenaFullListScreen from "../screens/arena/arena-full-list";
import ArenaNavigator from "./arena-stack";
import {
  setAllCompanies,
  setAllPlaylists,
  updateAllXp,
} from "../store/general-data-store";
import {
  query,
  collection,
  getFirestore,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  updateDoc,
} from "firebase/firestore";
import { SocialStore } from "../store/follows-collabs-store";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import MarketNavigator from "./market-stack";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import InboxNavigator from "./inbox-stack";
import ProfileNavigator from "./profile-stack";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const me = useMe();
  const [didSetUpPayments, setDidSetUpPayments] = React.useState(false);

  useEffect(() => {
    if (!didSetUpPayments && me.id) {
      setDidSetUpPayments(true);
      if (PREMIUM_IS_TURNED_ON || me.isAdmin) {
        startPayments(me.id);
      }
    }
  }, [me?.id, didSetUpPayments, PREMIUM_IS_TURNED_ON]);

  const startPayments = async (userId) => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (IS_IOS) {
      Purchases.configure({ apiKey: "appl_aezXCSSWwMwlWaABPelTRtZlDmi" });
    } else {
      Purchases.configure({ apiKey: "goog_akkKddVjdBefahzgjvQhLqBdSQZ" });
    }

    const { customerInfo, created } = await Purchases.logIn(userId);
    console.log("customerInfo", customerInfo);
    console.log("created", created);
  };

  useEffect(() => {
    if (me && me.id && me.username) {
      const userRef = doc(getFirestore(), "users", me.id);

      if ((me.loginStreak ?? 0) == 0) {
        updateDoc(userRef, {
          lastActive: new Date(),
          loginStreak: 1,
        });
      } else {
        updateDoc(userRef, {
          lastActive: new Date(),
        });
      }

      Notifications.setBadgeCountAsync(0);
      fetchFollows();
      fetchPlaylistsAndCompanies();
    }
  }, [me?.id]);

  const fetchFollows = async () => {
    let q = query(
      collection(getFirestore(), "follows"),
      where("fromUserId", "==", me.id),
      limit(40)
    );

    const snapshot = await getDocs(q);

    let items = [];
    snapshot.forEach((child) => {
      items.push({ ...child.data(), id: child.id });
    });
    SocialStore.update((s) => {
      s.follows = items;
    });
  };

  const fetchPlaylistsAndCompanies = async () => {
    const cRef = query(
      collection(getFirestore(), "companies"),
      where("adminIds", "array-contains", me.id)
    );
    let cSnapshot = await getDocs(cRef);
    let companies: any[] = [];
    cSnapshot.forEach((item) => {
      companies.push({ ...item.data(), id: item.id });
    });
    setAllCompanies(companies);

    const pref = query(
      collection(getFirestore(), "playlists"),
      where("ownerId", "==", me.id)
    );
    let snapshot = await getDocs(pref);
    let playlists: any[] = [];
    snapshot.forEach((item) => {
      playlists.push({ ...item.data(), id: item.id });
    });

    let promises = [];
    companies.forEach((company) => {
      promises.push(
        getDocs(
          query(
            collection(getFirestore(), "playlists"),
            where("ownerId", "==", company.id)
          )
        )
      );
    });

    let results = await Promise.all(promises);
    results.forEach((snap) => {
      snap.forEach((item) => {
        playlists.push({ ...item.data(), id: item.id });
      });
    });

    setAllPlaylists(playlists);

    let snap = await getDoc(doc(getFirestore(), "stats", "general"));
    updateAllXp(snap.data() as any);
  };

  function MyTabBar({ state, descriptors, navigation }) {
    const orientation = useOrientation();

    const lockPortrait = async () => {
      console.log("lockPortrait");
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };

    const unlockOrientation = async () => {
      console.log("unlockOrientation");
      await ScreenOrientation.unlockAsync();
    };

    if (orientation != ScreenOrientation.Orientation.PORTRAIT_UP) {
      return <View />;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.darkblack,
          paddingBottom: 12,
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const focused = state.index === index;

          const onPressWithLock = async () => {
            await lockPortrait();
            onPress();
          };

          const onPressWithUnlock = async () => {
            await unlockOrientation();
            onPress();
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          let size = 24;
          let color = focused ? colors.blue : colors.softWhite;

          if (route.name == "MyProfile") {
            return (
              <View
                key={"profile-special"}
                style={{
                  width: SCREEN_WIDTH / 5,
                  height: 58,

                  flexDirection: "row",
                }}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPressWithUnlock}
                  style={{
                    flex: 1,
                    width: SCREEN_WIDTH / 5,

                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      width: 33,
                      height: 33,
                      borderRadius: 33 / 2,
                      borderWidth: 3,
                      borderColor: color,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {me && me.profilePicture ? (
                      <ProfileImage user={me} size={30} />
                    ) : (
                      <MaterialCommunityIcons
                        name="account"
                        size={24}
                        color={color}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          if (route.name == "Search") {
            return (
              <View
                key={"search-special"}
                style={{
                  width: (SCREEN_WIDTH / 5) * 2,
                  height: 58,

                  flexDirection: "row",
                }}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={async () => {
                    await lockPortrait();
                    navigation.navigate("CreateScreen");
                  }}
                  style={{
                    flex: 1,

                    width: SCREEN_WIDTH / 5,

                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <MaterialCommunityIcons
                    // name={focused ? "plus-circle" : "plus-circle-outline"}
                    name={"plus-circle-outline"}
                    size={size + 4}
                    // color={color}
                    color={colors.softWhite}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={focused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPressWithLock}
                  style={{
                    flex: 1,
                    width: SCREEN_WIDTH / 5,

                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Ionicons
                    name={focused ? "search" : "search"}
                    size={size + 2}
                    color={color}
                  />
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <View
              key={route.name}
              style={{
                width: SCREEN_WIDTH / 5,

                height: 58,
              }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={
                  route.name === "Arena" ? onPressWithUnlock : onPressWithLock
                }
                style={{
                  flex: 1,
                  height: 58,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                {route.name === "Discover" ? (
                  <MaterialCommunityIcons
                    name={focused ? "home" : "home-outline"}
                    size={size + 3}
                    color={color}
                  />
                ) : route.name === "Arena" ? (
                  <MaterialCommunityIcons
                    name="bow-arrow"
                    size={size + 2}
                    color={color}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        fullScreenGestureEnabled: true,
        tabBarStyle: { 
          position: "absolute",
        }
      })}
      tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Discover" component={HomeNavigator} />
      <Tab.Screen name="Arena" component={InboxNavigator} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="MyProfile" component={MyProfileNavigator} />
      {/* <Tab.Screen name="InboxScreen" component={InboxScreen} /> */}


     

      
    </Tab.Navigator>
  );
}
