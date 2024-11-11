import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { BackButton } from "../../../../components/buttons/buttons";
import AvatarList from "../../../../components/lists/avatar-list";
import { EditChallengeModal } from "../../../../components/modals/edit-challenge-modal";
import { ArenaHeadlineText, BodyText } from "../../../../components/text";
import {
  IS_ANDROID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../constants/utils";

import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import { Fonts } from "../../../../constants/fonts";
import { useChallengeContext } from "../../../../hooks/useChallengeContext";
import { ChallengeStats } from "../../components/arena-item-medium";
import ChallengeRequirements from "../../components/challenge-requirements";
import BottomButton from "../arena-detail-bottom-button";
import { colors } from "../../../../constants/colors";

export default function ArenaViewAsOwner() {
  const [showModal, setShowModal] = useState(false);
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

  const userAvatars = useMemo(() => {
    if (!currentChallenge) {
      return [];
    }
    let items = currentChallenge.submissionUserImages || [];
    return items.slice(0, 8);
  }, [currentChallenge]);

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
            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <FontAwesome name="pencil-square-o" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <ArenaHeadlineText
            style={{
              fontSize: 46,
              marginVertical: 20,
              paddingHorizontal: 30,
              textAlign: "center",
            }}
          >
            {`${currentChallenge.title}`.toUpperCase()}
          </ArenaHeadlineText>

          <View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  paddingLeft: 20,
                  justifyContent: "flex-end",
                  paddingBottom: 12,
                }}
              >
                <BodyText
                  style={{ fontFamily: Fonts.MonoSans, marginRight: 10 }}
                >
                  {currentChallenge.description}
                </BodyText>
                {(currentChallenge.tags || []).length > 0 ? (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <BodyText
                      style={{
                        fontFamily: Fonts.MonoSans,
                        marginRight: 10,
                        color: colors.purple,
                      }}
                    >
                      {`#${currentChallenge.tags.join(" #")}`}
                    </BodyText>
                  </View>
                ) : (
                  <View />
                )}
                {userAvatars.length > 0 ? (
                  <View
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <AvatarList
                      avatars={userAvatars.slice(0, 5)}
                      totalCount={(currentChallenge.memberIds || []).length}
                    />
                  </View>
                ) : (
                  <View />
                )}

                {!currentChallenge.complete ? (
                  <View style={{ marginTop: 8 }}>
                    <ChallengeRequirements
                      challenge={currentChallenge}
                      leftSide={true}
                    />
                  </View>
                ) : (
                  <View />
                )}
              </View>
              <ChallengeStats challenge={currentChallenge} />
            </View>

            <View
              style={{
                width: SCREEN_WIDTH - 40,
                marginLeft: 20,
                marginTop: 20,
              }}
            >
              <BottomButton />
            </View>
          </View>
        </View>

        {currentChallenge && (
          <EditChallengeModal
            challenge={currentChallenge}
            onDelete={() => {}}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
