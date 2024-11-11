import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import { MaterialIcons } from "@expo/vector-icons";
import {
  arrayRemove,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { BackButton } from "../../components/buttons/buttons";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { useMarketplacePostForId, usePostForId } from "../../hooks/usePosts";
import { PostItem } from "../post-item/post-item";
import Share from "react-native-share";
import * as ScreenOrientation from "expo-screen-orientation";
import ReloadableImage from "../../components/images/reloadable-image";
import { SCREEN_WIDTH } from "../../constants/utils";
import HeightAdjustedVideo from "../../components/height-adjusted-video";
import { IMAGEKIT_FULL_REPLACE } from "../../constants/env";
import PostAudioPlayer from "../../components/audio/post-audio-player";
import { BoldMonoText } from "../../components/text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AddToFolderModal } from "../../components/modals/add-to-folder-modal";
import { FileOptionsModal } from "../../components/modals/file-options-modal";
import { createPostLink } from "../../services/link-service";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import { EmptyAudioBackgroundWrapper } from "../../components/images/empty-audio-background";
import WaveformContainer from "../../components/waveform";
import { Post } from "../../models/post";

export default function ObjectViewerDetail() {
  const route = useRoute();
  const params = route.params as any;
  const postId = params.postId;
  const parentFolderId = params.parentFolderId || null;
  const marketplace = params.marketplace || false;
  const post = marketplace
    ? useMarketplacePostForId(postId)
    : usePostForId(postId);
  const IMAGE_WIDTH = SCREEN_WIDTH - 24;
  const me = useMe();
  const navigation = useNavigation();
  const [showAddToFolder, setShowAddToFolder] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  const name = useMemo(() => {
    if (post) {
      if (post.uploadTitle) {
        return post.uploadTitle;
      }
      let base = post.image;
      if (post.video) {
        base = post.video;
      }
      if (base.split("%2F").length > 1) {
        let newBase = base.split("%2F")[1];
        return newBase.split("?")[0];
      }
      return post.kind;
    }
    return "";
  }, [post]);

  const onShare = async () => {
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

  useEffect(() => {
    lockOrientation();
  }, []);

  if (!post) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.blueblack,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: -10,
          }}
        >
          <BackButton />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          ></View>
          <TouchableOpacity style={{ width: 30 }}></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.blueblack }}>
      <View
        style={{
          marginBottom: 30,
          backgroundColor: colors.transparentWhite1,
        }}
      >
        <SafeAreaView style={{}}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <BackButton style={{ width: 40 }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              <BoldMonoText>{name}</BoldMonoText>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => setShowFileOptions(true)}
              >
                <MaterialIcons name="more-horiz" size={24} color={"white"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ width: 40, alignItems: "flex-end" }}
              onPress={() => {
                if ((post as any).starred) {
                  updateDoc(doc(getFirestore(), "posts", post.id), {
                    starred: false,
                  });
                } else {
                  updateDoc(doc(getFirestore(), "posts", post.id), {
                    starred: true,
                  });
                }
              }}
            >
              <MaterialIcons
                name={(post as any).starred ? "star" : "star-outline"}
                size={24}
                color={"white"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingBottom: 60 }}>
          {post.audio ? (
            <View style={{ margin: 12, marginBottom: 60 }}>
              <EmptyAudioBackgroundWrapper
                size={IMAGE_WIDTH}
                post={post as any}
              >
                <View></View>
              </EmptyAudioBackgroundWrapper>
            </View>
          ) : post.video ? (
            <View
              style={{
                width: IMAGE_WIDTH,
                marginLeft: 12,
              }}
            >
              <HeightAdjustedVideo
                videoURL={(post.video || "").replace(
                  "https://firebasestorage.googleapis.com/",
                  IMAGEKIT_FULL_REPLACE
                )}
                visible={false}
                setVideoURL={() => {}}
                clearable={false}
                fullWidth={IMAGE_WIDTH}
                post={post as any}
              />
            </View>
          ) : post.image ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <ReloadableImage imageURL={post.image} fullWidth={IMAGE_WIDTH} />
            </View>
          ) : (
            <View style={{ height: 12 }} />
          )}
        </View>
      </SafeAreaView>
      {post.audio && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 130,
            backgroundColor: colors.transparentWhite1,
          }}
        >
          {post && <WaveformContainer post={post as Post} />}
        </View>
      )}
      <FileOptionsModal
        post={post as any}
        onSelectOption={async (option) => {
          if (option == "Add to folder") {
            setShowAddToFolder(true);
          }

          if (option == "Remove from folder") {
            setShowFileOptions(false);
            await updateDoc(doc(getFirestore(), "posts", post.id), {
              parentFolderIds: arrayRemove(parentFolderId),
            });

            await updateDoc(doc(getFirestore(), "folders", parentFolderId), {
              fileCount: increment(-1),
            });
          }
          if (option == "Share") {
            onShare();
          }
        }}
        showModal={showFileOptions}
        setShowModal={setShowFileOptions}
        inFolder={parentFolderId != null}
      />
      <AddToFolderModal
        post={post as any}
        showModal={showAddToFolder}
        setShowModal={setShowAddToFolder}
      />
    </View>
  );
}
