import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import AvatarList from "../../components/lists/avatar-list";
import { BodyText } from "../../components/text";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Post } from "../../models/post";
import { User } from "../../models/user";

export function PostFooter({
  post,
  user,
  profileColors,
  setShowComments,
}: {
  post: Post;
  user?: User;
  profileColors: ProfileColors;
  setShowComments: any;
}) {
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const likedAvatars = useMemo(() => {
    return post.likedAvatars || [];
  }, [post]);

  const numLikes = useMemo(() => {
    let num = post.likeCount;

    return num || 0;
  }, [post]);

  return (
    <View style={{}}>
      {likedAvatars.length > 1 ? (
        <View style={{ marginTop: 12 }}>
          <AvatarList avatars={likedAvatars} totalCount={numLikes} />
        </View>
      ) : (
        <View />
      )}

      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {post.commentCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                setShowComments(true);
              }}
            >
              <BodyText style={{ color: textColor, fontSize: 10 }}>{`VIEW ${
                post.commentCount
              } COMMENT${post.commentCount == 1 ? "" : "S"}`}</BodyText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
