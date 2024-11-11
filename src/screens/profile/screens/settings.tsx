import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Switch, View } from "react-native";
import NavBar from "../../../components/navbar";
import { BodyText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";

export default function SettingsScreen() {
  const me = useMe();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [notifyFollow, setNotifyFollow] = useState(true);
  const [notifyLikeComment, setNotifyLikeComment] = useState(true);
  const [notifyTag, setNotifyTag] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyMarket, setNotifyMarket] = useState(true);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    if (me) {
      if (me.skipNotifyFollow) {
        setNotifyFollow(false);
      }
      if (me.skipNotifyLikeComment) {
        setNotifyLikeComment(false);
      }
      if (me.skipNotifyTag) {
        setNotifyTag(false);
      }
      if (me.skipNotifyDaily) {
        setNotifyDaily(false);
      }
      if (me.skipNotifyMarket) {
        setNotifyMarket(false);
      }
    }
  }, []);

  const submit = async () => {
    setLoading(true);
    const userRef = doc(getFirestore(), "users", me.id);
    updateDoc(userRef, {
      skipNotifyFollow: !notifyFollow,
      skipNotifyLikeComment: !notifyLikeComment,
      skipNotifyTag: !notifyTag,
      skipNotifyDaily: !notifyDaily,
      skipNotifyMarket: !notifyMarket,
      lastActive: new Date(),
    });

    setLoading(false);

    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <NavBar title={"Settings"} includeBack={true} customBack={submit} />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <BoldText>Notify me about:</BoldText>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <BodyText style={{ opacity: 0.8 }}>New Followers</BodyText>
            <Switch
              trackColor={{ false: "#767577", true: colors.blue }}
              thumbColor={colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setNotifyFollow(!notifyFollow);
              }}
              value={notifyFollow}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <BodyText style={{ opacity: 0.8 }}>Post Likes & Comments</BodyText>
            <Switch
              trackColor={{ false: "#767577", true: colors.blue }}
              thumbColor={colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setNotifyLikeComment(!notifyLikeComment);
              }}
              value={notifyLikeComment}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <BodyText style={{ opacity: 0.8 }}>Tags & Mentions</BodyText>
            <Switch
              trackColor={{ false: "#767577", true: colors.blue }}
              thumbColor={colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setNotifyTag(!notifyTag);
              }}
              value={notifyTag}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <BodyText style={{ opacity: 0.8 }}>Daily Challenges</BodyText>
            <Switch
              trackColor={{ false: "#767577", true: colors.blue }}
              thumbColor={colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setNotifyDaily(!notifyDaily);
              }}
              value={notifyDaily}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              opacity: 0.5,
            }}
          >
            <BodyText style={{ opacity: 0.8 }}>
              Marketplace Posts (coming soon)
            </BodyText>
            <Switch
              trackColor={{ false: "#767577", true: colors.blue }}
              thumbColor={colors.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {}}
              value={false}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
