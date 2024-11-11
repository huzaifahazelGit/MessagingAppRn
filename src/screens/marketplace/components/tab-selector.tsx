import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { colors } from '../../../constants/colors';
import { BodyText } from "../../../components/text";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";

export default function TabSelector({
  options,
  equalSpacing,
  selected,
  setSelected,
  buttonColor,
  textColor,
  horizontalPadding,
  bottomBarHeight,
  notSelectedColor,
}: {
  options: string[];
  equalSpacing?: boolean;
  selected: string;
  setSelected: any;
  buttonColor?: string;
  notSelectedColor?: string;
  textColor?: string;
  horizontalPadding?: number;
  bottomBarHeight?: number;
}) {
  if (equalSpacing) {
    return (
      <View style={{ alignItems: "center", paddingBottom: 4 , }}>
        <OptionsList
          horizontalPadding={horizontalPadding ? horizontalPadding : SCREEN_WIDTH/6}
          options={options}
          selected={selected}
          setSelected={setSelected}
          buttonColor={buttonColor}
          textColor={textColor}
          bottomBarHeight={bottomBarHeight ? bottomBarHeight : 4}
          notSelectedColor={notSelectedColor}
        />
      </View>
    );
  }
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 50 }}
    >
      <OptionsList
        options={options}
        selected={selected}
        setSelected={setSelected}
        buttonColor={buttonColor}
        textColor={textColor}
        bottomBarHeight={bottomBarHeight ? bottomBarHeight : 3}
        notSelectedColor={notSelectedColor}
      />
    </ScrollView>
  );
}

function OptionsList({
  options,
  selected,
  setSelected,
  horizontalPadding,
  buttonColor,
  textColor,
  bottomBarHeight,
  notSelectedColor,
}: {
  options: string[];
  selected: string;
  setSelected: any;
  horizontalPadding?: number;
  buttonColor?: string;
  textColor?: string;
  bottomBarHeight: number;
  notSelectedColor?: string;
}) {
  return (
    <View style={{ flexDirection: "row" }}>
      {options.map((option, index) => (
        <View key={index}>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: horizontalPadding ? horizontalPadding : 8,
              borderBottomWidth: bottomBarHeight,
            //   marginRight: 8,
              borderBottomColor:
                option == selected
                  ? buttonColor ?? colors.white
                  : notSelectedColor ?? colors.transparentWhite2,
            }}
            onPress={() => setSelected(option)}
          >
            <BodyText
              style={
                option == selected
                  ? {
                      fontFamily: Fonts.MonoBold,
                      color: textColor ?? "white",
                      fontSize: 14,
                    }
                  : {
                      color: textColor ?? "white",
                      fontFamily: Fonts.MonoBold,
                      fontSize: 14,
                    }
              }
            >
              {option}
            </BodyText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
