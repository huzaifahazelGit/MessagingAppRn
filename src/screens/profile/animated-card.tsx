import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Animated, View } from "react-native";

import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { useRecentImagePosts } from "../../hooks/usePosts";
import { useProfileColors } from "../../hooks/useProfileColors";

export const AnimatedCard = ({
  flipToBackStyle,
  flipToFrontStyle,
  user,
  userId,
  showingMore,
  transitionActive,
  animatedStyles,
}) => {
  const me = useMe();
  const recentImagePosts = useRecentImagePosts(userId);

  const additionalImages = useMemo(() => {
    let cleaned = (recentImagePosts || [])
      .map((item) => item.image)
      .filter((item) => item && item != undefined);
    return cleaned;
  }, [recentImagePosts]);

  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  return (
    <View>
      <Animated.Image
        style={{ ...style.cardFront, ...flipToBackStyle }}
        source={{ uri: user.profilePicture }}
      />
      <Animated.ScrollView
        style={{
          ...style.cardBack,
          ...flipToFrontStyle,
          backgroundColor: backgroundColor,
        }}
        horizontal={true}
        contentContainerStyle={{ paddingLeft: 20 }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", paddingRight: 20 }}>
          <Image
            source={{ uri: user.profilePicture }}
            contentFit="cover"
            style={{
              width: SCREEN_WIDTH * 0.7,
              height: SCREEN_WIDTH - 20,
              marginTop: 20,
              borderRadius: 12,
            }}
          />
          {showingMore && !transitionActive && (
            <View style={{ flexDirection: "row" }}>
              {additionalImages.map((image, index) => {
                return (
                  <View
                    style={{
                      width: SCREEN_WIDTH * 0.7,
                      marginLeft: 20,
                    }}
                    key={index}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: SCREEN_WIDTH * 0.7,
                        height: SCREEN_WIDTH - 20,
                        marginTop: 20,
                        borderRadius: 12,
                      }}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={{
          marginTop: -1 * SCREEN_WIDTH,
          ...animatedStyles,
        }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.7)", "transparent"]}
          style={{
            width: SCREEN_WIDTH,
            height: 200,
          }}
        ></LinearGradient>
      </Animated.View>
      <Animated.View
        style={{
          marginTop: -1 * 200,
          ...animatedStyles,
        }}
      >
        <LinearGradient
          colors={
            user.profilePicture
              ? ["transparent", backgroundColor]
              : [colors.blue, "transparent"]
          }
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
          }}
        ></LinearGradient>
      </Animated.View>
    </View>
  );
};

const style = StyleSheet.create({
  cardFront: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  cardBack: {
    backfaceVisibility: "hidden",
  },
});
