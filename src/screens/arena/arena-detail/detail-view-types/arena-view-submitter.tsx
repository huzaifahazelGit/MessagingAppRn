import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "../../../../components/buttons/buttons";
import AvatarList from "../../../../components/lists/avatar-list";
import { BodyText, BoldMonoText } from "../../../../components/text";
import { IS_ANDROID, SCREEN_WIDTH } from "../../../../constants/utils";
import { useChallengeContext } from "../../../../hooks/useChallengeContext";
import { useMe } from "../../../../hooks/useMe";
import ChallengeRequirements from "../../components/challenge-requirements";
import BottomButton from "../arena-detail-bottom-button";
import { Fonts } from "../../../../constants/fonts";
import { colors } from "../../../../constants/colors";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";

export default function ArenaViewAsSubmitter() {
  const me = useMe();
  const navigation = useNavigation();
  const [downloading, setDownloading] = React.useState(false);

  const {
    currentChallenge,
    challengeStatusText,
    selectChallenge,
    myCurrentStatusText,
  } = useChallengeContext();

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

  const downloadAttachment = () => {
    if (currentChallenge && currentChallenge.audioAttachment) {
      setDownloading(true);

      let source = currentChallenge.audioAttachment.src;
      let title = currentChallenge.audioAttachment.title;
      let extOne = source.split(".").pop();

      const path = `${DocumentDirectoryPath}/${title || "audio.mp3"}`;

      let filesPath = `shareddocuments://${path}`;

      console.log("source", source);
      const response = downloadFile({
        fromUrl: source,
        toFile: path,
      });
      response.promise
        .then(async (res) => {
          if (res && res.statusCode === 200 && res.bytesWritten > 0) {
            setDownloading(false);

            Linking.openURL(filesPath);
          } else {
            setDownloading(false);
            console.log("problem?", res);
          }
        })
        .catch((error) => {
          setDownloading(false);
          console.log("error 6");
          console.log(error);
        });
    }
  };

  if (!currentChallenge) {
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
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
          <View style={{ width: 50, paddingRight: 20 }}></View>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{
                    marginTop: 40,
                    width: 150,
                    height: 250,
                    borderRadius: 6,
                    borderColor: "white",
                    borderWidth: 2,
                    marginBottom: 40,
                  }}
                  source={{ uri: currentChallenge.coverImage }}
                  contentFit={"cover"}
                />
                <BoldMonoText style={{ fontSize: 26 }}>
                  {currentChallenge.title}
                </BoldMonoText>
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
              </View>

              <View
                style={{
                  alignItems: "center",
                  marginTop: 15,
                  opacity: 0.5,
                }}
              >
                <BoldMonoText>{challengeStatusText}</BoldMonoText>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <AvatarList
                  avatars={userAvatars}
                  totalCount={
                    currentChallenge
                      ? (currentChallenge.memberIds || []).length
                      : 0
                  }
                />
              </View>

              {!currentChallenge.complete ? (
                <ChallengeRequirements challenge={currentChallenge} />
              ) : (
                <View />
              )}

              {currentChallenge && currentChallenge.audioAttachment && (
                <View>
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 30,
                      opacity: 0.5,
                    }}
                  >
                    <BoldMonoText>{"File Attachment:"}</BoldMonoText>
                  </View>
                  {downloading ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                    >
                      <ActivityIndicator animating />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                      onPress={downloadAttachment}
                    >
                      <BodyText
                        style={{
                          color: colors.blue,
                          textDecorationColor: colors.blue,
                          textDecorationLine: "underline",
                        }}
                      >
                        {currentChallenge.audioAttachment.title}
                      </BodyText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
          {myCurrentStatusText ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.5,
                marginBottom: 12,
              }}
            >
              <BoldMonoText>{myCurrentStatusText}</BoldMonoText>
            </View>
          ) : (
            <View />
          )}
          <BottomButton />
        </View>
      </SafeAreaView>
    </View>
  );
}
