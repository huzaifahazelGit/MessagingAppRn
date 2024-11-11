import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Platform, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { BoldMonoText } from "../text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { typesenseSearch } from "../../services/typesense-service";
Feather.loadFont();

export const CompanyDropdown = ({ selectedCompany, setSelectedCompany }) => {
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
    let userResults: any = await typesenseSearch("companies", filterToken, []);
    let results = userResults.docs
      .map((item) => ({ ...item, title: item.name.trim() }))
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
          initialValue={selectedCompany ? selectedCompany.id : undefined}
          direction={Platform.select({ ios: "down" })}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedCompany(item);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          onClear={onClearPress}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: "Search...",
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
            <BoldMonoText style={{ color: "#fff", padding: 15, fontSize: 18 }}>
              {item.title}
            </BoldMonoText>
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
