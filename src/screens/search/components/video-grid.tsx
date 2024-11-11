import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldMonoText } from "../../../components/text";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";
import { Post } from "../../../models/post";
import { Challenge } from "../../../models/challenge";
import { LinearGradient } from "expo-linear-gradient";
import { Fonts } from "../../../constants/fonts";

export default function VideoGrid({
  featuredPosts,
}: {
  featuredPosts: Post[];
}) {
  const restOfPosts = useMemo(() => {
    if (featuredPosts.length < 4) {
      return featuredPosts;
    } else {
      return (featuredPosts || []).slice(4);
    }
  }, [featuredPosts]);

  return (
    <View>
      {featuredPosts.length > 3 && <GridTopRow featuredPosts={featuredPosts} />}

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {restOfPosts.map((post) => (
          <SingleSquare
            post={post}
            key={post.id}
            width={SCREEN_WIDTH / 2}
            height={SCREEN_WIDTH}
          />
        ))}
      </View>
    </View>
  );
}

function GridTopRow({ featuredPosts }: { featuredPosts: Post[] }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View>
        <SingleSquare
          post={featuredPosts[0]}
          key={featuredPosts[0].id}
          height={SCREEN_WIDTH / 2}
          width={SCREEN_WIDTH / 2}
        />
        <SingleSquare
          post={featuredPosts[1]}
          key={featuredPosts[1].id}
          height={SCREEN_WIDTH}
          width={SCREEN_WIDTH / 2}
        />
      </View>
      <View>
        <SingleSquare
          post={featuredPosts[2]}
          key={featuredPosts[2].id}
          height={SCREEN_WIDTH}
          width={SCREEN_WIDTH / 2}
        />
        <SingleSquare
          post={featuredPosts[3]}
          key={featuredPosts[3].id}
          height={SCREEN_WIDTH / 2}
          width={SCREEN_WIDTH / 2}
        />
      </View>
    </View>
  );
}

function SingleSquare({
  post,
  height,
  width,
}: {
  post: Post;
  height?: number;
  width?: number;
}) {
  const navigation = useNavigation();
  let imageUrl = useMemo(() => {
    return post.image ? post.image : "";
  }, [post]);

  return (
    <Pressable
      onPress={() => {
        (navigation as any).navigate("PostDetail", {
          postId: post.id,
        });
      }}
      style={{ backgroundColor: "white" }}
    >
      <Image
        style={{
          width: width ? width : SCREEN_WIDTH / 2,
          height: height ? height : SCREEN_WIDTH / 2,
        }}
        source={{
          uri: imageUrl,
        }}
      />
      <LinearGradient
        style={{
          width: width ? width : SCREEN_WIDTH / 2,
          height: height ? height : SCREEN_WIDTH / 2,
          marginTop: -1 * (height ? height : SCREEN_WIDTH / 2),
          justifyContent: "flex-end",
          padding: 8,
        }}
        colors={["transparent", "rgba(0, 0, 0, 0.9)"]}
      >
        <BodyText numLines={2} style={{ fontFamily: Fonts.MonoBold }}>
          {post.description}
        </BodyText>
      </LinearGradient>
    </Pressable>
  );
}
