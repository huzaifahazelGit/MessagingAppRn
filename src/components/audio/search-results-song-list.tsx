import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { useMe } from "../../hooks/useMe";
import { DEFAULT_PROFILE_COLORS } from "../../hooks/useProfileColors";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { Post } from "../../models/post";
import { getResizedImage } from "../../services/utils";
import { EditPostModal } from "../modals/edit-post-modal";
import { BodyText, BoldMonoText } from "../text";
import EmptyAudioBackground from "../images/empty-audio-background";

export const SearchResultsSongList = ({ songs }: { songs: Post[] }) => {
  const { setUpPlaylist } = useTrackPlayerContext();

  useEffect(() => {
    if (songs.length > 0) {
      setUpAudio();
    }
  }, [songs]);

  const setUpAudio = async () => {
    setUpPlaylist(songs);
  };

  return (
    <FlatList
      data={songs}
      renderItem={({ item }) => (
        <ListSongItem
          item={item}
          profileColors={DEFAULT_PROFILE_COLORS}
          onDelete={() => {}}
          isMyCompany={false}
          companyId={null}
        />
      )}
    />
  );
};

export const ListSongItem = ({
  item,
  profileColors,
  onDelete,
  isMyCompany,
  companyId,
}) => {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const { pauseCurrentTrack, playTrackById, isPlaying } =
    useTrackPlayerContext();
  const currentTrack = useCurrentTrack();
  const me = useMe();
  const [showEdit, setShowEdit] = useState(false);

  const selectTrack = async (post: Post) => {
    if (currentTrack && post.id == currentTrack.id && isPlaying) {
      pauseCurrentTrack();
    } else {
      playTrackById(post.id);
    }
  };

  const alertRemoveSong = () => {
    Alert.alert(
      "Remove From Jukebox",
      "Are you sure you want to remove this song from your organization jukebox?",
      [
        {
          style: "cancel",
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: async () => {
            onDelete(item);
            let ref = doc(getFirestore(), "posts", item.id);
            await updateDoc(ref, {
              companyJukeboxDisplay: item.companyJukeboxDisplay.filter(
                (item) => item != companyId
              ),
            });
          },
        },
      ]
    );
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Pressable
        onPress={() => selectTrack(item)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 24,
          paddingRight: me.id == item.userId || isMyCompany ? 0 : 20,
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              marginTop: 4,
              width: 50,
              height: 50,
              backgroundColor: "black",
              borderRadius: 6,
            }}
          >
            {item.image ? (
              <Image
                source={{
                  uri: getResizedImage(item.image),
                }}
                style={{ width: 50, height: 50, borderRadius: 6 }}
              />
            ) : (
              <EmptyAudioBackground size={50} />
            )}

            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                marginTop: -50,
                width: 50,
                height: 50,
                borderRadius: 6,
              }}
            >
              {currentTrack && currentTrack.id == item.id && isPlaying ? (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                >
                  <MaterialIcons name="pause" size={30} color={"white"} />
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-evenly",
              marginLeft: 12,
              width:
                me.id == item.userId || companyId
                  ? SCREEN_WIDTH - 110 - 20
                  : SCREEN_WIDTH - 110,
            }}
          >
            <BoldMonoText
              style={{
                fontSize: 20,
                color: textColor,
              }}
            >
              {item.uploadTitle}
            </BoldMonoText>
            <BodyText style={{ color: textColor }}>{item.username}</BodyText>
          </View>
        </View>
      </Pressable>
      <View style={{ paddingTop: 20 }}>
        {me.id == item.userId ? (
          <Pressable
            onPress={() => setShowEdit(true)}
            style={{ marginLeft: 4 }}
          >
            <Feather
              name="more-horizontal"
              size={24}
              color={buttonColor}
              style={{ opacity: 0.5 }}
            />
          </Pressable>
        ) : isMyCompany ? (
          <Pressable onPress={alertRemoveSong} style={{ marginLeft: 4 }}>
            <Feather
              name="more-horizontal"
              size={24}
              color={buttonColor}
              style={{ opacity: 0.5 }}
            />
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <EditPostModal
        post={item}
        onDelete={onDelete}
        showModal={showEdit}
        setShowModal={setShowEdit}
      />
    </View>
  );
};
