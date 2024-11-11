import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Platform, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { BodyText, BoldMonoText } from "../text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { typesenseSearch } from "../../services/typesense-service";
import ProfileImage from "../images/profile-image";
Feather.loadFont();

export const UserDropdown = ({ selectedUser, setSelectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);

  const dropdownController = useRef(null);

  const getSuggestions = useCallback(async (q) => {
    const filterToken = q.toLowerCase();
    if (typeof q !== "string" || q.length < 3) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    let userResults: any = await typesenseSearch("users", q, []);
    let results = userResults.docs
      .map((item) => ({ ...item, title: item.username.trim() }))
      .filter((item) => item.title)
      .splice(0, 5);
    setSuggestionsList(results);
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

  return (
    <>
      <View
        style={[
          { flex: 1, flexDirection: "row", alignItems: "center" },
          Platform.select({ ios: { zIndex: 2 } }),
        ]}
      >
        <AutocompleteDropdown
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          initialValue={selectedUser ? selectedUser.id : undefined}
          direction={Platform.select({ ios: "down" })}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedUser(item);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          onClear={onClearPress}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: "Search users...",
            autoCorrect: false,
            autoCapitalize: "none",
            style: {
              backgroundColor: colors.black,
              color: "#fff",
              paddingLeft: 18,
              fontSize: 18,
              fontFamily: Fonts.MonoBold,
              borderBottomColor: "white",
              borderBottomWidth: 1,
              borderRadius: 0,
              borderBottomStartRadius: 0,
              borderBottomEndRadius: 0,
            },
          }}
          rightButtonsContainerStyle={{
            backgroundColor: colors.black,

            paddingRight: 8,
            marginLeft: 8,
            borderBottomColor: "white",
            borderBottomWidth: 1,
            borderBottomEndRadius: 0,
          }}
          inputContainerStyle={{
            backgroundColor: colors.black,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: colors.black,
            borderBottomWidth: 0,
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <View
              style={{
                marginTop: -4,
                backgroundColor: colors.black,
                paddingVertical: 6,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderWidth: 1,
                  backgroundColor: colors.black,

                  borderColor: colors.transparentWhite7,
                  borderRadius: 40,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <ProfileImage size={45} user={item as any} />
                <View style={{ paddingHorizontal: 15 }}>
                  <BoldMonoText
                    style={{
                      color: "#fff",

                      fontSize: 18,
                    }}
                  >
                    {item.title}
                  </BoldMonoText>
                  <BodyText style={{ fontSize: 12 }}>
                    {((item as any).musicianType || []).length > 0
                      ? `${((item as any).musicianType || [])

                          .join(", ")
                          .toLowerCase()}`
                      : `${(item as any).location}`}
                  </BodyText>
                </View>
              </View>
            </View>
          )}
          // ClearIconComponent={
          //   <Feather name="x-circle" size={18} color="#fff" />
          // }
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          // showClear={true}
        />
      </View>
    </>
  );
};
