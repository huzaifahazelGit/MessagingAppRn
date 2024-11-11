import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Linking, View } from "react-native";
import {
  ApiConfig,
  ApiScope,
  auth as SpotifyAuth,
  remote as SpotifyRemote,
} from "react-native-spotify-remote";
import WebView from "react-native-webview";
import { colors } from "../../constants/colors";
import { SPOTIFY_CLIENT_ID } from "../../constants/env";
import { Fonts } from "../../constants/fonts";
import { IS_IOS, IS_SIMULATOR, SCREEN_WIDTH } from "../../constants/utils";
import { Post } from "../../models/post";
import {
  getSpotifyAccessToken,
  saveSpotifyAccessToken,
} from "../../services/securestore-service";
import { millisToMin } from "../../services/utils";
import { EmptyAudioBackgroundWrapper } from "../images/empty-audio-background";
import { BodyText } from "../text";
import { PlayButtonWrapper } from "./post-audio-player";

const spotifyConfig: ApiConfig = {
  clientID: SPOTIFY_CLIENT_ID,
  redirectURL: "realmapp://spotify-auth",
  scopes: [ApiScope.StreamingScope, ApiScope.AppRemoteControlScope],
};

export const SpotifyPlayer = ({
  spotifyId,
  post,
  containerWidth,
  smallVersion,
  submissionList,
  textColorOverride,
  buttonColorOverride,
  disabled,
}: {
  spotifyId: string;
  post?: Post;
  containerWidth: number;
  smallVersion: boolean;
  submissionList?: boolean;
  textColorOverride?: string;
  buttonColorOverride?: string;
  disabled?: boolean;
}) => {
  const [hasSpotifyInstalled, sethasSpotifyInstalled] = useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
  const [didSetUp, setDidSetUp] = useState(false);

  useEffect(() => {
    fetchSpotifyAccessToken();
  }, []);

  const fetchSpotifyAccessToken = async () => {
    let item: any = await getSpotifyAccessToken();

    if (item) {
      setSpotifyAccessToken(item);
    }
  };

  useEffect(() => {
    if (IS_SIMULATOR) {
      sethasSpotifyInstalled(true);
    } else if (IS_IOS) {
      Linking.canOpenURL("spotify://").then((val) =>
        sethasSpotifyInstalled(val)
      );
    }
  }, []);

  const buttonColor = useMemo(() => {
    if (buttonColorOverride) {
      return buttonColorOverride;
    }
    return colors.blue;
  }, [buttonColorOverride]);

  const textColor = useMemo(() => {
    if (textColorOverride) {
      return textColorOverride;
    }
    return colors.white;
  }, []);

  async function togglePlay() {
    if (!disabled) {
      try {
        if (spotifyAccessToken) {
          if (isPlaying) {
            await SpotifyRemote.pause();
            setIsPlaying(false);
          } else if (didSetUp) {
            await SpotifyRemote.resume();
            setIsPlaying(true);
          } else {
            await SpotifyRemote.connect(spotifyAccessToken);
            await SpotifyRemote.playUri(`spotify:track:${spotifyId}`);
            setDidSetUp(true);
            setIsPlaying(true);
          }
        } else {
          const session = await SpotifyAuth.authorize(spotifyConfig);
          setSpotifyAccessToken(session.accessToken);
          saveSpotifyAccessToken(session);
          await SpotifyRemote.connect(session.accessToken);
          await SpotifyRemote.playUri(`spotify:track:${spotifyId}`);
          setIsPlaying(true);
          setDidSetUp(true);
        }
      } catch (err) {
        setIsPlaying(false);
        Alert.alert(
          "Couldn't authorize with or connect to Spotify",
          `${err.message}`
        );
      }
    }
  }

  if (smallVersion) {
    if (post && post.image) {
      return (
        <Image
          style={{
            width: containerWidth,
            height: containerWidth,
            borderRadius: 8,
          }}
          source={{ uri: post.image }}
        />
      );
    }
    return (
      <WebView
        scalesPageToFit={true}
        bounces={false}
        javaScriptEnabled
        style={{
          width: containerWidth,
          height: containerWidth * 0.65,

          borderRadius: 8,
          backgroundColor: "transparent",
        }}
        source={{
          html: `<iframe src="https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0" width="100%" height="700" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        }}
        automaticallyAdjustContentInsets={false}
      />
    );
  }

  if (IS_IOS && hasSpotifyInstalled && post && post.uploadTitle) {
    return (
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            width: containerWidth,
            height: containerWidth,
            backgroundColor: "rgba(256, 256, 256, 1)",
            borderColor: "black",
            borderWidth: 0,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <EmptyAudioBackgroundWrapper size={containerWidth} post={post}>
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
                loading={false}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                buttonColor={buttonColor}
                user={null}
              />
            )}
          </EmptyAudioBackgroundWrapper>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <View>
              <BodyText
                style={{
                  fontFamily: Fonts.Bold,
                  fontSize: 14,
                  color: textColor,
                  maxWidth: SCREEN_WIDTH - 60,
                }}
              >
                {`${post.uploadTitle}`}
              </BodyText>
              {post.artistName && (
                <BodyText
                  style={{
                    marginTop: 2,
                    color: textColor,
                    maxWidth: SCREEN_WIDTH - 60,
                  }}
                >
                  {`${post.artistName}`}
                </BodyText>
              )}
            </View>

            <BodyText
              style={{
                fontFamily: Fonts.Regular,
                color: textColor,
              }}
            >
              {post.duration ? millisToMin(post.duration) : ""}
            </BodyText>
          </View>
          {/* {post.duration && (
            <View style={{}}>
              <Slider
                style={{ height: 5 }}
                minimumValue={0}
                maximumValue={post.duration}
                minimumTrackTintColor={buttonColor}
                maximumTrackTintColor={"rgba(256, 256, 256, 0.5)"}
                // value={didSetUp && duration > 0 ? progress.position || 0 : 0}
                value={0}
                onSlidingComplete={(millis: number) => {
                  // seekTrackPlayer(millis);
                }}
              />
            </View>
          )} */}

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
                loading={false}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                buttonColor={buttonColor}
                user={null}
              />
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <WebView
      scalesPageToFit={false}
      bounces={false}
      javaScriptEnabled
      allowsFullscreenVideo={false}
      style={{
        width: containerWidth,
        height: containerWidth * 0.4,

        borderRadius: 8,
        backgroundColor: "transparent",
      }}
      source={{
        html: `<iframe src="https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0" width="100%" height="700" frameBorder="0" allowfullscreen="false" allow="autoplay; clipboard-write; encrypted-media;"></iframe>`,
      }}
      automaticallyAdjustContentInsets={false}
    />
  );
};
