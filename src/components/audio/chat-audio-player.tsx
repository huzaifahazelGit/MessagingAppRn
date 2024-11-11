import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { Post } from "../../models/post";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { colors } from "../../constants/colors";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Fonts } from "../../constants/fonts";
import Slider from "@react-native-community/slider";
import { BodyText } from "../text";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { millisToMin } from "../../services/utils";

export default function ChatAudioPlayer({
  audioUrl,
  audioTitle,
  senderIsMe,
  itemId,
  downloading,
  downloadAudioFile,
}: {
  itemId: string;
  audioTitle: string;
  audioUrl: string;
  senderIsMe: boolean;
  downloading: boolean;
  downloadAudioFile: any;
}) {
  const [duration, setDuration] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [didSetUp, setDidSetUp] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const track = useCurrentTrack();
  const progress = useProgress();

  useEffect(() => {
    if (didSetUp && track && track.id != itemId) {
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
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const seekTrackPlayer = async (millis: number) => {
    TrackPlayer.seekTo(millis);
  };

  const setUpAudio = async () => {
    setLoading(true);
    await TrackPlayer.reset();

    const track = {
      url: audioUrl,
      title: audioTitle,

      id: itemId,
    };

    await TrackPlayer.add([track]);

    TrackPlayer.play();
    setIsPlaying(true);
    setLoading(false);
    setDidSetUp(true);
    fetchDuration();
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

  const buttonColor = useMemo(() => {
    return senderIsMe ? colors.white : colors.darkPurple;
  }, [senderIsMe]);

  return (
    <View
      style={{
        width: 240,
        paddingBottom: 10,
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <View style={{ marginRight: 10 }}>
              {loading || (isPlaying && progress.buffered < 1) ? (
                <View
                  style={{
                    backgroundColor: buttonColor,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 32 / 2,
                  }}
                >
                  <ActivityIndicator color={colors.transparentBlack8} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={togglePlay}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name={isPlaying ? `pause` : `play`}
                    color={buttonColor}
                    size={32}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                fontFamily: Fonts.Bold,
                color: buttonColor,
                width: 190,
              }}
            >
              {`${audioTitle}`}
            </Text>
          </View>
          <View style={{}}>
            <Slider
              style={{ height: 5 }}
              minimumValue={0}
              maximumValue={duration}
              minimumTrackTintColor={buttonColor}
              maximumTrackTintColor={
                senderIsMe ? "rgba(256, 256, 256, 0.5)" : "rgba(0, 0, 0, 0.2)"
              }
              value={didSetUp && duration > 0 ? progress.position || 0 : 0}
              onSlidingComplete={(millis: number) => {
                seekTrackPlayer(millis);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {downloading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <TouchableOpacity
                style={{
                  alignItems: "flex-end",
                  marginRight: 10,
                }}
                onPress={() => {
                  downloadAudioFile();
                }}
              >
                <BodyText
                  style={{
                    color: buttonColor,
                    opacity: 0.5,
                    textDecorationColor: buttonColor,
                    textDecorationLine: "underline",
                  }}
                >{`download audio`}</BodyText>
              </TouchableOpacity>
            )}

            <Text
              style={{
                fontFamily: Fonts.Regular,
                color: buttonColor,
              }}
            >
              {duration ? millisToMin(duration) : ""}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
