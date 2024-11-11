import {
  DarkTheme,
  LinkingOptions,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSigninCheck } from "reactfire";
import { XPListener } from "../components/xp-listener";
import { IS_IOS, SCREEN_WIDTH } from "../constants/utils";
import { useMe } from "../hooks/useMe";
import BookmarksScreen from "../screens/bookmarks/bookmarks-screen";
import PostDetail from "../screens/comments/post-detail";
import CreateTabScreen from "../screens/create/create-tab";
import FinishFeedPostForm from "../screens/create/post/finish-post-form";
import PlaylistDetail from "../screens/jukebox/playlist-detail-screen";
import OnboardingChatScreen from "../screens/login/onboarding/onboarding-chat";
import EditProfileScreen from "../screens/profile/screens/edit-profile";
import InviteFriendsScreen from "../screens/share/invite-friends";
import SettingsScreen from "../screens/profile/screens/settings";
import RAIChatScreen from "../screens/search/rai/rai-chat";
import RAIChatListScreen from "../screens/search/rai/rai-list";
import { createLinkFromData } from "../services/link-service";
import { setInitialReferral } from "../services/securestore-service";
import ArenaNavigator from "./arena-stack";
import CompanyNavigator from "./company-stack";
import InboxNavigator from "./inbox-stack";
import LoginNavigator from "./login";
import ProfileNavigator from "./profile-stack";
import SessionNavigator from "./session-stack";
import TabNavigator from "./tabs";
import PremiumUpgradeScreen from "../screens/premium/premium-upgrade-screen";
import SubscriptionsScreen from "../screens/premium/subscriptions-screen";
import { CloudHomeScreen } from "../screens/cloud/cloud-home";
import CloudListScreen from "../screens/cloud/cloud-list-detail";
import ObjectViewerDetail from "../screens/cloud/object-viewer";
import SharePlaylistScreen from "../screens/share/share-playlist-screen";
import { useTrackPlayerContext } from "../hooks/useTrackPlayerContext";
import { useCurrentTrack } from "../hooks/useCurrentTrack";
import { BoldMonoText } from "../components/text";
import JukeboxControls from "../screens/jukebox/jukebox-controls";
import { BW_PROFILE_COLORS } from "../hooks/useProfileColors";
import { colors } from "../constants/colors";
import { BlurView } from "expo-blur";
import { ProfileAddArtistsScreen } from "../screens/profile/profile-add-artists";
import { ProfileViewArtists } from "../screens/profile/profile-view-all-artists";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FolderDetail from "../screens/cloud/folder-detail";
import MarketNavigator from "./market-stack";
import PurchaseDelivery from "../screens/marketplace/screens/PurchaseDelivery";
import ListingPage from "../screens/marketplace/screens/ListingPage";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { status, data: signInCheckResult } = useSigninCheck();
  const me = useMe();

  const { isShowingFloater, setShouldShowFloater, clearCurrentAudio } =
    useTrackPlayerContext();
  const currentTrack = useCurrentTrack();

  const checkLinkForReferral = async (link: string) => {
    console.log("checkLinkForReferral", link);

    if (link && link.includes("referringUserId")) {
      let referrerSplit = link.split("referringUserId=");
      if (referrerSplit.length > 0) {
        let referrer = referrerSplit[1];
        console.log("referrer", referrer);
        if (me && me.id && me.id == referrer) {
          //skip
        } else {
          setInitialReferral(referrer);
          // tara here update user object as referredBy
        }
      }
    }
  };

  if (status === "loading") {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator />
      </View>
    );
  }

  const linking: LinkingOptions<any> = {
    prefixes: [
      "realmapp://",
      "exp://127.0.0.1:19000/--/",
      "exp://192.168.50.146:19000/--/",
      "exp://10.0.1.58:19000/--/",
      "exp://exp.host/@tarawilson/realm/--/",
    ],
    config: {
      screens: {
        Tabs: {
          screens: {
            Discover: {
              initialRouteName: "HomeScreen",
              screens: {
                HomeScreen: {
                  path: "feed/:feedType",
                },
                HomeChatDetailScreen: {
                  path: "chat/:collaborationId",
                },
                HomePostDetail: {
                  path: "post/:postId",
                },
                HomePlaylistDetail: {
                  path: "playlist/:playlistId",
                },
              },
            },

            Arena: {
              initialRouteName: "ArenaListScreen",
              screens: {
                ArenaListScreen: {
                  path: "arena",
                },
                ArenaDetailScreen: {
                  path: "challenge",
                },
              },
            },
          },
        },

        ArenaDetails: {
          screens: {
            ArenaDetailScreen: {
              path: "challenge/:challengeId",
            },
          },
        },
        ProfileStack: {
          screens: {
            ProfileScreen: {
              path: "profile/:userId",
            },
          },
        },
        Inbox: {
          // @ts-ignore
          initialRouteName: "InboxScreen",
          screens: {
            InboxScreen: {
              path: "inbox",
            },

            RoomDetailScreen: {
              path: "room/:roomId",
            },
          },
        },

         // Add new screens for Stripe onboarding
      StripeOnboarding: {
        path: "onboarding",
        screens: {
          Publish: "publish",
          Refresh: "refresh",
        },
      },

        
      },
    },
    async getInitialURL() {
      // tara here android
      if (IS_IOS) {
        const url = await Linking.getInitialURL();

        if (url != null) {
          checkLinkForReferral(url);
          return url;
        }

        const response = await Notifications.getLastNotificationResponseAsync();

        let data = response?.notification.request.content.data;

        if (data && data.activity) {
          try {
            let cleanData = JSON.parse(`${data.activity}`);

            let newLink = createLinkFromData(cleanData);
            if (newLink) {
              return newLink;
            }
          } catch (err) {
            console.log("err", err);
          }
        }
        let newLink = createLinkFromData(data);
        return newLink;
      } else {
        return null;
      }
    },

    subscribe(listener) {
      // tara here android
      if (IS_IOS) {
        const onReceiveURL = ({ url }: { url: string }) => {
          console.log("subscribe", url);
          checkLinkForReferral(url);
          listener(url);
        };

        const eventListenerSubscription = Linking.addEventListener(
          "url",
          onReceiveURL
        );

        const subscription =
          Notifications.addNotificationResponseReceivedListener((response) => {
            let data = response.notification.request.content.data;

            let url: any = response.notification.request.content.data.url;

            checkLinkForReferral(url);

            if (data && data.activity) {
              try {
                let cleanData = JSON.parse(`${data.activity}`);

                let newLink = createLinkFromData(cleanData);
                if (newLink) {
                  url = newLink;
                }
              } catch (err) {
                console.log("err", err);
              }
            } else {
              let newLink = createLinkFromData(data);
              if (newLink) {
                url = newLink;
              }
            }

            listener(url);
          });

        return () => {
          eventListenerSubscription.remove();
          subscription.remove();
        };
      }
    },
  };

  if (signInCheckResult.signedIn === true) {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer theme={DarkTheme} linking={linking}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              fullScreenGestureEnabled: true,
            }}
            initialRouteName="Tabs">
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen name="Sessions" component={SessionNavigator} />
              <Stack.Screen
                name="PremiumUpgradeScreen"
                component={PremiumUpgradeScreen}
              />
              <Stack.Screen
                name="ProfileAddArtistsScreen"
                component={ProfileAddArtistsScreen}
              />
              <Stack.Screen
                name="ProfileViewArtists"
                component={ProfileViewArtists}
              />
            </Stack.Group>

            <Stack.Screen name="Onboarding" component={OnboardingChatScreen} />

            <Stack.Screen name="ArenaDetails" component={ArenaNavigator} />

            <Stack.Screen name="CreateScreen" component={CreateTabScreen} />

            <Stack.Screen
              name="FinishFeedPostForm"
              component={FinishFeedPostForm}
            />

            <Stack.Screen
              name="InviteFriendsScreen"
              component={InviteFriendsScreen}
            />
            <Stack.Screen
              name="SharePlaylistScreen"
              component={SharePlaylistScreen}
            />

            <Stack.Screen name="CloudHomeScreen" component={CloudHomeScreen} />
            <Stack.Screen name="CloudListScreen" component={CloudListScreen} />
            <Stack.Screen name="FolderDetail" component={FolderDetail} />

            <Stack.Screen name="RAIChatScreen" component={RAIChatScreen} />
            <Stack.Screen name="Inbox" component={InboxNavigator} />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen
              name="SubscriptionsScreen"
              component={SubscriptionsScreen}
            />

            <Stack.Screen name="ProfileStack" component={ProfileNavigator} />

            <Stack.Screen name="CompanyStack" component={CompanyNavigator} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
            <Stack.Screen
              name="ObjectViewerDetail"
              component={ObjectViewerDetail}
            />

            <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />

            {/* <Stack.Screen name="PlaylistDetail" component={MarketNavigator} /> */}


            <Stack.Screen name="BookmarksScreen" component={BookmarksScreen} />

            <Stack.Screen name="ListingPage" component={ListingPage} />
          </Stack.Navigator>
        </NavigationContainer>
        <XPListener />
        <View style={{ position: "absolute", bottom: 0, left: 0 }}>
          {isShowingFloater && currentTrack && (
            <View
              style={{
                width: SCREEN_WIDTH,
                marginBottom: 30,
                padding: 12,
              }}>
              <BlurView style={{ borderRadius: 12, overflow: "hidden" }}>
                <View
                  style={{
                    flex: 1,
                    minHeight: 60,
                    paddingHorizontal: 12,
                    paddingTop: 8,
                  }}>
                  <JukeboxControls
                    postOverride={currentTrack}
                    onShare={() => {}}
                    profileColors={BW_PROFILE_COLORS}
                    // playlistId={""}
                    // canEdit={false}
                    // onRemoveFromJukebox={() => {}}
                    asFloater={true}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      opacity: 0.7,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setShouldShowFloater(false);
                        clearCurrentAudio();
                      }}>
                      <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <NavigationContainer theme={DarkTheme}>
        <LoginNavigator />
      </NavigationContainer>
    );
  }
}

export default RootNavigator;
