import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import ProfileImage from "../../components/images/profile-image";
import { BoldMonoText } from "../../components/text";
import { useUserForId } from "../../hooks/useUsers";
import { Post } from "../../models/post";

export const RepostIcon = ({
  post,
  bottomLeft,
}: {
  post: Post;
  bottomLeft?: boolean;
}) => {
  const originalUserId = post ? post.originalUserId : null;
  const originalUser = useUserForId(originalUserId);
  const navigation = useNavigation();

  if (post && post.reposted) {
    return (
      <View
        style={
          bottomLeft
            ? {
                position: "absolute",
                bottom: 8,
                left: 0,
                flexDirection: "row",
              }
            : {
                position: "absolute",
                top:
                  post.spotifyId || post.soundcloudLink || post.youtubeId
                    ? 6
                    : 0,
                right:
                  post.spotifyId || post.soundcloudLink || post.youtubeId
                    ? 4
                    : 0,
                flexDirection: "row",
              }
        }
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            borderColor: "black",
            borderWidth: 0.5,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 8,
          }}
          onPress={() => {
            (navigation as any).navigate("PostDetail", {
              postId: post.originalPostId,
              marketplace: post.marketplace,
            });
          }}
        >
          <AntDesign
            name="retweet"
            size={16}
            color="black"
            style={{ marginRight: 6 }}
          />
          <ProfileImage size={20} user={originalUser} />
          <BoldMonoText
            style={{
              color: "black",
              fontSize: 15,
              marginLeft: 6,
            }}
          >
            {`${originalUser ? originalUser.username : post.originalUsername}`}
          </BoldMonoText>
        </TouchableOpacity>
      </View>
    );
  }

  return <View />;
};
