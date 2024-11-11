import { AntDesign } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import { Pressable, View } from "react-native";
import {
  MentionInput,
  MentionSuggestionsProps,
} from "react-native-controlled-mentions";
import Share from "react-native-share";
import { BodyText } from "../text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { typesenseSearch } from "../../services/typesense-service";
import { createInviteLink } from "../../services/link-service";

export const InputWithMentions = ({
  focused,
  setFocused,
  description,
  setDescription,
  inputStyles,
  placeholder,
  suggestionsStyles,
  placeholderColor,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const me = useMe();

  const openInvite = async () => {
    let link = createInviteLink(me.id);

    try {
      await Share.open({ url: link, message: "Join me on Realm" });
    } catch (error) {
      console.log("error 8");
      console.log(error);
    }
  };

  const renderSuggestions: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null) {
      return null;
    }

    const fetchUsers = async (keyword) => {
      let userResults: any = await typesenseSearch("users", keyword, []);
      let results = userResults.docs
        .map((item) => ({ ...item, name: item.username.trim() }))
        .filter((item) => item.name)
        .splice(0, 5);
      if (keyword.length > 0 && keyword != "@") {
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };

    fetchUsers(keyword);

    return (
      <View
        style={{
          backgroundColor: colors.lightblack,
          position: "absolute",
          zIndex: 99,
          minHeight: 80,
          ...suggestionsStyles,
        }}
      >
        {suggestions
          .filter(
            (one) =>
              one.username
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase()) && keyword.length > 0
          )
          .map((one) => (
            <Pressable
              key={one.id}
              onPress={() => {
                onSuggestionPress(one);
                setTimeout(() => {
                  setSuggestions([]);
                }, 1000);
              }}
              style={{
                // backgroundColor: colors.lightblack,
                paddingVertical: 8,
                paddingHorizontal: 8,
                borderBottomColor: "rgba(0, 0, 0, 0.2)",
                borderBottomWidth: 0.5,
              }}
            >
              <BodyText style={{}}>{one.username}</BodyText>
            </Pressable>
          ))}
        <Pressable
          key={"invite"}
          onPress={() => {
            setDescription(
              description
                .split("")
                .filter((item) => item !== "@")
                .join("")
            );
            setTimeout(() => {
              setSuggestions([]);
            }, 1000);
            openInvite();
          }}
          style={{
            // backgroundColor: colors.lightblack,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderBottomColor: "rgba(0, 0, 0, 0.2)",
            borderBottomWidth: 0.5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="pluscircle"
            size={16}
            color={colors.blue}
            style={{ marginRight: 5 }}
          />
          <BodyText style={{}}>{`Invite a friend`}</BodyText>
        </Pressable>
      </View>
    );
  };

  return (
    <MentionInput
      style={[
        {
          fontFamily: Fonts.Regular,

          color: "white",

          ...inputStyles,
        },
      ]}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setSuggestions([]);
        setFocused(false);
      }}
      placeholderTextColor={placeholderColor}
      placeholder={placeholder}
      cursorColor={"white"}
      multiline={true}
      value={description}
      onChange={(text) => setDescription(text)}
      partTypes={[
        {
          trigger: "@",
          renderSuggestions,
          textStyle: { fontWeight: "bold", color: colors.blue },
        },
      ]}
    />
  );
};
