import React from "react";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { BodyText } from "../text";

export default function TagSelector({
  options,
  selectedTags,
  setSelectedTags,
}: {
  options: string[];
  selectedTags: string[];
  setSelectedTags: any;
}) {
  return (
    <View style={{}}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (selectedTags.includes(option)) {
              setSelectedTags(selectedTags.filter((item) => item != option));
            } else {
              setSelectedTags([...selectedTags, option]);
            }
          }}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            borderWidth: 1,
            paddingVertical: 8,
            marginVertical: 8,
            borderColor: selectedTags.includes(option)
              ? colors.purple
              : "white",
          }}
        >
          <BodyText
            style={{
              fontFamily: Fonts.Regular,
              fontSize: 20,
              color: selectedTags.includes(option) ? colors.purple : "white",
            }}
          >
            {option}
          </BodyText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
