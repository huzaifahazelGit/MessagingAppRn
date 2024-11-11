import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, View } from "react-native";
import Share from "react-native-share";
import Toast from "react-native-toast-message";
import { captureRef } from "react-native-view-shot";
import {
  SoundcloudPlayer,
  YoutubePlayer,
} from "../../components/audio/links-players";
import PostAudioPlayer from "../../components/audio/post-audio-player";
import { SpotifyPlayer } from "../../components/audio/spotify-player";
import { LikeStatus } from "../../components/buttons/like-button";
import DoubleTap from "../../components/double-tap";
import HeightAdjustedVideo from "../../components/height-adjusted-video";
import ReloadableImage from "../../components/images/reloadable-image";
import { AddToJukeboxModal } from "../../components/modals/add-to-jukebox-modal";
import { CommentsModal } from "../../components/modals/comments-modal";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IMAGEKIT_FULL_REPLACE } from "../../constants/env";
import { IS_IOS, SCREEN_WIDTH } from "../../constants/utils";
import { useCompanyForId } from "../../hooks/useCompanies";
import { useMe } from "../../hooks/useMe";
import { useUserForId } from "../../hooks/useUsers";
import { Company } from "../../models/company";
import { Post } from "../../models/post";
import { bodyTextForKind } from "../../services/activity-service";
import { createPostLink } from "../../services/link-service";
import { PostButtons } from "./post-buttons";
import { PostFooter } from "./post-footer";
import { PostHeader } from "./post-header";
import { VideoPostItem } from "./post-item-large";
import { PostText } from "./post-text";
import { RepostIcon } from "./repost-icon";

export function PostItem({
  post,
  profileId,
  preview,
  hideFooter,
  marketplace,
  chat,
  onDelete,
  visible,
  skipAutoPlay,
}: {
  post: Post;
  profileId?: string;
  preview?: boolean;
  hideFooter?: boolean;
  marketplace?: boolean;
  chat?: boolean;
  onDelete: any;
  visible: boolean;
  skipAutoPlay?: boolean;
}) {
  const userId = profileId ? profileId : post.userId;
  const user = useUserForId(userId);
  const IMAGE_WIDTH = SCREEN_WIDTH - 24;
  const viewRef = useRef(null);
  const [takingScreenshot, setTakingScreenshot] = useState(false);
  const [takingRepostScreenshot, setTakingRepostScreenshot] = useState(false);
  const [hasInstagramInstalled, setHasInstagramInstalled] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAddToJukebox, setShowAddToJukebox] = useState(false);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    like: null,
    loaded: false,
    overrideNumLikes: 0,
  });
  const me = useMe();
  const navigation = useNavigation();

  useEffect(() => {
    if (IS_IOS) {
      Linking.canOpenURL("instagram://").then((val) =>
        setHasInstagramInstalled(val)
      );
    } else {
      Share.isPackageInstalled("com.instagram.android").then(
        ({ isInstalled }) => setHasInstagramInstalled(isInstalled)
      );
    }
  }, []);

  const buttonColor = useMemo(() => {
    return profileId && user && user.buttonColor
      ? user.buttonColor
      : colors.blue;
  }, [user, profileId]);

  const backgroundColor = useMemo(() => {
    return profileId && user && user.backgroundColor
      ? user.backgroundColor
      : colors.black;
  }, [user, profileId]);

  const textColor = useMemo(() => {
    return profileId && user && user.textColor ? user.textColor : colors.white;
  }, [user, profileId]);

  const profileColors = useMemo(() => {
    return {
      buttonColor,
      backgroundColor,
      textColor,
    };
  }, [buttonColor, backgroundColor, textColor]);

  const tagsColor = useMemo(() => {
    return profileId && user && user.buttonColor
      ? user.buttonColor
      : colors.purple;
  }, [user, profileId]);

  const collaboratorId = useMemo(() => {
    if (post.collaboratorIds && post.collaboratorIds.length > 1) {
      return post.collaboratorIds.find((id) => id !== userId);
    }
    return null;
  }, [post]);

  const collaborator = useUserForId(collaboratorId);
  const companyCollaborator = useCompanyForId(collaboratorId);

  const postUsers = useMemo(() => {
    if (collaborator) {
      return [user, collaborator];
    } else if (user) {
      return [user];
    }
    return [];
  }, [user, collaborator]);

  const onShare = async () => {
    let link = createPostLink(post.id, me.id);

    setTakingScreenshot(true);
    setTimeout(async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 1,
        });
        setTakingScreenshot(false);

        if (hasInstagramInstalled) {
          await Share.shareSingle({
            appId: "179866765100477",
            stickerImage: uri,
            url: link,
            social: Share.Social.INSTAGRAM_STORIES,
            backgroundBottomColor:
              backgroundColor != colors.black ? "black" : colors.blue,
            backgroundTopColor:
              backgroundColor != colors.black ? "black" : colors.blue,
          });
        } else {
          await Share.open({ url: uri, message: link });
        }

        await updateDoc(doc(getFirestore(), "posts", post.id), {
          shareCount: increment(1),
        });

        if (post.userId != me.id || (post.shareCount || 0) < 1) {
          let newXp = {
            points: 1,
            kind: "postShare",
            userId: post.userId,
            postId: post.id,
            timeCreated: new Date(),
          };
          await addDoc(
            collection(getFirestore(), "users", post.userId, "xp"),
            newXp
          );
        }
      } catch (error) {
        console.log("error 7");
        console.log(error);
      }
    }, 500);
  };

  const shouldShowPostButtons = useMemo(() => {
    if (preview || chat) {
      return false;
    }
    return true;
  }, [preview, chat]);

  const shouldShowPostFooter = useMemo(() => {
    if (preview || hideFooter || chat) {
      return false;
    }
    return true;
  }, [preview, hideFooter, chat]);

  const shouldShowPostDescription = useMemo(() => {
    return post.description != "" || (post.tags || []).length > 0;
  }, [post]);

  const toggleLike = async () => {
    if (me && me.id) {
      if (likeStatus.loaded) {
        if (likeStatus.like && likeStatus.like.id) {
          setLikeStatus({
            like: null,
            overrideNumLikes: -1,
            loaded: true,
          });

          await deleteDoc(doc(getFirestore(), "activity", likeStatus.like.id));
          updatePostCounts(true);
        } else {
          var createActivity = httpsCallable(getFunctions(), "createActivity");
          let activityKind = "post-like";
          createActivity({
            actor: {
              id: me.id,
              username: me.username,
              profilePicture: me.profilePicture,
            },
            recipientId: post.userId,
            kind: activityKind,
            post: {
              id: post.id,
              kind: post.kind,
              image: post.image,
            },
            bodyText: bodyTextForKind(activityKind, me),
            extraVars: {},
          })
            .then((result) => {
              if (result && result.data) {
                updatePostCounts(false);
                setLikeStatus({
                  like: (result.data as any).activity,
                  overrideNumLikes: 1,
                  loaded: true,
                });
              }
            })
            .catch((err) => {
              console.log("error", err);
            });
        }
      }
    }
  };

  const updatePostCounts = async (didDelete: boolean) => {
    let ref = doc(getFirestore(), "posts", post.id);

    let myAvatar = me.profilePicture ?? null;
    if (didDelete) {
      await updateDoc(ref, {
        likeCount: increment(-1),
        likedAvatars: arrayRemove(myAvatar),
      });
    } else {
      if ((post.likedAvatars || []).length < 5) {
        await updateDoc(ref, {
          likeCount: increment(1),
          likedAvatars: arrayUnion(myAvatar),
          lastInteractor: me.id,
        });
      } else {
        await updateDoc(ref, {
          likeCount: increment(1),
          lastInteractor: me.id,
        });
      }
    }
  };

  const confirmRepost = (company?: Company) => {
    Alert.alert(
      "Re-post to feed",
      // `Are you sure you want to post this to ${
      //   company ? `${company.name}'s` : "your"
      // } feed?`,
      `Are you sure you want to post this to your feed?`,
      [
        {
          text: "Yes",
          // onPress: () => repostToFeed(company),
          onPress: () => repostToFeed(null),
        },
        { text: "Cancel", style: "destructive" },
      ]
    );
  };

  const repostToFeed = async (company?: Company) => {
    let hasReachedPostLimit = false;
    if (company) {
      // skip
    } else {
      let startOfDay = moment().startOf("day").toDate();
      const q = query(
        collection(getFirestore(), "posts"),
        where("userId", "==", me.id),
        where("createdAt", ">=", startOfDay)
      );

      const snapshotOne = await getDocs(q);

      let posts = [];
      snapshotOne.forEach((doc) => {
        posts.push(doc.data());
      });

      posts = posts.filter((item) => !item.archived && item.reposted);
      hasReachedPostLimit = posts.length >= 3;
    }

    let basePost = {
      ...post,
      userId: me.id,
      username: me.username,
      createdate: new Date(),
      lastupdate: new Date(),
      likeCount: 0,
      commentCount: 0,
      likedAvatars: [],
      commentedAvatars: [],
      tags: [...post.tags, "repost"],
      featured: false,

      collaboratorIds: [me.id],
      downloadable: false,
      playlistIds: [],

      downloadCount: 0,
      repostCount: 0,
      shareCount: 0,
      coauthors: [],

      // repost data
      reposted: true,
      originalPostId: post.id,
      originalUserId: post.userId,
      originalUsername: post.username,
      originalPostTime: post.createdate,
    };
    delete basePost.id;

    var createActivity = httpsCallable(getFunctions(), "createActivity");

    if (hasReachedPostLimit) {
      Alert.alert(
        "You have reached your daily re-post limit. Please try again tomorrow."
      );
    } else if (company) {
      let res = await addDoc(collection(getFirestore(), "posts"), {
        ...basePost,
        companyId: company.id,
        collaboratorIds: [company.id],
        playlistIds: [company.id],
      });
      let newPost = {
        ...basePost,
        id: res.id,
      };

      let activityKind = "company-post-repost";
      createActivity({
        actor: {
          id: company.id,
          username: company.name,
          profilePicture: company.profilePicture,
        },
        recipientId: post.userId,
        kind: activityKind,
        post: {
          id: newPost.id,
          kind: newPost.kind,
          image: newPost.image,
        },
        bodyText: bodyTextForKind(activityKind, me, company.name),
        extraVars: {},
      })
        .then((result) => {
          Toast.show({ type: "success", text1: "Repost successful!" });
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      let res = await addDoc(collection(getFirestore(), "posts"), {
        ...basePost,
      });

      const userRef = doc(getFirestore(), "users", me.id);
      await updateDoc(userRef, {
        lastReset: new Date(),
        postCount: increment(1),
      });

      let newPost = {
        ...basePost,
        id: res.id,
      };

      let activityKind = "post-repost";
      createActivity({
        actor: {
          id: me.id,
          username: me.username,
          profilePicture: me.profilePicture,
        },
        recipientId: post.userId,
        kind: activityKind,
        post: {
          id: newPost.id,
          kind: newPost.kind,
          image: newPost.image,
        },
        bodyText: bodyTextForKind(activityKind, me),
        extraVars: {},
      })
        .then((result) => {
          Toast.show({ type: "success", text1: "Repost successful!" });
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  };

  const shareToStories = async () => {
    setTakingRepostScreenshot(true);
    setTakingScreenshot(true);
    setTimeout(async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 1,
        });
        setTakingScreenshot(false);
        setTakingRepostScreenshot(false);
        (navigation as any).navigate("Sessions", {
          screen: "SessionEdit",
          params: {
            videoURL: null,
            imageURL: uri,
            duration: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            postJSON: JSON.stringify(post),
            postId: post.id,
          },
        });
      } catch (error) {
        console.log("error 7");
        console.log(error);
      }
    }, 500);
  };

  const mainUser = useMemo(() => {
    if (post && post.userId) {
      return (postUsers || []).find((u) => u && u.id === post.userId);
    }
    return null;
  }, [postUsers, post]);

  if (!post) {
    return <View />;
  }

  if (post && post.video && !marketplace && !chat && !profileId) {
    return (
      <DoubleTap onDoubleTap={toggleLike}>
        <View ref={viewRef}>
          <VideoPostItem
            post={post}
            profileColors={profileColors}
            postUsers={postUsers}
            shouldShowPostButtons={shouldShowPostButtons}
            shouldShowPostDescription={shouldShowPostDescription}
            shouldShowPostHeader={true}
            onDelete={onDelete}
            onShare={onShare}
            visible={visible}
            setShowComments={setShowComments}
            likeStatus={likeStatus}
            setLikeStatus={setLikeStatus}
            takingScreenshot={takingScreenshot}
            shareToStories={shareToStories}
            repostToFeed={confirmRepost}
          />
          <RepostIcon post={post} bottomLeft={true} />
          {takingScreenshot && !takingRepostScreenshot && (
            <DownloadRealmSplash />
          )}

          {takingScreenshot && takingRepostScreenshot && (
            <UsernameSplash
              username={mainUser ? mainUser.username : post.username}
            />
          )}
          <CommentsModal
            post={post}
            marketplace={marketplace}
            showComments={showComments}
            setShowComments={setShowComments}
          />
        </View>
      </DoubleTap>
    );
  }

  return (
    <DoubleTap onDoubleTap={toggleLike}>
      <View>
        <View ref={viewRef}>
          <View
            style={{
              backgroundColor: takingScreenshot
                ? "transparent"
                : profileId
                ? "transparent"
                : colors.black,

              borderRadius: 4,
              marginVertical: 8,
              paddingHorizontal: takingScreenshot ? 0 : 12,
              paddingBottom: 12,
              paddingTop: 12,
              marginHorizontal: 0,
            }}
          >
            <View
              style={{
                backgroundColor: takingScreenshot
                  ? backgroundColor
                  : "transparent",
                paddingVertical: takingScreenshot ? 20 : 0,
                paddingHorizontal: takingScreenshot ? 12 : 0,
              }}
            >
              <PostHeader
                users={postUsers}
                post={post}
                profile={profileId ? true : false}
                chat={chat}
                userId={userId}
                onDelete={onDelete}
                shareToStories={shareToStories}
                repostToFeed={confirmRepost}
                setShowAddToJukebox={setShowAddToJukebox}
              />

              <View>
                {post.audio ? (
                  <PostAudioPlayer
                    post={post}
                    user={profileId ? user : null}
                    visible={visible}
                    skipAutoPlay={skipAutoPlay}
                  />
                ) : post.video ? (
                  <View
                    style={{
                      width: IMAGE_WIDTH,
                    }}
                  >
                    <HeightAdjustedVideo
                      videoURL={(post.video || "").replace(
                        "https://firebasestorage.googleapis.com/",
                        IMAGEKIT_FULL_REPLACE
                      )}
                      visible={visible}
                      setVideoURL={() => {}}
                      clearable={false}
                      fullWidth={IMAGE_WIDTH}
                      post={post}
                      user={profileId ? user : null}
                    />
                  </View>
                ) : post.spotifyId ? (
                  <SpotifyPlayer
                    spotifyId={post.spotifyId}
                    containerWidth={IMAGE_WIDTH}
                    post={post}
                    smallVersion={false}
                    textColorOverride={textColor}
                    buttonColorOverride={profileId ? "white" : colors.blue}
                  />
                ) : post.youtubeId ? (
                  <YoutubePlayer
                    youtubeId={post.youtubeId}
                    containerWidth={IMAGE_WIDTH}
                    webviewStyles={{ marginBottom: 12, marginTop: 6 }}
                  />
                ) : post.soundcloudLink ? (
                  <SoundcloudPlayer
                    soundcloudLink={post.soundcloudLink}
                    containerWidth={IMAGE_WIDTH}
                    webviewStyles={{ marginBottom: 12, marginTop: 6 }}
                  />
                ) : post.image ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <ReloadableImage
                      imageURL={post.image}
                      fullWidth={IMAGE_WIDTH}
                    />
                  </View>
                ) : (
                  <View style={{ height: 12 }} />
                )}

                <RepostIcon post={post} />
              </View>

              {shouldShowPostDescription ? (
                <View>
                  <PostText
                    text={post.description}
                    profile={profileId ? true : false}
                    user={user}
                  />
                  {(post.tags || []).length > 0 && (
                    <BodyText style={{ color: tagsColor }}>
                      {`#${post.tags.join(" #")}`}
                    </BodyText>
                  )}
                </View>
              ) : (
                <View />
              )}
            </View>
            {takingScreenshot && !takingRepostScreenshot && (
              <DownloadRealmSplash />
            )}

            {takingScreenshot && takingRepostScreenshot && (
              <UsernameSplash
                username={mainUser ? mainUser.username : post.username}
              />
            )}

            {!takingScreenshot && (
              <View>
                {marketplace &&
                (post as any).budget &&
                (post as any).budget > 0 ? (
                  <View style={{ marginTop: 12 }}>
                    <BodyText style={{ opacity: 0.6, color: textColor }}>{`$${
                      (post as any).budget > 1 ? "$" : ""
                    }${(post as any).budget > 2 ? "$" : ""}${
                      (post as any).budget > 3 ? "$" : ""
                    }`}</BodyText>
                  </View>
                ) : (
                  <View />
                )}

                {/* {companyCollaborator && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Pressable
                      style={{}}
                      onPress={() => {
                        // (navigation as any).navigate("ProfileStack", {
                        //   screen: "ProfileScreen",
                        //   params: { userId: item.id },
                        // });
                      }}
                    >
                      <BoldMonoText style={{ color: textColor }}>
                        with
                        <BoldMonoText
                          style={{ color: colors.blue }}
                        >{` ${companyCollaborator.name}`}</BoldMonoText>
                      </BoldMonoText>
                    </Pressable>
                  </View>
                )} */}

                {shouldShowPostButtons && (
                  <PostButtons
                    post={post}
                    user={user}
                    profileColors={profileColors}
                    onRepost={confirmRepost}
                    onShare={onShare}
                    setShowComments={setShowComments}
                    likeStatus={likeStatus}
                    setLikeStatus={setLikeStatus}
                  />
                )}

                {shouldShowPostFooter && (
                  <PostFooter
                    post={post}
                    user={user}
                    profileColors={profileColors}
                    setShowComments={setShowComments}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        <CommentsModal
          post={post}
          marketplace={marketplace}
          showComments={showComments}
          setShowComments={setShowComments}
        />

        <AddToJukeboxModal
          post={post}
          showModal={showAddToJukebox}
          setShowModal={setShowAddToJukebox}
          onSaveToJukebox={() => {}}
        />
      </View>
    </DoubleTap>
  );
}

const UsernameSplash = ({ username }) => {
  return (
    <View
      style={{
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderBottomColor: "white",
          borderBottomWidth: 1,
        }}
      >
        <BoldMonoText style={{ fontSize: 18 }}>{`@${username}`}</BoldMonoText>
      </View>

      <Entypo
        name="chevron-right"
        size={18}
        color="white"
        style={{ marginLeft: 4 }}
      />
    </View>
  );
};

const DownloadRealmSplash = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 18,
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <BoldMonoText>{`Download`}</BoldMonoText>
        <Image
          style={{ height: 34, width: 130 }}
          source={require("../../../assets/icon-title.png")}
          contentFit="contain"
        />
        <BoldMonoText>{`at`}</BoldMonoText>
      </View>
      <BoldMonoText
        style={{ paddingHorizontal: 20 }}
      >{`realmwrld.com`}</BoldMonoText>
    </View>
  );
};
