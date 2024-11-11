import React, { memo, useCallback, useRef, useState } from "react";
import { Button, Dimensions, Text, View, Platform } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

import { Feather } from "@expo/vector-icons";
import { tagSearch, typesenseSearch } from "../../services/typesense-service";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { BoldMonoText } from "../text";
import { shuffle } from "../../services/utils";
Feather.loadFont();

export const TagsDropdown = ({ selectedTag, setSelectedTag }) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);

  const dropdownController = useRef(null);

  const getSuggestions = useCallback(async (q) => {
    if (typeof q !== "string" || q.length < 1) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    let userTagResults: any = await tagSearch("users", q);
    userTagResults = (userTagResults.highlights || [])
      .filter((item) => item && item != "")
      .map((item) => ({ id: item, title: item }))
      .splice(0, 5);

    let postTagResults: any = await tagSearch("posts", q);
    postTagResults = (postTagResults.highlights || [])
      .filter((item) => item && item != "")
      .map((item) => ({ id: item, title: item }))
      .splice(0, 5);

    let results = shuffle([...userTagResults, ...postTagResults]);
    setSuggestionsList(results.splice(0, 7));
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
          initialValue={selectedTag}
          direction={Platform.select({ ios: "down" })}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedTag(item);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          onClear={onClearPress}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: "Search tags...",
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
            opacity: 0.6,
            backgroundColor: colors.black,
            borderBottomColor: "white",
            borderBottomWidth: 1,
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <BoldMonoText style={{ color: "#fff", padding: 15, fontSize: 14 }}>
              {`${item.title}`}
            </BoldMonoText>
          )}
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
        />
      </View>
    </>
  );
};
