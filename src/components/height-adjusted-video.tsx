import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { IS_ANDROID, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/utils";
import { Post } from "../models/post";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Image } from "expo-image";
import { User } from "../models/user";

export default function HeightAdjustedVideo({
  videoURL,
  setVideoURL,
  clearable,
  fullWidth,
  autoplay,
  visible,
  post,
  backgroundImage,
  user,
}: {
  videoURL: string;
  setVideoURL: any;
  clearable?: boolean;
  fullWidth?: number;
  autoplay?: boolean;
  visible: boolean;
  post?: Post;
  backgroundImage?: string;
  user?: User;
}) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = React.useState({});
  const [didUpdate, setDidUpdate] = useState(false);

  var imageWidth = useMemo(() => {
    if (fullWidth && !isNaN(fullWidth)) {
      return fullWidth;
    } else {
      return SCREEN_WIDTH - 26;
    }
  }, [fullWidth, SCREEN_WIDTH]);

  const adjustedHeight = React.useMemo(() => {
    let height = SCREEN_HEIGHT - 240;
    if (post && post.videoRatio) {
      height = imageWidth * post.videoRatio;
    }
    if (size) {
      let ratio = size.height / size.width;

      height = imageWidth * ratio;
    }

    if (height < 350) {
      return 350;
    }

    if (height > SCREEN_HEIGHT - 240) {
      return SCREEN_HEIGHT - 240;
    }
    return height;
  }, [size, post]);

  useEffect(() => {
    if (!didUpdate) {
      if (post && !post.videoRatio) {
        if (size) {
          setDidUpdate(true);
          let ratio = size.height / size.width;
          savePostHeight(ratio);
        }
      }
    }
  }, [post, didUpdate, size]);

  const savePostHeight = async (ratio: number) => {
    console.log("savePostRatio", ratio);
    const ref = doc(
      getFirestore(),
      post.marketplace ? "marketplace" : "posts",
      post.id
    );
    await updateDoc(ref, {
      videoRatio: ratio,
    });
  };

  useEffect(() => {
    if (!visible && ref) {
      ref.current.pauseAsync();
    }
  }, [visible, ref]);

  useEffect(() => {
    if (status) {
      if ((status as any).isPlaying) {
        activateKeepAwakeAsync();
      } else {
        deactivateKeepAwake();
      }
    }
  }, [status]);

  const buttonColor = useMemo(() => {
    return user
      ? "white" // user.buttonColor
      : colors.blue;
  }, [user]);

  return (
    <View>
      {visible && backgroundImage && (
        <View
          style={{
            borderRadius: 12,
            overflow: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Image
            style={{
              width: imageWidth,
              height: adjustedHeight,
            }}
            source={{ uri: backgroundImage }}
          />
        </View>
      )}
      <View
        style={{
          width: imageWidth,
          height: adjustedHeight,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Video
          ref={ref}
          style={{
            width: imageWidth,
            height: adjustedHeight,
            borderRadius: 8,
          }}
          source={{
            uri: videoURL,
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={visible && !IS_ANDROID}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onReadyForDisplay={(val) => {
            if (size != val.naturalSize) {
              setSize(val.naturalSize);
              setReady(true);
              if (ref && ref.current) {
                ref.current.setPositionAsync(0.5);
              }
            }
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <LinearGradient
            style={{
              width: imageWidth,
              height: adjustedHeight,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingRight: 4,
              paddingBottom: 4,
            }}
            colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.4)", "transparent"]}
          >
            <TouchableOpacity
              onPress={() => {
                if (ref && ref.current) {
                  if (status && (status as any).isPlaying) {
                    ref.current.pauseAsync();
                  } else {
                    ref.current.playAsync();
                  }
                }
              }}
            >
              <Ionicons
                name={
                  status && (status as any).isPlaying
                    ? "pause-circle"
                    : "play-circle"
                }
                size={70}
                color={buttonColor}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      {clearable && (
        <View
          style={{
            width: 40,
            height: 40,
            marginBottom: -35,
            position: "relative",
            left: imageWidth - 40,
            top: -1 * adjustedHeight,
          }}
        >
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => {
              setVideoURL("");
            }}
          >
            <Ionicons name="close-circle" size={25} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function SimpleHeightAdjustedVideo({
  videoURL,
  fullWidth,
}: {
  videoURL: string;

  fullWidth: number;
}) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = React.useState({});
  const [didUpdate, setDidUpdate] = useState(false);

  var imageWidth = useMemo(() => {
    if (fullWidth && !isNaN(fullWidth)) {
      return fullWidth;
    } else {
      return SCREEN_WIDTH - 26;
    }
  }, [fullWidth, SCREEN_WIDTH]);

  const adjustedHeight = React.useMemo(() => {
    let height = SCREEN_HEIGHT - 240;
    if (size) {
      let ratio = size.height / size.width;

      height = imageWidth * ratio;
    }

    if (height < 350) {
      return 350;
    }

    if (height > SCREEN_HEIGHT - 240) {
      return SCREEN_HEIGHT - 240;
    }
    return height;
  }, [size]);

  useEffect(() => {
    if (status) {
      if ((status as any).isPlaying) {
        activateKeepAwakeAsync();
      } else {
        deactivateKeepAwake();
      }
    }
  }, [status]);

  return (
    <View>
      <View
        style={{
          width: imageWidth,
          height: adjustedHeight,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Video
          ref={ref}
          style={{
            width: imageWidth,
            height: adjustedHeight,
            borderRadius: 8,
          }}
          source={{
            uri: videoURL,
          }}
          useNativeControls={true}
          resizeMode={ResizeMode.COVER}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onReadyForDisplay={(val) => {
            if (size != val.naturalSize) {
              setSize(val.naturalSize);
              setReady(true);
              if (ref && ref.current) {
                ref.current.setPositionAsync(0.5);
              }
            }
          }}
        />
      </View>
    </View>
  );
}
