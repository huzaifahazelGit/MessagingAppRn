import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Keyboard, Pressable, ScrollView, TextInput, View } from "react-native";
import { InputWithMentions } from "../../../components/inputs/mention-input";
import { BodyText } from "../../../components/text";
import BudgetPickerButton from "../../../components/upload-wrappers/budget-picker";
import DatePickerButton from "../../../components/upload-wrappers/datepicker-button";
import LocationButton from "../../../components/upload-wrappers/location-upload";
import TagsWrapper from "../../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";

export const MarketplaceCaptionPhase = ({
  tags,
  setTags,
  location,
  setLocation,
  description,
  setDescription,
  audioObject,
  setAudioObject,
  setPhase,
  imageUrl,
  videoUrl,
  budget,
  setBudget,
  deadline,
  setDeadline,
}) => {
  const [focused, setFocused] = useState(false);

  const me = useMe();

  const budgetString = useMemo(() => {
    if (budget.min > 0 || budget.max < 10000) {
      return `$${budget.min} - $${budget.max}`;
    }

    return "";
  }, [budget]);

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
          <View
            style={{ marginHorizontal: 8, marginTop: 12, marginBottom: 20 }}
          >
            <View style={{ flexDirection: "row" }}>
              {videoUrl ? (
                <View>
                  <Video
                    style={{
                      width: 120,
                      height: 180,
                      borderRadius: 8,
                    }}
                    source={{
                      uri: videoUrl,
                    }}
                    useNativeControls={false}
                    shouldPlay={false}
                    resizeMode={ResizeMode.COVER}
                  />
                </View>
              ) : (
                <Image
                  style={{ width: 120, height: 120, borderRadius: 4 }}
                  source={
                    imageUrl
                      ? { uri: imageUrl }
                      : require("../../../../assets/icon-audio-default.png")
                  }
                />
              )}
              <View style={{ marginLeft: 6 }}>
                <InputWithMentions
                  suggestionsStyles={{
                    top: 80,
                    width: SCREEN_WIDTH - 160,
                  }}
                  placeholder={"Write caption"}
                  focused={focused}
                  setFocused={setFocused}
                  description={description}
                  setDescription={setDescription}
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
              {audioObject ? (
                <View style={{ paddingHorizontal: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                    }}
                  >
                    <TextInput
                      style={[
                        {
                          fontFamily: Fonts.Regular,
                          width: "100%",
                          color: "white",
                        },
                      ]}
                      placeholder="Name Audio Track"
                      placeholderTextColor={colors.white}
                      cursorColor={"white"}
                      value={audioObject.name}
                      onChangeText={(text) =>
                        setAudioObject({ ...audioObject, name: text })
                      }
                    />
                  </View>
                </View>
              ) : (
                <View />
              )}

              <View style={{ paddingHorizontal: 8 }}>
                <DatePickerButton
                  includeTime={true}
                  date={deadline}
                  setDate={setDeadline}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Deadline
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {deadline ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.softWhite }}
                        >
                          {moment(deadline).format("MMM Do hh:mm A")}
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
                <LocationButton setLocation={setLocation}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Add Location
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {location ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.purple }}
                        >
                          {location}
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
                </LocationButton>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <BudgetPickerButton budget={budget} setBudget={setBudget}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Add Budget
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {budget ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.purple }}
                        >
                          {budgetString}
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
                </BudgetPickerButton>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <TagsWrapper tags={tags} setTags={setTags}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 8,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Add Tags
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {tags.length > 0 ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.purple }}
                        >
                          {`#${tags.join(" #")}`}
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
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
