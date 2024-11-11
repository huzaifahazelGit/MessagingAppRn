import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

export default function RAIUserIcon({ size }: { size: number }) {
  return (
    <View>
      <Image
        source={require("../../../assets/rai.png")}
        style={{
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        }}
        contentFit="contain"
      >
        <Image
          source={require("../../../assets/icon-white.png")}
          style={{
            width: size * 0.7,
            height: size * 0.7,
            marginTop: size * 0.1 * -1,
            marginLeft: size * 0.1,
          }}
          contentFit="contain"
        ></Image>
      </Image>
    </View>
  );
}
