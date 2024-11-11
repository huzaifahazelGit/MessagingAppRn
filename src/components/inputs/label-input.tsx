import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Button, Dimensions, Text, View, Platform } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

import { Feather } from "@expo/vector-icons";
import { tagSearch, typesenseSearch } from "../../services/typesense-service";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { BoldMonoText } from "../text";
import { shuffle } from "../../services/utils";
import { useLabels } from "../../hooks/useLabels";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
Feather.loadFont();

export const LabelDropdown = ({ selectedLabel, setSelectedLabel }) => {
  const [loading, setLoading] = useState(false);
  const labels = useLabels();
  const [q, setQ] = useState("");
  const me = useMe();

  console.log("initial val", selectedLabel ? selectedLabel.id : undefined);

  const suggestionsList = useMemo(() => {
    let base = labels;
    if (q.length > 0) {
      // @ts-ignore
      base = [...labels, { name: q, title: q, id: "custom" }];
    } else if (me.labelObj && me.labelObj.id == "custom") {
      base = [
        ...labels,
        // @ts-ignore
        { name: me.labelObj.name, title: me.labelObj.name, id: "custom" },
      ];
    }

    return base
      .filter((item) => item.name.toLowerCase().includes(q.toLowerCase()))
      .map((item) => ({
        ...item,
        title: item.name.trim(),
        id: item.id ?? "",
      }));
  }, [q, labels, me.id]);

  const dropdownController = useRef(null);

  if (labels.length == 0) {
    return <View />;
  }
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
          initialValue={selectedLabel ? selectedLabel.id : undefined}
          direction={Platform.select({ ios: "down" })}
          dataSet={suggestionsList}
          onSelectItem={(item) => {
            item && setSelectedLabel(item);
          }}
          onClear={() => setSelectedLabel(null)}
          debounce={600}
          onChangeText={(q) => {
            console.log("on change", q);
            setQ(q);
          }}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder: "Your Label...",
            autoCorrect: false,
            autoCapitalize: "none",
            style: {
              backgroundColor: colors.lightblack,
              paddingHorizontal: 6,
              fontSize: 14,
              color: colors.white,
              fontFamily: Fonts.Regular,

              paddingVertical: 12,

              minWidth: SCREEN_WIDTH - 100,
            },
          }}
          inputContainerStyle={{
            backgroundColor: colors.lightblack,
            borderRadius: 6,
            paddingHorizontal: 6,
            overflow: "hidden",
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <BoldMonoText
              style={{
                color: "#000",
                padding: 15,
                fontSize: 16,
                backgroundColor: "white",
              }}
            >
              {item.title}
            </BoldMonoText>
          )}
          showClear={selectedLabel ? true : false}
          showChevron={false}
          inputHeight={40}
        />
      </View>
    </>
  );
};
