import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { InputWithMentions } from "../../../components/inputs/mention-input";
import { BodyText } from "../../../components/text";
import DatePickerButton from "../../../components/upload-wrappers/datepicker-button";
import TagsWrapper from "../../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { Challenge } from "../../../models/challenge";

export const ArenaCaptionPhase = ({
  challenge,
  setChallenge,
  setPhase,
}: {
  challenge: Challenge;
  setChallenge: any;
  setPhase: any;
}) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!challenge.allowsVoting) {
      if (challenge.endDate && challenge.voteDate != challenge.endDate) {
        setChallenge({
          ...challenge,
          voteDate: challenge.endDate,
        });
      }
    }
  }, [challenge.allowsVoting, challenge.endDate, challenge.voteDate]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        ></Pressable>

        <View>
          <View style={{ marginHorizontal: 8, marginTop: 12, marginBottom: 8 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ width: 120, height: 120, borderRadius: 4 }}
                source={
                  challenge.coverImage
                    ? { uri: challenge.coverImage }
                    : require("../../../../assets/icon-audio-default.png")
                }
              />
              <View style={{ marginLeft: 6 }}>
                <InputWithMentions
                  suggestionsStyles={{
                    top: 80,
                    width: SCREEN_WIDTH - 160,
                  }}
                  placeholder={"Write caption"}
                  focused={focused}
                  setFocused={setFocused}
                  description={challenge.description}
                  setDescription={(item) =>
                    setChallenge({
                      ...challenge,
                      description: item,
                    })
                  }
                  inputStyles={{
                    color: "white",
                    width: SCREEN_WIDTH - 160,
                    height: 80,
                  }}
                  placeholderColor={colors.transparentWhite4}
                />
              </View>
            </View>
          </View>

          {focused ? (
            <Pressable
              style={{
                flex: 1,
                width: SCREEN_WIDTH,
                minHeight: 200,
              }}
              onPress={() => Keyboard.dismiss()}
            ></Pressable>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingVertical: 9,
                  }}
                >
                  <TextInput
                    style={[
                      {
                        fontFamily: Fonts.Regular,
                        width: "100%",
                        color: "white",
                        paddingLeft: 4,
                      },
                    ]}
                    placeholder="Challenge Title"
                    placeholderTextColor={colors.white}
                    cursorColor={"white"}
                    value={challenge.title}
                    onChangeText={(item) =>
                      setChallenge({
                        ...challenge,
                        title: item,
                      })
                    }
                  />
                </View>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <DatePickerButton
                  includeTime={true}
                  date={challenge.startDate}
                  setDate={(item) =>
                    setChallenge({
                      ...challenge,
                      startDate: item,
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
                      Announcement Date
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {challenge.startDate ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.softWhite }}
                        >
                          {moment(challenge.startDate).format("MMM Do hh:mm A")}
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
                </DatePickerButton>
              </View>

              {challenge.allowsVoting ? (
                <View style={{ paddingHorizontal: 8 }}>
                  <DatePickerButton
                    includeTime={true}
                    date={challenge.voteDate}
                    setDate={(item) =>
                      setChallenge({
                        ...challenge,
                        voteDate: item,
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
                        Submission Deadline
                      </BodyText>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {challenge.voteDate ? (
                          <BodyText
                            style={{ fontSize: 14, color: colors.softWhite }}
                          >
                            {moment(challenge.voteDate).format(
                              "MMM Do hh:mm A"
                            )}
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
                  </DatePickerButton>
                </View>
              ) : (
                <View />
              )}

              <View style={{ paddingHorizontal: 8 }}>
                <DatePickerButton
                  includeTime={true}
                  date={challenge.endDate}
                  setDate={(item) =>
                    setChallenge({
                      ...challenge,
                      endDate: item,
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
                      {challenge.allowsVoting
                        ? "Voting Ends"
                        : "Submission Deadline"}
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {challenge.endDate ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.softWhite }}
                        >
                          {moment(challenge.endDate).format("MMM Do hh:mm A")}
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
                </DatePickerButton>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingVertical: 8,
                  }}
                  onPress={() => {
                    setPhase("advanced");
                  }}
                >
                  <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                    Advanced Settings
                  </BodyText>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingVertical: 8,
                  }}
                  onPress={() => {
                    setPhase("requirements");
                  }}
                >
                  <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                    Profile Requirements
                  </BodyText>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
