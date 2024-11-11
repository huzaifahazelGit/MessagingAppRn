import { Feather, AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { SinglePlayButtonWrapper } from "../../components/audio/single-postview-list-audio-player";
import AddToJukeboxButton from "../../components/buttons/add-jukebox-button";
import LikeButton, { LikeStatus } from "../../components/buttons/like-button";
import { BodyText, BoldMonoText, BoldText } from "../../components/text";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import {
  DEFAULT_PROFILE_COLORS,
  ProfileColors,
} from "../../hooks/useProfileColors";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { millisToMin } from "../../services/utils";
import { Post } from "../../models/post";

export default function JukeboxControls({
  onShare,
  profileColors,
  horizontal,
  onPressNext,
  asFloater,
  postOverride,
}: {
  onShare: any;
  profileColors: ProfileColors;
  horizontal?: boolean;
  onPressNext?: any;
  asFloater?: boolean;
  postOverride?: Post;
}) {
  const currentTrack = useCurrentTrack();
  const { textColor, buttonColor } = profileColors;

  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    like: null,
    loaded: false,
    overrideNumLikes: 0,
  });

  const { duration, playNext, canPressNext } = useTrackPlayerContext();

  const progress = useProgress();

  const title = useMemo(() => {
    var tempPost = null;

    if (postOverride) {
      tempPost = postOverride;
    }
    if (currentTrack) {
      tempPost = currentTrack;
    }

    if (tempPost) {
      return tempPost.uploadTitle ? tempPost.uploadTitle : "";
    }

    return "";
  }, [postOverride, currentTrack]);

  const username = useMemo(() => {
    var tempPost = null;
    if (postOverride) {
      tempPost = postOverride;
    }
    if (currentTrack) {
      tempPost = currentTrack;
    }
    if (tempPost) {
      return tempPost.originalUsername
        ? tempPost.originalUsername
        : tempPost.username
        ? tempPost.username
        : "";
    }
    return "";
  }, [postOverride, currentTrack]);

  const seekTrackPlayer = async (millis: number) => {
    TrackPlayer.seekTo(millis);
  };

  const coverImage = useMemo(() => {
    if (currentTrack && currentTrack.image) {
      return currentTrack.image;
    }
    if (postOverride && postOverride.image) {
      return postOverride.image;
    }
    return null;
  }, [currentTrack, postOverride]);

  if (horizontal) {
    return (
      <View style={{}}>
        <View
          style={{
            width: "100%",
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {coverImage && (
                  <Image
                    source={{ uri: coverImage }}
                    style={{
                      width: 80,
                      height: 80,
                      marginRight: 12,
                    }}
                  />
                )}
                <View style={{ maxWidth: SCREEN_WIDTH / 2 }}>
                  <BoldMonoText
                    style={{
                      color: textColor,
                      maxWidth: SCREEN_WIDTH - 60,
                      fontSize: 18,
                    }}
                    numLines={2}
                  >
                    {title}
                  </BoldMonoText>
                  <BoldMonoText
                    style={{
                      color: textColor,
                      maxWidth: SCREEN_WIDTH - 60,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                    numLines={1}
                  >
                    {username}
                  </BoldMonoText>
                  {currentTrack && (
                    <LikeButton
                      size={16}
                      profileColors={DEFAULT_PROFILE_COLORS}
                      post={currentTrack}
                      likeStatus={likeStatus}
                      setLikeStatus={setLikeStatus}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <SinglePlayButtonWrapper
                  containerStyles={{ marginRight: -10 }}
                  size={horizontal ? 60 : 50}
                  buttonColor={buttonColor != "#000000" ? buttonColor : "#fff"}
                />
                {onPressNext && (
                  <TouchableOpacity
                    style={{ marginLeft: 12 }}
                    onPress={() => {
                      onPressNext();
                    }}
                  >
                    <Feather
                      name="shuffle"
                      size={18}
                      style={{}}
                      color={textColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <BodyText
                style={{
                  color: textColor,
                }}
                numLines={1}
              >
                {progress.position ? millisToMin(progress.position) : ""}
              </BodyText>

              <BodyText
                style={{
                  color: textColor,
                }}
                numLines={1}
              >
                {duration ? millisToMin(duration) : ""}
              </BodyText>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (asFloater) {
    return (
      <View style={{}}>
        <View
          style={{
            width: "100%",
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {coverImage && (
                  <Image
                    source={{ uri: coverImage }}
                    style={{
                      width: 55,
                      height: 55,
                      marginRight: 12,
                    }}
                  />
                )}
                <View style={{ maxWidth: SCREEN_WIDTH / 2 }}>
                  <BoldMonoText
                    style={{
                      color: textColor,
                      maxWidth: SCREEN_WIDTH - 60,
                    }}
                    numLines={2}
                  >
                    {title}
                  </BoldMonoText>
                  <BoldMonoText
                    style={{
                      color: textColor,
                      maxWidth: SCREEN_WIDTH - 60,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                    numLines={1}
                  >
                    {username}
                  </BoldMonoText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  marginRight: 12,
                }}
              >
                <SinglePlayButtonWrapper
                  containerStyles={{ marginRight: -10 }}
                  size={horizontal ? 60 : 50}
                  buttonColor={buttonColor != "#000000" ? buttonColor : "#fff"}
                />
                {canPressNext && (
                  <TouchableOpacity
                    style={{ marginLeft: 12, marginTop: 4 }}
                    onPress={() => {
                      playNext();
                    }}
                  >
                    <AntDesign
                      name="stepforward"
                      size={22}
                      style={{}}
                      color={textColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{}}>
      <View
        style={{
          width: "100%",
        }}
      >
        {currentTrack && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <View style={{ maxWidth: SCREEN_WIDTH * 0.6 }}>
                <BoldText
                  style={{
                    color: textColor,
                    maxWidth: SCREEN_WIDTH - 60,
                  }}
                >
                  {`${currentTrack.uploadTitle}`}
                </BoldText>
                <BodyText
                  style={{
                    color: textColor,
                    maxWidth: SCREEN_WIDTH - 60,
                    marginTop: 4,
                  }}
                  numLines={1}
                >
                  {`${
                    currentTrack.originalUsername
                      ? currentTrack.originalUsername
                      : currentTrack.username
                      ? currentTrack.username
                      : ""
                  }`}
                </BodyText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <View style={{ marginTop: 3, marginRight: 3 }}>
                  <AddToJukeboxButton
                    post={currentTrack}
                    profileColors={profileColors}
                  />
                </View>
                <TouchableOpacity
                  style={{ marginHorizontal: 5 }}
                  onPress={() => {
                    onShare(currentTrack);
                  }}
                >
                  <Feather
                    name="external-link"
                    size={25}
                    style={{}}
                    color={textColor}
                  />
                </TouchableOpacity>
                <SinglePlayButtonWrapper
                  containerStyles={{ marginRight: -10 }}
                  size={horizontal ? 60 : 50}
                  buttonColor={buttonColor != "#000000" ? buttonColor : "#fff"}
                />
                {onPressNext && (
                  <TouchableOpacity
                    style={{ marginLeft: 12 }}
                    onPress={() => {
                      onPressNext();
                    }}
                  >
                    <Feather
                      name="shuffle"
                      size={18}
                      style={{}}
                      color={textColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <BodyText
                style={{
                  color: textColor,
                }}
                numLines={1}
              >
                {progress.position ? millisToMin(progress.position) : ""}
              </BodyText>

              <BodyText
                style={{
                  color: textColor,
                }}
                numLines={1}
              >
                {duration ? millisToMin(duration) : ""}
              </BodyText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
