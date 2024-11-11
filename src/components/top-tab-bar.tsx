import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";
import { IS_ANDROID, SCREEN_WIDTH } from "../constants/utils";
import { useMe } from "../hooks/useMe";

export function TopTabBar({
  state,
  descriptors,
  navigation,
  containerStyle,
  itemStyle,
  buttonColor,
  textColor,
  textStyle,
  dotIndexes,
}: {
  state: any;
  descriptors: any;
  navigation: any;
  containerStyle?: any;
  itemStyle?: any;
  buttonColor: string;
  textColor: string;
  textStyle?: any;
  dotIndexes?: number[];
}) {
  const me = useMe();
  return (
    <View
      style={{
        borderBottomColor: colors.white,
        borderBottomWidth: 0.5,
        ...containerStyle,
      }}
    >
      <View
        style={{
          flexDirection: "row",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              (navigation as any).navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                width: IS_ANDROID ? SCREEN_WIDTH * 0.25 : SCREEN_WIDTH * 0.22,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 2,
                borderBottomColor: isFocused ? buttonColor : "transparent",
                marginHorizontal: 8,
                flexDirection: "row",

                ...itemStyle,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  opacity: isFocused ? 1 : 0.5,
                  color: textColor,
                  fontFamily: Fonts.MonoBold,
                  marginBottom: 8,
                  paddingHorizontal: 4,
                  textAlign: "center",
                  ...textStyle,
                }}
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                allowFontScaling={false}
              >
                {label}
              </Text>

              {(dotIndexes || []).includes(index) && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12 / 2,
                    backgroundColor: colors.blue,
                    marginBottom: 8,
                    marginRight: -8,
                  }}
                ></View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
