import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Popover from "react-native-popover-view";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { IS_ANDROID } from "../../../constants/utils";

export default function FeedNav({
  kind,
  setKind,
}: {
  kind: "EXPLORE" | "FOLLOWING" | "MARKETPLACE";
  setKind: any;
}) {
  const me = useMe();
  const navigation = useNavigation();

  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    moment.updateLocale("en", {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "1m",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        M: "%d month",
        MM: "%d months",
        y: "%dy",
        yy: "%dy",
      },
    });
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => savePushToken(token));
  }, []);

  const savePushToken = async (token) => {
    if (me && me.id && token) {
      const userRef = doc(getFirestore(), "users", me.id);
      await updateDoc(userRef, {
        pushToken: token,
      });
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@tara-wilson/realm",
        })
      ).data;
    }

    if (IS_ANDROID) {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
          paddingHorizontal: 20,
        }}>
        <Popover
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          popoverStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          from={
            <TouchableOpacity
              onPress={() => setShowPopover(true)}
              style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../../assets/icon-title.png")}
                style={{ width: 160, height: 35 }}
                contentFit={"contain"}
              />
              <AntDesign name="down" size={15} color="white" />
            </TouchableOpacity>
          }>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 8,
                width: 160,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 12,
                borderRadius: 18,
                marginBottom: 6,
              }}
              onPress={() => {
                setKind("EXPLORE");
                setShowPopover(false);
              }}>
              <BodyText style={{ color: "black" }}>EXPLORE</BodyText>
              {kind == "EXPLORE" && (
                <Feather name="check" size={16} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 8,
                width: 160,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 12,
                borderRadius: 18,
                marginBottom: 6,
              }}
              onPress={() => {
                setKind("FOLLOWING");
                setShowPopover(false);
              }}>
              <BodyText style={{ color: "black" }}>FOLLOWING</BodyText>
              {kind == "FOLLOWING" && (
                <Feather name="check" size={16} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 8,
                width: 160,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 12,
                borderRadius: 18,
                marginBottom: 6,
              }}
              onPress={() => {
                setKind("MARKETPLACE");
                setShowPopover(false);
              }}>
              <BodyText style={{ color: "black" }}>MARKETPLACE FEED</BodyText>
              {kind == "MARKETPLACE" && (
                <Feather name="check" size={16} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </Popover>

        <View style={{ flexDirection: "row" }}>
          {/* <TouchableOpacity
            onPress={() => {
              (navigation as any).navigate("BookmarksScreen");
            }}
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginRight: 4,
            }}
          >
            <Feather name="bookmark" size={24} color="white" />
          </TouchableOpacity> */}

          {kind == "MARKETPLACE" ? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}>
              {/* <Image
                source={require("../../marketplace/assets/message.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  position: "relative",
                  right: 20,
                }}
              />
              <Image
                source={require("../../marketplace/assets/search.png")}
                style={{ width: 25, height: 25, resizeMode: "contain" }}
              /> */}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("Inbox");
              }}
              style={{ justifyContent: "center", flexDirection: "row" }}>
              <Feather name="message-square" size={24} color="white" />
              {me &&
                ((me.unreadChatCount || 0) > 0 ||
                  (me.unreadActivityCount || 0) > 0) && (
                  <View
                    style={{
                      marginLeft: -8,
                      width: 12,
                      height: 12,
                      borderRadius: 12 / 2,
                      backgroundColor: colors.blue,
                    }}></View>
                )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
