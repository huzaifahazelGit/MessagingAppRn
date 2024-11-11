import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "../../../components/navbar";
import { BodyText } from "../../../components/text";
import { Fonts } from "../../../constants/fonts";

export const EmptyUser = ({}: {}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: insets.top }}></View>
      <NavBar title={"Profile"} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          onPress={() => {
            (navigation as any).navigate("Login");
          }}
        >
          <BodyText style={{ fontSize: 16, fontFamily: Fonts.SemiBold }}>
            SIGN IN
          </BodyText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
