import { Image } from "expo-image";
import React, { useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { IS_ANDROID, SCREEN_HEIGHT } from "../../../constants/utils";
import PointsLeaderboard from "./points-leaderboard";
import XPLeaderboard from "./xp-leaderboard";

export default function LeaderboardContainerScreen() {
  const insets = useSafeAreaInsets();
  const [boardKind, setBoardKind] = useState("xp");

  return (
    <View
      style={{ flex: 1, paddingTop: IS_ANDROID ? insets.top + 40 : insets.top }}
    >
      <Image
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT,
        }}
        source={require("../../../../assets/leader-back.png")}
      ></Image>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackButton buttonColor={"white"} />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 30,
            flex: 1,
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 18,
          }}
        >
          <View
            style={{
              borderTopStartRadius: 18,
              borderBottomStartRadius: 18,
              backgroundColor:
                boardKind == "xp" ? colors.purple : colors.transparent,
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 6,

                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setBoardKind("xp")}
            >
              <BoldMonoText>XP</BoldMonoText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderTopEndRadius: 18,
              borderBottomEndRadius: 18,
              backgroundColor:
                boardKind == "xp" ? colors.transparent : colors.purple,
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 6,

                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setBoardKind("points")}
            >
              <BoldMonoText>ARENA</BoldMonoText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: 50 }}></View>
      </View>

      {boardKind === "xp" ? <XPLeaderboard /> : <PointsLeaderboard />}
    </View>
  );
}
