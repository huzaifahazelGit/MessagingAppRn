import { Feather } from "@expo/vector-icons";
import { GiphyMedia, GiphyMediaView } from "@giphy/react-native-sdk";
import { increment } from "firebase/firestore";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Part,
  isMentionPartType,
  parseValue,
  replaceMentionValues,
} from "react-native-controlled-mentions";
import { InputWithMentions } from "../../components/inputs/mention-input";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { BasePostItem } from "../../models/base-post";
import { Comment } from "../../models/post";
import { bodyTextForKind } from "../../services/activity-service";

export default function CommentInput({
  postId,
  post,
  selectedComment,
  setSelectedComment,
  showGiphy,
  media,
  setMedia,
  comment,
  setComment,
  placeholderColor,
  textColor,
  setShowComments,
}: {
  postId: string;
  post: BasePostItem;
  selectedComment: Comment | null;
  setSelectedComment: any;
  showGiphy: any;
  media?: GiphyMedia | null;
  setMedia: any;
  comment: string;
  setComment: any;
  placeholderColor: string;
  textColor: string;
  setShowComments: any;
}) {
  const [focused, setFocused] = useState(false);
  const me = useMe();

  let base = post.marketplace ? "marketplace" : "posts";

  const createComment = async () => {
    if (comment.length > 0 || media) {
      let newComment: Comment = {
        giphy: media
          ? {
              url: media.url,
              aspectRatio: media.aspectRatio,
              isDynamic: media.isDynamic,
              isVideo: media.isVideo,
              id: media.id,
              data: null,
            }
          : null,
        text: comment,
        userId: me.id,
        avatar: me.profilePicture,
        username: me.username,
        createdate: new Date(),
        postId: postId,
        lastupdate: new Date(),
        archived: false,
        likeCount: 0,
        parentCommentId: selectedComment ? selectedComment.id : null,
        likedAvatars: [],
      };
      const { parts } = parseValue(post.description, [
        {
          trigger: "@",
        },
      ]);

      let res = await addDoc(
        collection(getFirestore(), base, postId, "comments"),
        {
          ...newComment,
        }
      );

      parts.forEach((part: Part) => {
        if (part.partType && isMentionPartType(part.partType)) {
          let userId = part.data?.id;
          createMentionActivity(userId, { ...newComment, id: res.id });
        }
      });

      if (post.userId != me.id) {
        await createNewActivity({ ...newComment, id: res.id });
      }

      await updateUser();
      await updatePost();

      setSelectedComment(null);
      setComment("");
      setMedia(null);
      setShowComments(false);
    }
  };

  const updateUser = async () => {
    const userRef = doc(getFirestore(), "users", me.id);
    updateDoc(userRef, {
      lastReset: new Date(),
      lastActive: new Date(),
    });
  };

  const createMentionActivity = async (userId: string, comment: Comment) => {
    if (userId != me.id) {
      var createActivity = httpsCallable(getFunctions(), "createActivity");
      let activityKind = "comment-mention";
      createActivity({
        actor: {
          id: me.id,
          username: me.username,
          profilePicture: me.profilePicture,
        },
        recipientId: userId,
        kind: activityKind,
        post: {
          id: post.id,
          kind: post.kind,
          image: post.image,
        },
        bodyText: bodyTextForKind(activityKind, me),
        extraVars: {
          commentId: comment.id,
          commentText: replaceMentionValues(
            comment.text,
            ({ name }) => `@${name}`
          ),
        },
      });
    }
  };

  const createNewActivity = async (comment: Comment) => {
    if (post.userId != me.id) {
      var createActivity = httpsCallable(getFunctions(), "createActivity");
      let activityKind = "post-comment";
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
        extraVars: {
          commentId: comment.id,
          commentText: replaceMentionValues(
            comment.text,
            ({ name }) => `@${name}`
          ),
        },
      });
    }
  };

  const updatePost = async () => {
    let ref = doc(getFirestore(), "posts", postId);

    let myAvatar = me.profilePicture ?? null;
    if ((post.commentedAvatars || []).length < 5) {
      await updateDoc(ref, {
        commentCount: increment(1),
        commentedAvatars: arrayUnion(myAvatar),
        lastInteractor: me.id,
      });
    } else {
      await updateDoc(ref, {
        commentCount: increment(1),
        lastInteractor: me.id,
      });
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
      >
        <TouchableOpacity
          style={{ paddingBottom: 12, paddingRight: 8 }}
          onPress={() => {
            try {
              showGiphy();
            } catch (err) {
              console.log("err", err);
            }
          }}
        >
          <Feather name="plus-circle" size={24} color={placeholderColor} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            borderColor: placeholderColor,
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          {media && (
            <ScrollView
              style={{
                aspectRatio: media.aspectRatio,
                maxHeight: 400,
                padding: 12,
                width: "100%",
              }}
            >
              <GiphyMediaView
                media={media}
                style={{ aspectRatio: media.aspectRatio }}
              />
            </ScrollView>
          )}
          <InputWithMentions
            focused={focused}
            setFocused={setFocused}
            placeholder={
              selectedComment ? "Reply to comment..." : "Add a comment..."
            }
            suggestionsStyles={{
              bottom: 40,
              width: SCREEN_WIDTH - 90,
            }}
            description={comment}
            setDescription={setComment}
            inputStyles={{
              paddingHorizontal: 8,
              paddingVertical: 12,
              paddingTop: 12,
              fontFamily: Fonts.Regular,
              color: textColor,
            }}
            placeholderColor={placeholderColor}
          />

          {media && (
            <View
              style={{ position: "absolute", right: 0, top: 0, padding: 12 }}
            >
              <TouchableOpacity style={{}} onPress={() => setMedia(null)}>
                <Feather name="x-circle" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={{ paddingLeft: 8, paddingBottom: 12, paddingRight: 4 }}
            onPress={createComment}
          >
            <Feather
              name="send"
              size={24}
              color={comment.length > 0 || media ? colors.blue : "gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
