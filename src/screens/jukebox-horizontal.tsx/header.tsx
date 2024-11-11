import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { User } from "../../models/user";

export function HorizontalJukeboxHeader({
  selectedPlaylist,
  setSelectedPlaylist,
  setSelectedTrack,
  showRadio,
  setShowRadio,
  user,
}: {
  selectedPlaylist: any;
  setSelectedPlaylist: any;
  setSelectedTrack: any;
  showRadio: boolean;
  setShowRadio: any;
  user: User;
}) {
  const orientationGoBack = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        paddingTop: 12,
        paddingLeft: 50,
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{}}
        onPress={() => {
          if (selectedPlaylist) {
            setSelectedPlaylist(null);
            setSelectedTrack(null);
          } else {
            orientationGoBack();
          }
        }}
      >
        <Ionicons name="arrow-back" size={30} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginLeft: 12,
          borderColor: showRadio ? colors.transparent : colors.purple,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
        onPress={() => {
          setShowRadio(false);
          if (selectedPlaylist) {
            setSelectedPlaylist(null);
          }
        }}
      >
        <BoldMonoText
          style={{ color: showRadio ? colors.white : colors.purple }}
        >
          {selectedPlaylist && user && user.username
            ? `${user.username}'s Jukebox`
            : "Jukebox"}
        </BoldMonoText>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginLeft: 8,
          borderColor: showRadio ? colors.purple : colors.transparent,
          borderWidth: 1,
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
        onPress={() => {
          setShowRadio(true);
        }}
      >
        <BoldMonoText
          style={{ color: showRadio ? colors.purple : colors.white }}
        >
          Radio
        </BoldMonoText>
      </TouchableOpacity>
    </View>
  );
}
