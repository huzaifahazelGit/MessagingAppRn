import { Ionicons } from "@expo/vector-icons";
import { GiphyMediaView } from "@giphy/react-native-sdk";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import CommentLikeButton from "../../components/buttons/like-comment-button";
import ProfileImage from "../../components/images/profile-image";
import { BodyText, BoldText, LightText } from "../../components/text";
import { colors } from "../../constants/colors";
import { Comment } from "../../models/post";
import { SCREEN_WIDTH } from "../../constants/utils";
import { PostText } from "../post-item/post-text";
import { useMe } from "../../hooks/useMe";
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { DEFAULT_PROFILE_COLORS } from "../../hooks/useProfileColors";

export default function CommentsList({
  comments,
  subComments,
  selectedComment,
  setSelectedComment,
  textColor,
  onPressUser,
}) {
  if (selectedComment && !selectedComment.parentCommentId) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <BoldText style={{ color: textColor }}>Reply to:</BoldText>
          <TouchableOpacity
            onPress={() => setSelectedComment(null)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <LightText
              style={{ opacity: 0.7, marginRight: 4, color: textColor }}
            >
              cancel
            </LightText>
            <Ionicons
              name="close"
              size={18}
              color="black"
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>
        </View>

        <CommentDisplayWithSubComments
          comment={selectedComment}
          isReplyOpen={true}
          isSubComment={selectedComment.parentCommentId != null}
          setSelectedComment={setSelectedComment}
          subComments={subComments}
          textColor={textColor}
          onPressUser={onPressUser}
        />
      </View>
    );
  }
  return (
    <View>
      {(comments || []).map((item) => (
        <CommentDisplayWithSubComments
          key={item.id}
          comment={item}
          isReplyOpen={false}
          isSubComment={false}
          setSelectedComment={setSelectedComment}
          subComments={subComments}
          textColor={textColor}
          onPressUser={onPressUser}
        />
      ))}
    </View>
  );
}

function CommentDisplayWithSubComments({
  comment,
  subComments,
  setSelectedComment,
  isSubComment,
  textColor,
  onPressUser,
  isReplyOpen,
}) {
  return (
    <View>
      <CommentDisplay
        comment={comment}
        isSubComment={isSubComment}
        setSelectedComment={setSelectedComment}
        small={false}
        textColor={textColor}
        onPressUser={onPressUser}
        isReplyOpen={isReplyOpen}
      />

      <View
        style={{
          marginLeft: 60,
        }}
      >
        {(subComments || [])
          .filter((item) => item.parentCommentId == comment.id)
          .map((item) => (
            <CommentDisplay
              key={`sub-${item.id}`}
              comment={item}
              isSubComment={true}
              setSelectedComment={setSelectedComment}
              small={true}
              textColor={textColor}
              onPressUser={onPressUser}
              isReplyOpen={isReplyOpen}
            />
          ))}
      </View>
    </View>
  );
}

function CommentDisplay({
  comment,
  isSubComment,
  setSelectedComment,
  small,
  textColor,
  onPressUser,
  isReplyOpen,
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    let userRef = doc(getFirestore(), "users", comment.userId);
    const user = await getDoc(userRef);
    setUser({ ...user.data(), id: user.id });
  };

  return (
    <View
      style={{
        flexDirection: "row",

        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <TouchableOpacity onPress={() => onPressUser(comment.userId)}>
        {user ? (
          <ProfileImage
            size={small ? 30 : 40}
            // @ts-ignore
            user={{ id: user.id, profilePicture: user.profilePicture }}
          />
        ) : (
          <View style={{ width: small ? 30 : 40, height: small ? 30 : 40 }} />
        )}
      </TouchableOpacity>

      <View
        style={{
          marginLeft: 12,
          width: small ? SCREEN_WIDTH - 75 - 50 : SCREEN_WIDTH - 75,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
            marginTop: small ? -6 : 0,
          }}
        >
          <TouchableOpacity onPress={() => onPressUser(comment.userId)}>
            <BoldText
              style={{
                opacity: textColor == colors.black ? 0.5 : 1,
                fontSize: 12,
                color: textColor,
              }}
            >
              {comment.username}
            </BoldText>
          </TouchableOpacity>
          {!isReplyOpen && (
            <CommentButtons
              isSubComment={isSubComment}
              comment={comment}
              setSelectedComment={setSelectedComment}
              textColor={textColor}
            />
          )}
        </View>

        {comment.giphy && (
          <View
            style={{ marginVertical: 4, marginBottom: comment.text ? 8 : 4 }}
          >
            <GiphyMediaView
              media={comment.giphy}
              style={{ aspectRatio: comment.giphy.aspectRatio }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Image
                source={require("../../../assets/giphy.png")}
                style={{
                  width: 140,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
        <PostText
          text={comment.text}
          fontsize={14}
          textColorOverride={textColor}
        />
      </View>
    </View>
  );
}

function CommentButtons({
  comment,
  setSelectedComment,
  textColor,
  isSubComment,
}: {
  comment: Comment;
  setSelectedComment: any;
  textColor: string;
  isSubComment: boolean;
}) {
  const me = useMe();

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {comment.userId == me.id && (
        <TouchableOpacity
          style={{}}
          onPress={async () => {
            let docRef = doc(
              getFirestore(),
              "posts",
              comment.postId,
              "comments",
              comment.id
            );
            await deleteDoc(docRef);
            Toast.show({
              type: "success",
              text1: "Comment deleted",
              visibilityTime: 1000,
            });
          }}
        >
          <BodyText
            style={{
              opacity: 0.5,
              fontSize: 12,
              marginRight: 8,
              color: textColor,
            }}
          >
            DELETE
          </BodyText>
        </TouchableOpacity>
      )}

      {!(isSubComment && comment.userId == me.id) && (
        <TouchableOpacity
          style={{}}
          onPress={() => {
            setSelectedComment(comment);
          }}
        >
          <BodyText
            style={{
              opacity: 0.5,
              fontSize: 12,
              marginRight: 8,
              color: textColor,
            }}
          >
            REPLY
          </BodyText>
        </TouchableOpacity>
      )}

      {comment.likeCount > 0 && (
        <View style={{ marginRight: 8 }}>
          <BodyText
            style={{ opacity: 0.5, fontSize: 12, color: textColor }}
          >{`${comment.likeCount} LIKE${
            comment.likeCount == 1 ? "" : "s"
          }`}</BodyText>
        </View>
      )}

      <CommentLikeButton
        comment={comment}
        profileColors={{ ...DEFAULT_PROFILE_COLORS, textColor: textColor }}
      />
    </View>
  );
}
