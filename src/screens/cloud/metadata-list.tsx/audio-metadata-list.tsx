import { MaterialIcons } from "@expo/vector-icons";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../constants/utils";
import { useCurrentTrack } from "../../../hooks/useCurrentTrack";
import { useMe } from "../../../hooks/useMe";
import { CollabMessage } from "../../../models/collaboration";
import { Paginator } from "../../../components/lists/paginator";
import { where, orderBy, collection, getFirestore } from "firebase/firestore";
import { Post } from "../../../models/post";
import { AddToFolderModal } from "../../../components/modals/add-to-folder-modal";
import { FileOptionsModal } from "../../../components/modals/file-options-modal";
import { useNavigation } from "@react-navigation/native";
import Share from "react-native-share";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import { createPostLink } from "../../../services/link-service";

export default function AudioMetadataList({ audioPosts }) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
      {audioPosts.length == 0 && (
        <View
          style={{
            paddingTop: 10,
            opacity: 0.7,
          }}
        >
          <BodyText>No files.</BodyText>
        </View>
      )}
      {audioPosts.map((item) => (
        <RoomAudioItem item={item} key={item.id} />
      ))}
    </View>
  );
}

export function PaginatedAudioMetadataList() {
  const [results, setResults] = useState([]);
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const [showAddToFolder, setShowAddToFolder] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const name = useMemo(() => {
    if (editingPost) {
      if (editingPost.uploadTitle) {
        return editingPost.uploadTitle;
      }
      let base = editingPost.image;
      if (editingPost.video) {
        base = editingPost.video;
      }
      if (base.split("%2F").length > 1) {
        let newBase = base.split("%2F")[1];
        return newBase.split("?")[0];
      }
      return editingPost.kind;
    }
    return "";
  }, [editingPost]);

  const onShare = async (post: Post) => {
    let link = createPostLink(post.id, me.id);

    let source = post.audio ? post.audio : post.video ? post.video : post.image;
    let title = name;

    let ending = source.split("%2F").pop();
    let extOne = ending.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    if (title.includes(ext)) {
      ext = "";
    }
    const path = `${DocumentDirectoryPath}/${title || "audio"}${ext}`;

    console.log("source", source);

    if (source) {
      const response = downloadFile({
        fromUrl: source,
        toFile: path,
      });
      response.promise
        .then(async (res) => {
          if (res && res.statusCode === 200 && res.bytesWritten > 0) {
            await Share.open({ url: path });
          } else {
            await Share.open({ url: post.image, message: link });
          }
        })
        .catch(async (error) => {
          console.log("err", error);
        });
    }
  };

  return (
    <View>
      <Paginator
        queryOptions={
          // me.username == "Tara Wilson"
          //   ? [where("kind", "in", ["audio"]), where("userId", "==", userId)]
          //   :
          [
            where("kind", "in", ["audio"]),
            where("userId", "==", userId),
            where("reposted", "==", false),
          ]
        }
        orderByOption={orderBy("createdate", "desc")}
        baseCollection={collection(getFirestore(), "posts")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setResults}
        results={results}
        itemsPerPage={12}
        listEmptyText={"No activity."}
        renderListItem={function (item: any, visible: boolean) {
          return (
            <PostAudioItem
              item={item}
              includeMoreButton={true}
              onClickMore={() => {
                setEditingPost(item);
                setShowFileOptions(true);
              }}
            />
          );
        }}
        trackVisible={false}
        setLastFetch={() => {}}
      />
      <FileOptionsModal
        post={editingPost}
        onSelectOption={(option) => {
          if (option == "Add to folder") {
            setShowAddToFolder(true);
          }
          if (option == "Share") {
            setShowFileOptions(false);
            onShare(editingPost);
          }
        }}
        showModal={showFileOptions}
        setShowModal={setShowFileOptions}
      />
      <AddToFolderModal
        post={editingPost}
        showModal={showAddToFolder}
        setShowModal={setShowAddToFolder}
      />
    </View>
  );
}

export const PostAudioItem = ({
  item,
  includeMoreButton,
  onClickMore,
  folderId,
}: {
  item: Post;
  includeMoreButton?: boolean;
  onClickMore?: any;
  folderId?: string;
}) => {
  return (
    <ListAudioItem
      id={item.id}
      audioUrl={item.audio}
      audioTitle={item.uploadTitle}
      userId={item.userId}
      username={null}
      imageUrl={item.image}
      includeMoreButton={includeMoreButton}
      onClickMore={onClickMore}
      folderId={folderId}
    />
  );
};

const RoomAudioItem = ({ item }: { item: CollabMessage }) => {
  return (
    <ListAudioItem
      id={item.id}
      audioUrl={item.audio}
      audioTitle={item.audioTitle}
      userId={item.userId}
      username={item.user.name}
      imageUrl={null}
      includeMoreButton={false}
      onClickMore={null}
      folderId={null}
    />
  );
};

const ListAudioItem = ({
  id,
  audioUrl,
  audioTitle,
  userId,
  username,
  imageUrl,
  includeMoreButton,
  onClickMore,
  folderId,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const currentTrack = useCurrentTrack();
  const me = useMe();
  const navigation = useNavigation();

  useEffect(() => {
    if (isPlaying) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isPlaying]);

  const selectTrack = async () => {
    if (folderId) {
      (navigation as any).navigate("ObjectViewerDetail", {
        postId: id,
        parentFolderId: folderId,
      });
    } else {
      if (currentTrack && id == currentTrack.id && isPlaying) {
        TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.reset();

        const track = {
          url: audioUrl,
          title: audioTitle,

          id: id,
        };

        await TrackPlayer.add([track]);

        TrackPlayer.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: colors.transparentWhite4,
        borderBottomWidth: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => selectTrack()}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",

          paddingRight: me.id == userId ? 0 : 20,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <ImageBackground
            style={{
              marginTop: 4,
              width: 50,
              height: 50,
              borderRadius: 6,
              overflow: "hidden",
            }}
            source={imageUrl ? { uri: imageUrl } : null}
          >
            {currentTrack && currentTrack.id == id && isPlaying ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "rgba(0, 0, 0, .5)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
              >
                <MaterialIcons name="pause" size={30} color={"white"} />
              </View>
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "rgba(0, 0, 0, .5)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
              >
                <MaterialIcons name="play-arrow" size={30} color={"white"} />
              </View>
            )}
          </ImageBackground>
          <View
            style={{
              justifyContent: "space-evenly",
              marginLeft: 12,
              width: includeMoreButton ? SCREEN_WIDTH - 125 : SCREEN_WIDTH - 80,
            }}
          >
            <BoldMonoText
              style={{
                fontSize: 18,
              }}
            >
              {`${audioTitle}`}
            </BoldMonoText>
            {username && <BodyText style={{}}>{username}</BodyText>}
          </View>
        </View>
        {includeMoreButton && (
          <TouchableOpacity
            onPress={() => onClickMore()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color={"white"} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};
