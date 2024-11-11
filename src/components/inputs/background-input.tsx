import React from "react";
import { TextInput, View } from "react-native";
import { BodyText } from "../text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { SCREEN_WIDTH } from "../../constants/utils";

export default function BackgroundInput({
  title,
  textInputStyles,
  inputContainerStyles,
  placeholder,
  value,
  setValue,
  keyboardType,
  multiline,
  titleStyles,
  icon,
}: {
  title: any;
  icon?: any;
  textInputStyles?: any;
  titleStyles?: any;
  inputContainerStyles?: any;
  placeholder: string;
  value: string;
  setValue: any;
  keyboardType?: string;
  multiline?: boolean;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon ? icon : <View />}
        <BodyText
          style={{
            marginBottom: 10,
            fontFamily: Fonts.SemiBold,
            ...titleStyles,
          }}
        >
          {title}
        </BodyText>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 6,
          backgroundColor: colors.lightblack,
          borderWidth: 0,
          paddingLeft: 4,
          ...inputContainerStyles,
        }}
      >
        <TextInput
          style={[
            {
              fontFamily: Fonts.Regular,

              color: "white",
              paddingVertical: 12,

              minWidth: SCREEN_WIDTH - 100,
              backgroundColor: colors.lightblack,
              paddingHorizontal: 6,
            },
            multiline
              ? {
                  height: 100,
                }
              : {},
            { ...textInputStyles },
          ]}
          placeholderTextColor={colors.transparentWhite4}
          cursorColor={"white"}
          multiline={multiline}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => setValue(text)}
          //   @ts-ignore
          keyboardType={keyboardType || "default"}
        />
      </View>
    </View>
  );
}
