import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { View } from "react-native";
import { colors } from "../../constants/colors";
import { User } from "../../models/user";
import { IMAGEKIT_SMALL_REPLACE } from "../../constants/env";
import { getResizedProfileImage } from "../../services/utils";

export default function ProfileImage({
  user,
  size,
  overrideURL,
  includeBlank,
  border,
  borderColor,
}: {
  user?: User;
  size: number;
  overrideURL?: string;
  includeBlank?: boolean;
  border?: boolean;
  borderColor?: string;
}) {
  const finalUrl = useMemo(() => {
    let item = overrideURL ? overrideURL : user ? user.profilePicture : null;
    if (item) {
      return getResizedProfileImage(`${item}`);
    } else {
      return "";
    }
  }, [overrideURL, user]);

  if (!user && !overrideURL) {
    if (includeBlank) {
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,

            backgroundColor: colors.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="person" size={28} color="black" />
        </View>
      );
    }
    return <View />;
  }

  return (
    <View
      style={{
        width: border ? size + 2 : size,
        height: border ? size + 2 : size,
        borderRadius: (border ? size + 2 : size) / 2,

        backgroundColor: colors.lightblack,
        borderWidth: border ? 1 : 0,
        borderColor: border
          ? borderColor
            ? borderColor
            : "white"
          : "transparent",
      }}
    >
      {(user && user.profilePicture) || overrideURL ? (
        <Image
          source={{ uri: finalUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          // placeholderContent={
          //   <View
          //     style={{
          //       width: size,
          //       height: size,
          //       borderRadius: size / 2,
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //   >
          //     <ActivityIndicator />
          //   </View>
          // }
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,

            backgroundColor: colors.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="person" size={size * 0.75} color="black" />
        </View>
      )}
    </View>
  );
}
