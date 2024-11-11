import { AntDesign } from "@expo/vector-icons";
import {
  arrayRemove,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import { EmptyAudioBackgroundWrapper } from "../../components/images/empty-audio-background";
import { BoldMonoText } from "../../components/text";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Post } from "../../models/post";

export const PlaylistSongItem = ({
  item,
  onSelect,
  userId,
  companyId,
  canEdit,
  profileColors,
  isActive,
  playlistId,
  onRemoveFromJukebox,
}: {
  item: Post;
  onSelect: any;
  profileColors: ProfileColors;
  userId?: string;
  companyId?: string;
  canEdit: boolean;
  isActive: boolean;
  playlistId: string;
  onRemoveFromJukebox: any;
}) => {
  const { textColor } = profileColors;
  const currentTrack = useCurrentTrack();
  const itemHeight = isActive ? SCREEN_WIDTH - 80 : 140;

  const removeFromJukebox = async () => {
    await updateDoc(doc(getFirestore(), "posts", item.id), {
      playlistIds: arrayRemove(playlistId),
    });

    await updateDoc(doc(getFirestore(), "playlists", playlistId), {
      songCount: increment(-1),
    });

    onRemoveFromJukebox(item.id);
  };

  if (isActive) {
    return (
      <View style={{ marginRight: 8 }}>
        <View
          style={{
            marginTop: 4,
            width: itemHeight,
            height: itemHeight,
            backgroundColor: "black",
            borderRadius: 6,
          }}
        >
          <EmptyAudioBackgroundWrapper size={itemHeight} post={item}>
            <View
              style={{
                width: itemHeight,
                height: itemHeight,
                borderRadius: 6,
                alignItems: "flex-end",
              }}
            >
              {canEdit &&
                isActive &&
                currentTrack &&
                currentTrack.id == item.id && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 12,
                    }}
                    onPress={() => {
                      Alert.alert("Remove from Jukebox", "Are you sure?", [
                        { text: "Yes", onPress: () => removeFromJukebox() },
                        { text: "Cancel", onPress: () => {} },
                      ]);
                    }}
                  >
                    <AntDesign
                      name="minuscircleo"
                      size={22}
                      color={textColor}
                    />
                  </TouchableOpacity>
                )}
            </View>
          </EmptyAudioBackgroundWrapper>
        </View>
      </View>
    );
  }

  return (
    <Pressable onPress={onSelect} style={{ marginRight: 8 }}>
      <View
        style={{
          marginTop: 4,
          width: itemHeight,
          height: itemHeight,
          backgroundColor: "black",
          borderRadius: 6,
        }}
      >
        <EmptyAudioBackgroundWrapper size={itemHeight} post={item}>
          <View
            style={{
              width: itemHeight,
              height: itemHeight,
              borderRadius: 6,
              alignItems: "flex-end",
            }}
          ></View>
        </EmptyAudioBackgroundWrapper>
      </View>

      <BoldMonoText
        numLines={2}
        style={{ width: itemHeight, marginTop: 4, color: textColor }}
      >
        {item.uploadTitle}
      </BoldMonoText>
    </Pressable>
  );
};
