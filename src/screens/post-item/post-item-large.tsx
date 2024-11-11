import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import HeightAdjustedVideo from "../../components/height-adjusted-video";
import { LikeStatus } from "../../components/buttons/like-button";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IMAGEKIT_FULL_REPLACE } from "../../constants/env";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useUserForId } from "../../hooks/useUsers";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { PostButtons } from "./post-buttons";
import { PostHeader } from "./post-header";
import { PostText } from "./post-text";
import { ProfileColors } from "../../hooks/useProfileColors";

export function VideoPostItem({
  post,
  postUsers,
  shouldShowPostButtons,
  shouldShowPostDescription,
  shouldShowPostHeader,
  onDelete,
  onShare,
  visible,
  setShowComments,
  likeStatus,
  setLikeStatus,
  takingScreenshot,
  shareToStories,
  repostToFeed,
  profileColors,
}: {
  post: Post;
  postUsers: User[];
  shouldShowPostButtons: boolean;
  shouldShowPostDescription: boolean;
  shouldShowPostHeader: boolean;
  onDelete: any;
  onShare: any;
  visible: boolean;
  setShowComments: any;
  likeStatus: LikeStatus;
  setLikeStatus: any;
  takingScreenshot: boolean;
  shareToStories: any;
  repostToFeed: any;
  profileColors: ProfileColors;
}) {
  const user = useUserForId(post.userId);

  if (post && post.video) {
    return (
      <View
        style={{
          marginVertical: 8,
        }}
      >
        <View
          style={{
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <HeightAdjustedVideo
            videoURL={(post.video || "").replace(
              "https://firebasestorage.googleapis.com/",
              IMAGEKIT_FULL_REPLACE
            )}
            setVideoURL={() => {}}
            clearable={false}
            fullWidth={SCREEN_WIDTH}
            visible={visible}
            post={post}
            backgroundImage={post.image}
          />
        </View>

        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: 100,
            borderTopStartRadius: 12,
            borderTopEndRadius: 12,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 12,
            width: SCREEN_WIDTH - 24,
          }}
        >
          <View
            style={{
              width: SCREEN_WIDTH - 24,

              paddingTop: 20,
            }}
          >
            {shouldShowPostHeader && (
              <PostHeader
                users={postUsers}
                post={post}
                userId={post.userId}
                profile={false}
                chat={false}
                maxWidth={SCREEN_WIDTH - 24}
                onDelete={onDelete}
                shareToStories={shareToStories}
                repostToFeed={repostToFeed}
                setShowAddToJukebox={() => {}}
              />
            )}
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: post.reposted ? 38 : 12,
            left: 0,
            width: SCREEN_WIDTH - 68,
          }}
        >
          {shouldShowPostDescription ? (
            <View
              style={{
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  maxHeight: 200,
                }}
              >
                <PostText
                  text={post.description}
                  profile={false}
                  user={user}
                  skipReadMore={true}
                />
                {post.tags.length > 0 && (
                  <BodyText style={{ color: colors.purple }}>
                    {` #${post.tags.join(" #")}`}
                  </BodyText>
                )}
              </Text>
            </View>
          ) : (
            <View />
          )}
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 70,
            right: 12,
            width: 55,
          }}
        >
          {shouldShowPostButtons && !takingScreenshot && (
            <PostButtons
              vertical={true}
              profileColors={profileColors}
              post={post}
              user={user}
              onShare={onShare}
              onRepost={repostToFeed}
              setShowComments={setShowComments}
              likeStatus={likeStatus}
              setLikeStatus={setLikeStatus}
            />
          )}
        </View>
      </View>
    );
  }
}
