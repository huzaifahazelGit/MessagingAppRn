import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import React, { useMemo } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { BodyText, BoldText } from "../../../components/text";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { Challenge } from "../../../models/challenge";
import { Fonts } from "../../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";

export function ArenaItemSmall({ challenge }: { challenge: Challenge }) {
  const navigation = useNavigation();

  if (!challenge) {
    return <View></View>;
  }

  const challengeIsStarted = useMemo(() => {
    if (challenge.startDate) {
      return moment().isAfter(
        moment(new Date(challenge.startDate.seconds * 1000))
      );
    }
    return false;
  }, [challenge]);

  let imageWidth = SCREEN_WIDTH / 2 - 6;
  return (
    <ImageBackground
      source={{ uri: challenge.coverImage }}
      style={{
        width: imageWidth,
        height: 200,
        borderColor: "black",
        borderWidth: 3,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.5)"]}
        style={{
          width: imageWidth - 2,
          height: 200,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            (navigation as any).navigate("ArenaDetailScreen", {
              challengeId: challenge.id,
            })
          }
          style={{
            justifyContent: "space-between",
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <View style={{ alignItems: "flex-end" }}></View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
            <BodyText style={{ fontFamily: Fonts.MonoSansBold, fontSize: 24 }}>
              {`${challenge.title}`.toUpperCase()}
            </BodyText>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}
