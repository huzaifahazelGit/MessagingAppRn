import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import TrackPlayer from "react-native-track-player";

import {
  GiphyDialog,
  GiphyDialogEvent,
  GiphyDialogMediaSelectEventHandler,
  GiphyMedia,
  GiphyThemePreset,
} from "@giphy/react-native-sdk";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { BackButton } from "../../components/buttons/buttons";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import {
  useMarketplacePostForId,
  usePostComments,
  usePostForId,
} from "../../hooks/usePosts";
import { PostItem } from "../post-item/post-item";
import CommentInput from "./comment-input";
import CommentsList from "./comment-list";
import { IS_IOS } from "../../constants/utils";
import * as ScreenOrientation from "expo-screen-orientation";
import WaveformContainer from "../../components/waveform";
import { Post } from "../../models/post";
import { BodyText } from "../../components/text";

export default function PostDetail() {
  const route = useRoute();
  const params = route.params as any;
  const postId = params.postId;
  const marketplace = params.marketplace || false;
  const post = marketplace
    ? useMarketplacePostForId(postId)
    : usePostForId(postId);
  const comments = usePostComments(postId);
  const [selectedComment, setSelectedComment] = useState(null);
  const [subComments, setSubComments] = useState([]);

  const me = useMe();
  const navigation = useNavigation();
  const [media, setMedia] = useState<GiphyMedia | null>(null);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    if (selectedComment && selectedComment.parentCommentId) {
      let parent = comments.find(
        (item) => item.id == selectedComment.parentCommentId
      );
      if (parent) {
        setSelectedComment(parent);
        setComment(
          `@[${selectedComment.username}](${selectedComment.userId}) `
        );
      }
    }
  }, [selectedComment]);

  console.log("comment", comment);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    GiphyDialog.configure({ theme: GiphyThemePreset.Dark });
    const handler: GiphyDialogMediaSelectEventHandler = (e) => {
      setMedia(e.media);
      GiphyDialog.hide();
    };
    const listener = GiphyDialog.addListener(
      GiphyDialogEvent.MediaSelected,
      handler
    );
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    let items = (comments || []).filter((item) => item.parentCommentId);
    if (items.length != subComments.length) {
      setSubComments(items);
    }
  }, [comments, subComments]);

  if (post && post.archived) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
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
          <BackButton
            customBack={() => {
              navigation.goBack();
              TrackPlayer.reset();
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 160,
                height: 60,
              }}
              contentFit={"contain"}
              source={require("../../../assets/icon-title.png")}
            />
          </View>
          <View style={{ width: 30 }} />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <BodyText>This post has been deleted.</BodyText>
        </View>
      </SafeAreaView>
    );
  }
  if (!post) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
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
          <BackButton
            customBack={() => {
              navigation.goBack();
              TrackPlayer.reset();
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 160,
                height: 60,
              }}
              contentFit={"contain"}
              source={require("../../../assets/icon-title.png")}
            />
          </View>
          <View style={{ width: 30 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
            >
              <Image
                style={{
                  width: 160,
                  height: 60,
                }}
                contentFit={"contain"}
                source={require("../../../assets/icon-title.png")}
              />
            </View>
            <View style={{ width: 30 }} />
          </View>

          <PostItem
            visible={true}
            marketplace={marketplace}
            onDelete={async () => {
              await TrackPlayer.reset();
              const userRef = doc(getFirestore(), "users", me.id);
              updateDoc(userRef, {
                lastReset: new Date(),
                lastActive: new Date(),
              });
              navigation.goBack();
            }}
            hideFooter={true}
            // @ts-ignore
            post={{
              ...post,
            }}
            skipAutoPlay={true}
          />

          <CommentsList
            comments={(comments || []).filter((item) => !item.parentCommentId)}
            subComments={subComments}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            textColor={colors.white}
            onPressUser={() => {}}
          />
        </ScrollView>

        <KeyboardAvoidingView behavior={IS_IOS ? "padding" : "height"}>
          <CommentInput
            postId={postId}
            post={post}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            setMedia={setMedia}
            media={media}
            showGiphy={() => {
              GiphyDialog.show();
            }}
            comment={comment}
            setComment={setComment}
            textColor={colors.white}
            placeholderColor={colors.transparentWhite6}
            setShowComments={() => {}}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
