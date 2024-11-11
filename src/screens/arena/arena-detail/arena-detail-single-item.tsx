import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useMemo, useRef } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import {
  SoundcloudPlayer,
  YoutubePlayer,
} from "../../../components/audio/links-players";
import ArenaSinglePostViewListAudioPlayer from "../../../components/audio/single-postview-list-audio-player";
import { SpotifyPlayer } from "../../../components/audio/spotify-player";
import { BackButton, LightButton } from "../../../components/buttons/buttons";
import HeightAdjustedVideo from "../../../components/height-adjusted-video";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { DEFAULT_ID, IS_ANDROID, SCREEN_WIDTH } from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";
import { PostKind } from "../../../models/post";
import { Submission } from "../../../models/submission";
import { useTrackPlayerContext } from "../../../hooks/useTrackPlayerContext";

export default function ArenaDetailSingleItemScreen({
  submission,
  allSubmissions,
  canVote,
  onSubmitVote,
  setViewingSubmission,
}: {
  submission: Submission;
  allSubmissions: Submission[];
  setViewingSubmission: any;
  canVote: boolean;
  onSubmitVote: any;
}) {
  const navigation = useNavigation();
  const userId = submission?.userId ? submission?.userId : DEFAULT_ID;
  const user = useUserForId(userId);
  const viewRef = useRef(null);

  const textColor = useMemo(() => {
    return colors.white;
  }, [user]);

  const author = useUserForId(userId);

  const trackList = useMemo(() => {
    return allSubmissions.map((item) => ({
      ...item,
      collaboratorIds: [],
      tags: [],
      private: false,
      featured: false,
      likes: [],
      id: item ? item.postId : DEFAULT_ID,
    }));
  }, [allSubmissions]);

  const post = useMemo(() => {
    return {
      ...submission,
      collaboratorIds: [],
      tags: [],
      private: false,
      featured: false,
      likes: [],
      id: submission ? submission.postId : DEFAULT_ID,
    };
  }, [submission]);

  if (!submission) {
    return <View />;
  }

  const imageSize = SCREEN_WIDTH - 24;

  return (
    <View style={{ flex: 1, paddingTop: IS_ANDROID ? 40 : 0 }}>
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
              setViewingSubmission(false);
            }}
            buttonColor={colors.purple}
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
              source={require("../../../../assets/icon-title.png")}
            />
          </View>
          <View style={{ width: 30 }} />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            ref={viewRef}
            style={{
              backgroundColor: colors.black,

              borderRadius: 4,
              marginVertical: submission ? 0 : 8,
              paddingHorizontal: 12,
              paddingBottom: 12,
              paddingTop: submission ? 0 : 12,
              marginHorizontal: 0,
            }}
          >
            <View style={{}}>
              <TouchableOpacity
                onPress={() => {
                  (navigation as any).navigate("ProfileStack", {
                    screen: "ProfileScreen",
                    params: { userId: post.userId },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: -8,
                    paddingLeft: 8,
                  }}
                >
                  <ProfileImage
                    user={{ ...author, id: post.userId }}
                    size={30}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <BodyText style={{ color: textColor }}>
                      {author ? author.username : ""}
                    </BodyText>
                  </View>
                </View>
              </TouchableOpacity>
              {post && post.kind == PostKind.spotify ? (
                <View style={{ marginTop: 20 }}>
                  <SpotifyPlayer
                    post={submission as any}
                    spotifyId={post.spotifyId}
                    containerWidth={imageSize}
                    smallVersion={false}
                  />
                  <PostNavigationBottom
                    setViewingSubmission={setViewingSubmission}
                    containerStyles={{ marginTop: 30 }}
                  />
                </View>
              ) : post && post.kind == PostKind.soundcloud ? (
                <View style={{ marginTop: 20 }}>
                  <SoundcloudPlayer
                    soundcloudLink={post.soundcloudLink}
                    containerWidth={imageSize}
                    webviewStyles={{
                      width: imageSize,
                      height: imageSize,
                    }}
                  />
                  <PostNavigationBottom
                    setViewingSubmission={setViewingSubmission}
                    containerStyles={{ marginTop: 30 }}
                  />
                </View>
              ) : post && post.kind == PostKind.video ? (
                <View style={{ marginTop: 20 }}>
                  <HeightAdjustedVideo
                    videoURL={post.video}
                    setVideoURL={() => {}}
                    visible={false}
                    autoplay={false}
                    clearable={false}
                  />
                  <PostNavigationBottom
                    setViewingSubmission={setViewingSubmission}
                    containerStyles={{ marginTop: 30 }}
                  />
                </View>
              ) : post && post.kind == PostKind.youtube ? (
                <View style={{ marginTop: SCREEN_WIDTH * 0.2 }}>
                  <YoutubePlayer
                    youtubeId={post.youtubeId}
                    containerWidth={imageSize}
                    webviewStyles={{}}
                  />
                  <PostNavigationBottom
                    setViewingSubmission={setViewingSubmission}
                    containerStyles={{ marginTop: SCREEN_WIDTH * 0.2 }}
                  />
                </View>
              ) : (
                <ArenaSinglePostViewListAudioPlayer
                  post={post as any}
                  setViewingSubmission={setViewingSubmission}
                />
              )}
            </View>
          </View>
        </ScrollView>

        <View>
          {canVote ? (
            <LightButton
              submit={() => onSubmitVote(submission)}
              title={"SUBMIT VOTE"}
              style={{
                backgroundColor: colors.purple,
                borderColor: colors.purple,
              }}
              loading={false}
            />
          ) : (
            <View />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

export const PostNavigationBottom = ({
  setViewingSubmission,
  containerStyles,
}) => {
  // tara here now this gets messed up with link submissions
  const { canPressNext, canPressPrev, playNext, playPrev } =
    useTrackPlayerContext();

  const onPressNext = async () => {
    let next = await playNext();
    setViewingSubmission(next);
  };

  const onPressPrev = async () => {
    let prev = await playPrev();
    setViewingSubmission(prev);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
        ...containerStyles,
      }}
    >
      <TouchableOpacity style={{ marginRight: 30 }} onPress={onPressPrev}>
        <AntDesign
          name="stepbackward"
          size={30}
          color={canPressPrev ? colors.purple : "rgba(256, 256, 256, 0.5)"}
        />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 65,
          height: 65,
          borderRadius: 65 / 2,
        }}
      ></View>
      <TouchableOpacity style={{ marginLeft: 30 }} onPress={onPressNext}>
        <AntDesign
          name="stepforward"
          size={30}
          color={canPressNext ? colors.purple : "rgba(256, 256, 256, 0.5)"}
        />
      </TouchableOpacity>
    </View>
  );
};
