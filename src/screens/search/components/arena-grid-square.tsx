import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";

import { SCREEN_WIDTH } from "../../../constants/utils";
import { Challenge } from "../../../models/challenge";

export default function ArenaGrid({ challenges }: { challenges: Challenge[] }) {
  const firstPosts = useMemo(() => {
    return [...(challenges || [])].filter((item) => !item.complete).slice(0, 3);
  }, [challenges]);

  const restOfPosts = useMemo(() => {
    return [...(challenges || [])].slice(3);
  }, [challenges]);

  return (
    <View>
      <GridTopRow challenges={firstPosts} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {restOfPosts.map((post) => (
          <SingleSquare challenge={post} key={post.id} />
        ))}
      </View>
    </View>
  );
}
function GridTopRow({ challenges }: { challenges: Challenge[] }) {
  const postOne = useMemo(() => {
    if (challenges.length > 0) {
      return challenges[0];
    }
    return null;
  }, [challenges]);

  const remainingPosts = useMemo(() => {
    return challenges.slice(1, 3);
  }, [challenges]);

  return (
    <View style={{ flexDirection: "row" }}>
      {postOne ? (
        <SingleSquare challenge={postOne} height={SCREEN_WIDTH} />
      ) : (
        <View />
      )}

      <View>
        {remainingPosts.map((post) => (
          <SingleSquare challenge={post} key={post.id} />
        ))}
      </View>
    </View>
  );
}

function SingleSquare({
  challenge,
  height,
  width,
}: {
  challenge: Challenge;
  height?: number;
  width?: number;
}) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        (navigation as any).navigate("ArenaDetails", {
          screen: "ArenaDetailScreen",
          params: {
            challengeId: challenge.id,
          },
        });
      }}
    >
      <Image
        style={{
          width: width ? width : SCREEN_WIDTH / 2,
          height: height ? height : SCREEN_WIDTH / 2,
        }}
        source={{
          uri: challenge.coverImage,
        }}
      />
    </Pressable>
  );
}
