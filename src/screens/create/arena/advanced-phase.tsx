import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Switch, TextInput, View } from "react-native";
import { BodyText } from "../../../components/text";
import TagsWrapper from "../../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { Challenge } from "../../../models/challenge";

export const AdvancedPhase = ({
  challenge,
  setChallenge,
}: {
  challenge: Challenge;
  setChallenge: any;
}) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 12 }}>
          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingVertical: 12,
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                Number of Winners
              </BodyText>
              <TextInput
                style={[
                  {
                    fontFamily: Fonts.Regular,
                    textAlign: "right",
                    color: "white",
                    paddingHorizontal: 4,
                    width: 60,
                  },
                ]}
                onBlur={() => {
                  if (isNaN(parseInt(`${challenge.numWinners}`))) {
                    setChallenge({
                      ...challenge,
                      numWinners: parseInt(`${challenge.numWinners}`),
                    });
                  } else {
                    setChallenge({
                      ...challenge,
                      numWinners: 1,
                    });
                  }
                }}
                placeholderTextColor={colors.white}
                cursorColor={"white"}
                keyboardType="number-pad"
                value={`${challenge.numWinners}`}
                onChangeText={(item) =>
                  setChallenge({
                    ...challenge,
                    numWinners: item,
                  })
                }
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingVertical: 12,
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                Maximum Submissions per user
              </BodyText>
              <TextInput
                style={[
                  {
                    fontFamily: Fonts.Regular,
                    textAlign: "right",
                    color: "white",
                    paddingHorizontal: 4,
                    width: 60,
                  },
                ]}
                onBlur={() => {
                  if (isNaN(parseInt(`${challenge.maxSubmissions}`))) {
                    setChallenge({
                      ...challenge,
                      maxSubmissions: parseInt(`${challenge.maxSubmissions}`),
                    });
                  } else {
                    setChallenge({
                      ...challenge,
                      maxSubmissions: 1,
                    });
                  }
                }}
                placeholderTextColor={colors.white}
                cursorColor={"white"}
                keyboardType="number-pad"
                value={`${challenge.maxSubmissions}`}
                onChangeText={(item) =>
                  setChallenge({
                    ...challenge,
                    maxSubmissions: item,
                  })
                }
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingVertical: 12,
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                XP Awarded to Winners
              </BodyText>
              <TextInput
                style={[
                  {
                    fontFamily: Fonts.Regular,
                    textAlign: "right",
                    color: "white",
                    paddingHorizontal: 4,
                    width: 60,
                  },
                ]}
                onBlur={() => {
                  if (isNaN(parseInt(`${challenge.xpRewarded}`))) {
                    setChallenge({
                      ...challenge,
                      xpRewarded: parseInt(`${challenge.xpRewarded}`),
                    });
                  } else {
                    setChallenge({
                      ...challenge,
                      xpRewarded: 1,
                    });
                  }
                }}
                placeholderTextColor={colors.white}
                cursorColor={"white"}
                keyboardType="number-pad"
                value={`${challenge.xpRewarded}`}
                onChangeText={(item) =>
                  setChallenge({
                    ...challenge,
                    xpRewarded: item,
                  })
                }
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingTop: 9,
                paddingBottom: 4,
                alignItems: "center",
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14, marginTop: -4 }}>
                Featured Challenge
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setChallenge({
                      ...challenge,
                      featured: !challenge.featured,
                    });
                  }}
                  value={challenge.featured}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View>
          {/* <View style={{ paddingHorizontal: 8 }}>
            <TagsWrapper
              tags={challenge.tags}
              setTags={(item) =>
                setChallenge({
                  ...challenge,
                  tags: item,
                })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingVertical: 9,
                }}
              >
                <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                  Add Tags
                </BodyText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {challenge.tags.length > 0 ? (
                    <BodyText style={{ fontSize: 14, color: colors.purple }}>
                      {`#${challenge.tags.join(" #")}`}
                    </BodyText>
                  ) : (
                    <View />
                  )}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </View>
              </View>
            </TagsWrapper>
          </View> */}
          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingTop: 9,
                paddingBottom: 4,
                alignItems: "center",
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14, marginTop: -4 }}>
                Voting Enabled
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setChallenge({
                      ...challenge,
                      allowsVoting: !challenge.allowsVoting,
                    });
                  }}
                  value={challenge.allowsVoting}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingTop: 9,
                paddingBottom: 4,
                alignItems: "center",
              }}
            >
              <BodyText style={{ marginLeft: 4, fontSize: 14, marginTop: -4 }}>
                Link & Video Submissions Enabled
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setChallenge({
                      ...challenge,
                      allowsVideo: !challenge.allowsVideo,
                    });
                  }}
                  value={challenge.allowsVideo}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
