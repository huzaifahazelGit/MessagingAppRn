import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TrackPlayer, {
  useProgress,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { getResizedImage, millisToMin } from "../../services/utils";
import { EmptyAudioBackgroundWrapper } from "../images/empty-audio-background";
import { BodyText } from "../text";

export default function PostAudioPlayer({
  post,
  user,
  visible,
  submissionList,
  skipAutoPlay,
}: {
  post: Post;
  user?: User;
  visible: boolean;
  submissionList?: boolean;
  skipAutoPlay: boolean;
}) {
  const [duration, setDuration] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [didSetUp, setDidSetUp] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [didAutoPlay, setDidAutoPlay] = useState(false);
  const track = useCurrentTrack();
  const progress = useProgress();

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      if (
        (event as any).state == "paused" &&
        Math.floor(progress.position) >= Math.floor(progress.duration - 1)
      ) {
        setIsPlaying(false);
        seekTrackPlayer(0);
      }
    }
  });

  useEffect(() => {
    if (didSetUp && track && track.id != post.id) {
      setIsPlaying(false);
      setDidSetUp(false);
    }
  }, [track, didSetUp]);

  useEffect(() => {
    if (isPlaying) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!visible && isPlaying && !skipAutoPlay) {
      pauseTrack();
      setIsPlaying(false);
    }
  }, [visible, isPlaying, skipAutoPlay]);

  useEffect(() => {
    if (visible && !didAutoPlay && !skipAutoPlay) {
      setDidAutoPlay(true);
      setUpAudio();
    }
  }, [visible, isPlaying, didSetUp, didAutoPlay, skipAutoPlay]);

  const togglePlay = async () => {
    if (isPlaying) {
      pauseTrack();
    } else if (!didSetUp) {
      setUpAudio();
    } else {
      playTrack();
    }
  };

  const pauseTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const playTrack = async () => {
    let queue = await TrackPlayer.getQueue();
    if (!queue || queue.length == 0) {
      setUpAudio();
      return;
    }
    let res = await TrackPlayer.play();
    setIsPlaying(true);
  };

  const seekTrackPlayer = async (millis: number) => {
    TrackPlayer.seekTo(millis);
  };

  const setUpAudio = async () => {
    // console.log("start setUpAudio", post.uploadTitle);
    setLoading(true);
    await TrackPlayer.reset();

    const track = {
      url: post.audio,
      title: post.uploadTitle,
      artist: post.username,

      artwork: post.image ? post.image : undefined,
      id: post.id,
    };

    await TrackPlayer.add([track]);

    TrackPlayer.play();
    setIsPlaying(true);
    setLoading(false);
    setDidSetUp(true);
    fetchDuration();
    // console.log("finish setUpAudio", post.uploadTitle);
    setTimeout(() => {
      fetchDuration();
    }, 2500);
  };

  const fetchDuration = async () => {
    if (duration == 0) {
      let d = await TrackPlayer.getDuration();
      setDuration(d);
    }
  };

  const imageSize = SCREEN_WIDTH - 24;

  const buttonColor = useMemo(() => {
    return submissionList
      ? colors.purple
      : user
      ? "white" // user.buttonColor
      : post.image
      ? colors.blue
      : "white";
  }, [user, submissionList, post]);

  const textColor = useMemo(() => {
    return user && user.textColor ? user.textColor : colors.white;
  }, [user]);

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          width: imageSize,
          height: imageSize,
          backgroundColor: "rgba(256, 256, 256, 1)",
          borderColor: "black",
          borderWidth: 0,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <EmptyAudioBackgroundWrapper size={imageSize} post={post}>
          {submissionList ? (
            <View />
          ) : (
            <PlayButtonWrapper
              containerStyles={{
                justifyContent: "flex-end",
                flex: 1,
                alignItems: "flex-end",
                padding: 10,
              }}
              loading={loading}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              buttonColor={buttonColor}
              user={user}
            />
          )}
        </EmptyAudioBackgroundWrapper>
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
            value={didSetUp && duration > 0 ? progress.position || 0 : 0}
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
            marginTop: 6,
          }}
        >
          {submissionList ? (
            <PlayButtonWrapper
              containerStyles={{
                paddingHorizontal: 10,
              }}
              loading={loading}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              buttonColor={buttonColor}
              user={user}
            />
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
}

export function PlayButtonWrapper({
  loading,
  isPlaying,
  togglePlay,
  buttonColor,
  user,
  containerStyles,
}) {
  const progress = useProgress();

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
            width: 65,
            height: 65,
            borderRadius: 65 / 2,
          }}
        >
          <ActivityIndicator color={user ? buttonColor : colors.blue} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={togglePlay}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isPlaying ? (
            <Ionicons name="pause-circle" color={buttonColor} size={65} />
          ) : (
            <Ionicons name="play-circle" color={buttonColor} size={65} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
