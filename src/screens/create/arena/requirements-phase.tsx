import React from "react";
import { ScrollView, Switch, View } from "react-native";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { TextInput } from "react-native";
import { Fonts } from "../../../constants/fonts";

export const ArenaRequirementsPhase = ({
  profileRequirements,
  setProfileRequirements,
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
        <View>
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
                Premium users only (coming soon!)
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      premiumOnly: !profileRequirements.premiumOnly,
                    });
                  }}
                  value={profileRequirements.premiumOnly}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>

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
                Has social media link
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      hasSocialLink: !profileRequirements.hasSocialLink,
                    });
                  }}
                  value={profileRequirements.hasSocialLink}
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
                Has over 3 posts
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      minPosts: profileRequirements.minPosts === 3 ? 0 : 3,
                    });
                  }}
                  value={profileRequirements.minPosts === 3}
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
                Was a previous winner
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      isPreviousWinner: !profileRequirements.isPreviousWinner,
                    });
                  }}
                  value={profileRequirements.isPreviousWinner}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View>

          {/* <View style={{ paddingHorizontal: 8 }}>
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
                Has been endorsed
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      hasBeenCosigned: !profileRequirements.hasBeenCosigned,
                    });
                  }}
                  value={profileRequirements.hasBeenCosigned}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View> */}

          {/* <View style={{ paddingHorizontal: 8 }}>
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
                Has written an endorsement
              </BodyText>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Switch
                  trackColor={{ false: "#767577", true: colors.white }}
                  thumbColor={colors.blue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    setProfileRequirements({
                      ...profileRequirements,
                      hasWrittenCosign: !profileRequirements.hasWrittenCosign,
                    });
                  }}
                  value={profileRequirements.hasWrittenCosign}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                    marginTop: -4,
                  }}
                />
              </View>
            </View>
          </View>*/}
        </View>

        <View style={{ paddingHorizontal: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomColor: "white",
              borderBottomWidth: 1,
              paddingTop: 12,
              paddingBottom: 12,
              alignItems: "center",
            }}
          >
            <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
              Minimum XP
            </BodyText>
            <TextInput
              style={[
                {
                  fontSize: 16,
                  fontFamily: Fonts.MonoExtraBold,
                  textAlign: "right",
                  color:
                    profileRequirements.minXP > 0
                      ? colors.blue
                      : colors.transparentWhite7,
                  paddingHorizontal: 4,
                  width: 60,
                },
              ]}
              onBlur={() => {
                if (isNaN(parseInt(`${profileRequirements.minXP}`))) {
                  setProfileRequirements({
                    ...profileRequirements,
                    minXP: parseInt(`${profileRequirements.minXP}`),
                  });
                } else {
                  setProfileRequirements({
                    ...profileRequirements,
                    minXP: 0,
                  });
                }
              }}
              placeholderTextColor={colors.white}
              cursorColor={"white"}
              keyboardType="number-pad"
              value={`${profileRequirements.minXP}`}
              onChangeText={(item) =>
                setProfileRequirements({
                  ...profileRequirements,
                  minXP: item,
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
