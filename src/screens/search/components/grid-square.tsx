import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import ProfileImage from "../../../components/images/profile-image";
import { BodyText } from "../../../components/text";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";
import { Post } from "../../../models/post";

export default function Grid({ featuredPosts }: { featuredPosts: Post[] }) {
  const imagePosts = useMemo(() => {
    return (featuredPosts || []).filter(
      (item) =>
        (item.image && !item.videoThumbnail) ||
        (item.videoThumbnail && (!item.videoRatio || item.videoRatio < 1.6))
    );
  }, [featuredPosts]);

  const videoPost = useMemo(() => {
    let vidPosts = (featuredPosts || []).filter(
      (item) => item.videoThumbnail && item.videoRatio && item.videoRatio > 1.6
    );
    return vidPosts.length > 0 ? vidPosts[0] : null;
  }, [featuredPosts]);

  const secondVideoPost = useMemo(() => {
    let vidPosts = (featuredPosts || []).filter(
      (item) => item.videoThumbnail && item.videoRatio && item.videoRatio > 1.6
    );
    return vidPosts.length > 1 ? vidPosts[1] : null;
  }, [featuredPosts]);

  const textPost = useMemo(() => {
    let textPosts = featuredPosts.filter(
      (item) => !item.image && !item.audio && !item.video
    );
    return textPosts.length > 0 ? textPosts[0] : null;
  }, [featuredPosts]);

  const thrirdRowStartIndex = useMemo(() => {
    let start = 4;
    if (!videoPost) {
      start = start + 2;
    }
    if (!textPost) {
      start = start + 1;
    }
    start++;
    return start;
  }, [textPost, videoPost]);

  const thirdRowPosts = useMemo(() => {
    let usedImagePostIds = imagePosts
      .slice(0, thrirdRowStartIndex)
      .map((item) => item.id);

    let newImagePosts = (featuredPosts || []).filter((item) => item.image);

    newImagePosts = newImagePosts.filter(
      (item) =>
        !usedImagePostIds.includes(item.id) &&
        item.id !== videoPost?.id &&
        item.id !== secondVideoPost?.id
    );

    return newImagePosts;
  }, [
    featuredPosts,
    imagePosts,
    videoPost,
    secondVideoPost,
    thrirdRowStartIndex,
  ]);

  const startRestOfImagesIndex = useMemo(() => {
    let start = 4;
    if (!videoPost) {
      start = start + 2;
    }
    if (!textPost) {
      start = start + 1;
    }
    start = start + 1;
    if (!secondVideoPost) {
      start = start + 2;
    }
    start = start + 4;
    return start;
  }, [textPost, videoPost, secondVideoPost]);

  const restOfPosts = useMemo(() => {
    let usedImagePostIds = imagePosts
      .slice(0, startRestOfImagesIndex)
      .map((item) => item.id);

    let newImagePosts = (featuredPosts || []).filter((item) => item.image);

    newImagePosts = newImagePosts.filter(
      (item) =>
        !usedImagePostIds.includes(item.id) &&
        item.id !== videoPost?.id &&
        item.id !== secondVideoPost?.id
    );

    return newImagePosts;
  }, [
    featuredPosts,
    imagePosts,
    videoPost,
    secondVideoPost,
    startRestOfImagesIndex,
  ]);

  return (
    <View style={{}}>
      <GridTopRow imagePosts={imagePosts} videoPost={videoPost} />
      <GridSecondRow
        imagePosts={imagePosts}
        textPost={textPost}
        videoPost={videoPost}
      />
      <GridThirdRow imagePosts={thirdRowPosts} videoPost={secondVideoPost} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {restOfPosts.map((post) => (
          <SingleSquare post={post} key={post.id} />
        ))}
      </View>
    </View>
  );
}
function GridTopRow({
  imagePosts,
  videoPost,
}: {
  imagePosts: Post[];
  videoPost: Post;
}) {
  const nextTwoImagePosts = useMemo(() => {
    return [...imagePosts].slice(4, 6);
  }, [imagePosts]);

  return (
    <View
      style={{
        flexDirection: "row",
        maxHeight: (2 * SCREEN_WIDTH - 6) / 3,
        overflow: "hidden",
      }}
    >
      <GridFourSquare imagePosts={imagePosts} />
      {videoPost ? (
        <SingleSquare
          post={videoPost}
          key={videoPost.id}
          height={(2 * SCREEN_WIDTH - 6) / 3}
        />
      ) : (
        <View>
          {nextTwoImagePosts.map((post) => (
            <SingleSquare post={post} key={post.id} />
          ))}
        </View>
      )}
    </View>
  );
}

function GridSecondRow({
  imagePosts,
  textPost,
  videoPost,
}: {
  imagePosts: Post[];
  textPost: Post;
  videoPost: Post;
}) {
  const nextImageIndex = useMemo(() => {
    let start = 4;
    if (!videoPost) {
      start = start + 2;
    }
    return start;
  }, [videoPost]);

  const lastImageIndex = useMemo(() => {
    let start = nextImageIndex;
    if (!textPost) {
      start++;
    }
    return start;
  }, [textPost, nextImageIndex]);

  const widePost = useMemo(() => {
    if (textPost) {
      return null;
    }
    return imagePosts.length > nextImageIndex
      ? imagePosts[nextImageIndex]
      : null;
  }, [imagePosts, textPost, nextImageIndex]);

  const lastSmallPost = useMemo(() => {
    return imagePosts.length > lastImageIndex
      ? imagePosts[lastImageIndex]
      : null;
  }, [imagePosts, lastImageIndex]);

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <View
        style={{
          borderColor: "black",
          borderWidth: 1,
          maxHeight: (SCREEN_WIDTH - 3) / 3,
          overflow: "hidden",
        }}
      >
        {textPost ? (
          <TextPost post={textPost} width={((SCREEN_WIDTH - 6) * 2) / 3} />
        ) : widePost ? (
          <SingleSquare
            post={widePost}
            key={widePost.id}
            noBorder
            width={((SCREEN_WIDTH - 6) * 2) / 3}
          />
        ) : (
          <View />
        )}
      </View>
      {lastSmallPost ? (
        <SingleSquare post={lastSmallPost} key={lastSmallPost.id} />
      ) : (
        <View />
      )}
    </View>
  );
}

function GridThirdRow({
  imagePosts,
  videoPost,
}: {
  imagePosts: Post[];
  videoPost: Post;
}) {
  const nextTwoImagePosts = useMemo(() => {
    return [...imagePosts].slice(4, 6);
  }, [imagePosts]);

  return (
    <View style={{ flexDirection: "row" }}>
      {videoPost ? (
        <SingleSquare
          post={videoPost}
          key={videoPost.id}
          height={(2 * SCREEN_WIDTH - 6) / 3}
        />
      ) : (
        <View>
          {nextTwoImagePosts.map((post) => (
            <SingleSquare post={post} key={post.id} />
          ))}
        </View>
      )}
      <GridFourSquare imagePosts={imagePosts} />
    </View>
  );
}

function GridFourSquare({ imagePosts }: { imagePosts: Post[] }) {
  const firstTwoImagePosts = useMemo(() => {
    return [...imagePosts].slice(0, 2);
  }, [imagePosts]);

  const secondTwoImagePosts = useMemo(() => {
    return [...imagePosts].slice(2, 4);
  }, [imagePosts]);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        {firstTwoImagePosts.map((post) => (
          <SingleSquare post={post} key={post.id} />
        ))}
      </View>
      <View style={{ flexDirection: "row" }}>
        {secondTwoImagePosts.map((post) => (
          <SingleSquare post={post} key={post.id} />
        ))}
      </View>
    </View>
  );
}

function SingleSquare({
  post,
  height,
  width,
  noBorder,
}: {
  post: Post;
  height?: number;
  width?: number;
  noBorder?: boolean;
}) {
  const navigation = useNavigation();
  let imageUrl = useMemo(() => {
    return post.image ? post.image : "";
  }, [post]);

  let calculatedWidth = (SCREEN_WIDTH - 3) / 3;

  return (
    <Pressable
      onPress={() => {
        (navigation as any).navigate("PostDetail", {
          postId: post.id,
        });
      }}
    >
      <Image
        style={{
          borderColor: "black",
          borderWidth: noBorder ? 0 : 1,
          width: width ? width : calculatedWidth,
          height: height ? height : calculatedWidth,
        }}
        source={{
          uri: imageUrl,
        }}
      />
    </Pressable>
  );
}

export function TextPost({ post, width }: { post: Post; width: number }) {
  const [ready, setReady] = useState(false);
  const navigation = useNavigation();
  const userId = post && post.userId ? post.userId : DEFAULT_ID;

  const user = useUserForId(userId);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 800);
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          width: width,
          height: SCREEN_WIDTH / 3,
        }}
      ></View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("PostDetail", {
          postId: post.id,
          marketplace: post.marketplace,
        });
      }}
      style={{}}
    >
      <View
        style={{
          width: width,
          height: SCREEN_WIDTH / 3,
          backgroundColor: "#221f29",
          borderRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          {user ? (
            <ProfileImage user={user} size={22} />
          ) : (
            <View style={{ height: 22, width: 22 }} />
          )}
          <BodyText style={{ marginLeft: 8 }}>
            {user ? user.username : ""}
          </BodyText>
        </View>
        <View
          style={{
            marginLeft: 14,
            width: (width ? width : (2 * SCREEN_WIDTH) / 3) - 24,
            height: SCREEN_WIDTH / 3 - 58,
          }}
        >
          <BodyText
            style={{
              width: (width ? width : (2 * SCREEN_WIDTH) / 3) - 24,
            }}
            numLines={5}
          >
            {post.description}
          </BodyText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
