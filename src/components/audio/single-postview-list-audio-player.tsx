import { AntDesign, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { colors } from "../../constants/colors";
import { IMAGEKIT_FULL_REPLACE } from "../../constants/env";
import { Fonts } from "../../constants/fonts";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { Post } from "../../models/post";
import { millisToMin } from "../../services/utils";

export default function ArenaSinglePostViewListAudioPlayer({
  post,
  setViewingSubmission,
}: {
  post: Post;
  setViewingSubmission: any;
}) {
  const currentTrack = useCurrentTrack();
  const {
    playTrackById,
    playNext,
    playPrev,
    canPressNext,
    canPressPrev,

    duration,
  } = useTrackPlayerContext();
  const progress = useProgress();

  const selectTrack = async (post: Post) => {
    if (currentTrack && currentTrack.id == post.id) {
      // nothing
    } else {
      playTrackById(post.id);
    }
  };

  useEffect(() => {
    selectTrack(post);
  }, [post]);

  const onPressNext = async () => {
    let next = playNext();
    setViewingSubmission(next);
  };

  const onPressPrev = async () => {
    let prev = playPrev();
    setViewingSubmission(prev);
  };

  const seekTrackPlayer = async (millis: number) => {
    TrackPlayer.seekTo(millis);
  };

  const imageSize = SCREEN_WIDTH - 24;

  const buttonColor = useMemo(() => {
    return colors.purple;
  }, []);

  const textColor = useMemo(() => {
    return colors.white;
  }, []);

  const coverImage = useMemo(() => {
    if (post && (post as any).imageNumber) {
      switch ((post as any).imageNumber) {
        case 1:
          return require("../../../assets/rand-image-1.jpeg");
        case 2:
          return require("../../../assets/rand-image-2.jpeg");
        case 3:
          return require("../../../assets/rand-image-3.jpeg");
        case 4:
          return require("../../../assets/rand-image-4.jpeg");
        case 5:
          return require("../../../assets/rand-image-5.jpeg");
        case 6:
          return require("../../../assets/rand-image-6.jpeg");
        case 7:
          return require("../../../assets/rand-image-7.jpeg");
        case 8:
          return require("../../../assets/rand-image-8.jpeg");
        case 9:
          return require("../../../assets/rand-image-9.jpeg");
        case 10:
          return require("../../../assets/rand-image-10.jpeg");
        case 11:
          return require("../../../assets/rand-image-11.jpeg");
        case 12:
          return require("../../../assets/rand-image-12.png");
        case 13:
          return require("../../../assets/rand-image-13.png");
        case 14:
          return require("../../../assets/rand-image-14.png");
        case 15:
          return require("../../../assets/rand-image-15.png");
        case 16:
          return require("../../../assets/rand-image-16.png");
        case 17:
          return require("../../../assets/rand-image-17.png");
        case 18:
          return require("../../../assets/rand-image-18.png");
        case 19:
          return require("../../../assets/rand-image-19.png");
        case 20:
          return require("../../../assets/rand-image-20.png");
        case 21:
          return require("../../../assets/rand-image-21.png");
        case 22:
          return require("../../../assets/rand-image-22.png");
        case 23:
          return require("../../../assets/rand-image-23.png");
        case 24:
          return require("../../../assets/rand-image-24.png");
        case 25:
          return require("../../../assets/rand-image-25.png");
        case 26:
          return require("../../../assets/rand-image-26.png");
        case 27:
          return require("../../../assets/rand-image-27.png");
        case 28:
          return require("../../../assets/rand-image-28.png");
        case 29:
          return require("../../../assets/rand-image-29.png");
        case 30:
          return require("../../../assets/rand-image-30.png");
      }
    }
    return null;
  }, [post]);

  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            width: imageSize,
            height: imageSize,
            marginTop: 12,
            backgroundColor: "rgba(256, 256, 256, 1)",
            borderColor: "black",
            borderWidth: 0,
            borderRadius: 8,
          }}
        >
          <Image
            source={
              post && post.image
                ? {
                    uri: post.image.replace(
                      "https://firebasestorage.googleapis.com/",
                      IMAGEKIT_FULL_REPLACE
                    ),
                  }
                : coverImage
                ? coverImage
                : require("../../../assets/icon-audio-default.png")
            }
            style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
          ></Image>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.Bold,
                color: textColor,
                maxWidth: SCREEN_WIDTH - 60,
              }}
            >
              {`${post.uploadTitle}`}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.Regular,
                color: textColor,
              }}
            >
              {duration ? millisToMin(duration) : ""}
            </Text>
          </View>
          <View style={{}}>
            <Slider
              style={{ height: 5 }}
              minimumValue={0}
              maximumValue={duration}
              minimumTrackTintColor={buttonColor}
              maximumTrackTintColor={"rgba(256, 256, 256, 0.5)"}
              value={duration > 0 ? progress.position || 0 : 0}
              onSlidingComplete={(millis: number) => {
                seekTrackPlayer(millis);
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 8,
              marginTop: 12,
            }}
          >
            <TouchableOpacity style={{ marginRight: 30 }} onPress={onPressPrev}>
              <AntDesign
                name="stepbackward"
                size={30}
                color={canPressPrev ? buttonColor : "rgba(256, 256, 256, 0.5)"}
              />
            </TouchableOpacity>
            <SinglePlayButtonWrapper
              size={65}
              containerStyles={{
                paddingHorizontal: 10,
              }}
              buttonColor={buttonColor}
            />
            <TouchableOpacity style={{ marginLeft: 30 }} onPress={onPressNext}>
              <AntDesign
                name="stepforward"
                size={30}
                color={canPressNext ? buttonColor : "rgba(256, 256, 256, 0.5)"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export function SinglePlayButtonWrapper({
  buttonColor,
  containerStyles,
  size,
}) {
  const progress = useProgress();

  const { togglePlay, loading, isPlaying } = useTrackPlayerContext();

  return (
    <View
      style={{
        ...containerStyles,
      }}
    >
      {loading || (isPlaying && progress.buffered < 1) ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        >
          <ActivityIndicator color={buttonColor} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={togglePlay}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: size,
            height: size,
          }}
        >
          {isPlaying ? (
            <Ionicons name="pause-circle" color={buttonColor} size={size} />
          ) : (
            <Ionicons name="play-circle" color={buttonColor} size={size} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
