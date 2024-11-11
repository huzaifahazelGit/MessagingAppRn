import React from "react";
import { TextInput, View } from "react-native";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";

export default function IconInput({
  title,
  icon,
  leftAlign,
  textInputStyles,
  inputContainerStyles,
  placeholder,
  value,
  setValue,
  keyboardType,
  secureTextEntry,
  skipAutoCapitalize,
  submit,
}: {
  title?: any;
  textInputStyles?: any;
  icon?: any;
  leftAlign?: boolean;
  inputContainerStyles?: any;
  placeholder: string;
  value: string;
  setValue: any;
  keyboardType?: string;
  secureTextEntry?: boolean;
  skipAutoCapitalize?: boolean;
  submit?: any;
}) {
  return (
    <View style={{ width: "100%" }}>
      {/* {title ? (
        <BodyText style={{ marginBottom: 10 }}>{title}</BodyText>
      ) : (
        <View />
      )} */}
      <View
        style={{
          borderBottomColor: colors.white,
          borderBottomWidth: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: leftAlign ? "flex-start" : "center",
          ...inputContainerStyles,
        }}
      >
        {icon ? icon : <View />}
        <TextInput
          style={{
            fontFamily: Fonts.MonoBold,
            textAlign: leftAlign ? "left" : "center",
            color: "white",
            paddingVertical: 12,
            paddingHorizontal: 0,
            fontSize: 16,
            minWidth: SCREEN_WIDTH - 100,
            flex: 1,
            ...textInputStyles,
          }}
          autoCapitalize={skipAutoCapitalize ? "none" : "sentences"}
          placeholderTextColor={colors.transparentWhite6}
          placeholder={`${placeholder}`.toUpperCase()}
          value={value}
          onChangeText={(text) => setValue(text)}
          //   @ts-ignore
          keyboardType={keyboardType || "default"}
          secureTextEntry={secureTextEntry || false}
          onSubmitEditing={submit}
        />
      </View>
    </View>
  );
}
