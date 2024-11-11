import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { BackButton } from "../../../../components/buttons/buttons";
import { ArenaHeadlineText, BoldMonoText } from "../../../../components/text";
import {
  IS_ANDROID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../constants/utils";
import { useMe } from "../../../../hooks/useMe";

import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import { useChallengeContext } from "../../../../hooks/useChallengeContext";
import WinnersView from "../../components/winners-view";
import BottomButton from "../arena-detail-bottom-button";

export default function ArenaViewFinished() {
  const me = useMe();

  const navigation = useNavigation();

  const { selectChallenge, currentChallenge } = useChallengeContext();

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  if (!currentChallenge) {
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
      <>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
          }}
        >
          <Image
            source={{ uri: currentChallenge.coverImage }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 100 }}
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.4)", "black"]}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              marginTop: -1 * SCREEN_HEIGHT,
            }}
          ></LinearGradient>
        </View>
      </>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: IS_ANDROID ? 40 : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: 50, paddingLeft: 20 }}>
            <BackButton
              customBack={() => {
                selectChallenge(null);
                navigation.goBack();
              }}
            />
          </View>
          <Image
            source={require("../../../../../assets/icon-title.png")}
            style={{ width: 160, height: 35 }}
            contentFit={"contain"}
          />
          <View style={{ width: 50, alignItems: "flex-end", paddingRight: 20 }}>
            <View></View>
          </View>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              height: SCREEN_HEIGHT - 160,
              flex: 1,
            }}
          >
            <ArenaHeadlineText style={{ fontSize: 46, marginVertical: 20 }}>
              {`${currentChallenge.title}`.toUpperCase()}
            </ArenaHeadlineText>

            <View style={{}}>
              <WinnersView challenge={currentChallenge} />
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <BoldMonoText
                  style={{
                    marginTop: 12,
                    textAlign:
                      currentChallenge &&
                      currentChallenge.id == "TyN3ryBlamEAxKXzpXPx"
                        ? "left"
                        : "center",
                    paddingHorizontal: 30,
                  }}
                >
                  {currentChallenge.description}
                </BoldMonoText>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: SCREEN_WIDTH - 40,
          }}
        >
          <BottomButton />
        </View>
      </SafeAreaView>
    </View>
  );
}
