import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Platform, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { typesenseSearch } from "../../services/typesense-service";
import { GeneralDataStore } from "../../store/general-data-store";
Feather.loadFont();

export const PlaylistDropdown = ({ selectedPlaylist, setSelectedPlaylist }) => {
  const [loading, setLoading] = useState(false);
  const playlists = GeneralDataStore.useState((s) => s.playlists);
  const [suggestionsList, setSuggestionsList] = useState(
    playlists.map((item) => ({
      ...item,
      title: item.name.trim(),
      id: item.id ?? "",
    }))
  );

  const dropdownController = useRef(null);

  return (
    <AutocompleteDropdown
      controller={(controller) => {
        dropdownController.current = controller;
      }}
      initialValue={selectedPlaylist ? selectedPlaylist.id : undefined}
      direction={Platform.select({ ios: "down" })}
      dataSet={suggestionsList}
      onSelectItem={(item) => {
        item && setSelectedPlaylist(item);
      }}
      onClear={() => setSelectedPlaylist(null)}
      debounce={600}
      suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
      loading={loading}
      useFilter={false}
      textInputProps={{
        placeholder: "Playlists...",
        autoCorrect: false,
        autoCapitalize: "none",
        style: {
          backgroundColor: colors.blue,
          color: colors.white,
          paddingLeft: 18,
          fontSize: 16,
          fontFamily: Fonts.MonoBold,
          borderBottomWidth: 0,
          borderRadius: 0,
          borderBottomStartRadius: 0,
          borderBottomEndRadius: 0,
        },
      }}
      inputContainerStyle={{
        backgroundColor: colors.blue,
        borderRadius: 30,
        overflow: "hidden",
      }}
      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
      renderItem={(item, text) => (
        <BoldMonoText style={{ color: "#000", padding: 15, fontSize: 16 }}>
          {item.title}
        </BoldMonoText>
      )}
      ClearIconComponent={<Feather name="x" size={18} color="#fff" />}
      ChevronIconComponent={
        <Feather name="chevron-down" size={18} color="#fff" />
      }
      inputHeight={50}
    />
  );
};
