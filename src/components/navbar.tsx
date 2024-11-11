import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { BackButton } from "./buttons/buttons";
import { Headline } from "./text";

export default function NavBar({
  title,
  includeBack,
  customBack,
  skipTitle,
  rightIcon,
  buttonColor,
  textColor,
}: {
  title: string;
  customBack?: any;
  includeBack?: boolean;
  skipTitle?: boolean;
  rightIcon?: any;
  buttonColor?: string;
  textColor?: string;
}) {
  const navigation = useNavigation();

  if (skipTitle && includeBack) {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {includeBack ? (
          <BackButton customBack={customBack} buttonColor={buttonColor} />
        ) : (
          <Spacer />
        )}
        {rightIcon ? rightIcon : <View />}
      </View>
    );
  }
  return (
    <View
      style={{
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        {includeBack ? (
          <BackButton customBack={customBack} buttonColor={buttonColor} />
        ) : (
          <Spacer />
        )}
        {skipTitle ? (
          <View />
        ) : (
          <Headline style={textColor ? { color: textColor } : {}}>
            {`${title}`.toUpperCase()}
          </Headline>
        )}
      </View>
      {rightIcon ? rightIcon : <View />}
    </View>
  );
}

export const Spacer = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <View
      style={{
        width: width && !isNaN(width) ? width : 50,
        height: height ? height : 1,
      }}
    />
  );
};
