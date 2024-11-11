import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { Playlist } from "../../../models/playlist";

export const PlaylistItem = ({
  playlist,
  tags,
  location,
}: {
  playlist: Playlist;
  tags?: string[];
  location?: string;
}) => {
  const navigation = useNavigation();

  let itemWidth = (SCREEN_WIDTH - 50) / 3;

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("PlaylistDetail", {
          playlistId: playlist.id,
        });
      }}
      style={{ paddingHorizontal: 10, marginBottom: 20 }}
    >
      {playlist.coverImage ? (
        <Image
          source={{ uri: playlist.coverImage }}
          style={{ width: itemWidth, height: itemWidth, borderRadius: 4 }}
        />
      ) : (
        <View
          style={{
            width: itemWidth,
            height: itemWidth,
            borderRadius: 4,
            borderColor: colors.transparentWhite7,
            borderWidth: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="cassette" size={35} color="white" />
        </View>
      )}
      <BodyText numLines={1} style={{ marginTop: 4 }}>
        {/* {`${playlist.name} (${playlist.songCount})`} */}
        {playlist.name}
      </BodyText>
    </TouchableOpacity>
  );
};
