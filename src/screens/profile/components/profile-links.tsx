import { Entypo } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import { cleanLink } from "../../../services/utils";

export default function ProfileLinks({ user }) {
  const textColor = useMemo(() => {
    return user && user.textColor ? user.textColor : colors.white;
  }, [user]);

  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 8,
        }}
      >
        {user.instagram ? (
          <TouchableOpacity
            style={{ paddingRight: 8 }}
            onPress={() =>
              Linking.openURL(cleanLink(user.instagram, "instagram"))
            }
          >
            <Entypo name="instagram" size={22} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {user.soundcloud ? (
          <TouchableOpacity
            style={{ paddingRight: 8 }}
            onPress={() =>
              Linking.openURL(cleanLink(user.soundcloud, "soundcloud"))
            }
          >
            <Entypo name="soundcloud" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {user.spotify ? (
          <TouchableOpacity
            style={{ paddingRight: 8 }}
            onPress={() => Linking.openURL(cleanLink(user.spotify, "spotify"))}
          >
            <Entypo name="spotify" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {user.youtube ? (
          <TouchableOpacity
            style={{ paddingRight: 8 }}
            onPress={() => Linking.openURL(cleanLink(user.youtube, "youtube"))}
          >
            <Entypo name="youtube" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
}
