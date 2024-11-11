import { Video } from "expo-av";
import { Image } from "expo-image";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BodyText } from "../../../components/text";
import { IMAGEKIT_FULL_REPLACE } from "../../../constants/env";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";
import { Session } from "../../../models/session";
import { StoryLabel, StoryProcessedImage } from "../session-constants";
import { useNavigation } from "@react-navigation/native";

export interface SuperImageProps {
  superId: number;
  session: Session;
  onNext?: () => void;
  onBack?: () => void;
  onStopAnimation?: () => void;

  disablePress?: boolean;
  fitSize?: boolean;
  showOnlyImage?: boolean;
  setReady: (boolean) => void;
}
const SuperImage = ({
  fitSize,
  session,
  showOnlyImage,
  disablePress,
  superId,
  setReady,
  onNext,
  onBack,
  onStopAnimation,
}: SuperImageProps) => {
  const [photo, setPhoto] = useState<StoryProcessedImage>();
  const navigation = useNavigation();

  useEffect(() => {
    fetchSuperImage();
  }, []);

  const fetchSuperImage = async () => {
    const docRef = doc(getFirestore(), "superimages", `${superId}`);
    const rq = await getDoc(docRef);
    if (rq.exists) {
      const data: StoryProcessedImage = rq.data() as StoryProcessedImage;
      setPhoto({ ...data });
      if (!data.videoUri) {
        setReady(true);
      }
    }
  };

  const _onLabelPress = async (label: StoryLabel) => {
    if (onStopAnimation) onStopAnimation();
    switch (label.type) {
      // case "address":
      //   navigate("Location", {
      //     address: {
      //       place_name: label.text,
      //       id: label.address_id,
      //     },
      //   });
      //   break;
      // case "hashtag":
      //   navigate("Hashtag", {
      //     hashtag: label.text.trim(),
      //   });
      //   break;
      case "people":
        // const targetUsername = label.text.slice(1);
        // if (targetUsername !== myUsername)
        //   navigate("ProfileX", {
        //     username: targetUsername,
        //   });
        break;
      default:
        break;
    }
  };

  if (!photo) {
    return <View style={styles.backgroundContainer} />;
  } else {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          width: fitSize ? "100%" : SCREEN_WIDTH,
          height: fitSize ? "100%" : SCREEN_HEIGHT,
        }}
      >
        <Image
          // onLoadEnd={() => onReady && onReady()}
          style={[
            styles.backgroundContainer,
            session && session.isRepost && session.backgroundImageColor
              ? { backgroundColor: session.backgroundImageColor }
              : {},
          ]}
          source={
            session && session.isRepost
              ? {}
              : {
                  uri: photo.uri.replace(
                    "https://firebasestorage.googleapis.com/",
                    IMAGEKIT_FULL_REPLACE
                  ),
                  // cache: "force-cache",
                }
          }
          blurRadius={10}
        >
          {!!!disablePress && session && session.isRepost && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "25%",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => onBack && onBack()}
                  style={{
                    width: "50%",
                    height: "100%",
                  }}
                >
                  <></>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onNext && onNext()}
                  style={{
                    width: "50%",

                    height: "100%",
                  }}
                >
                  <></>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  width: "100%",
                  height: "50%",
                }}
                onPress={() => {
                  console.log("press");
                  navigation.goBack();
                  setTimeout(() => {
                    (navigation as any).navigate("PostDetail", {
                      postId: session.originalPostId,
                    });
                  }, 500);
                }}
              >
                <></>
              </TouchableOpacity>
              <View
                style={{
                  width: "100%",
                  height: "25%",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => onBack && onBack()}
                  style={{
                    width: "50%",
                    height: "100%",
                  }}
                >
                  <></>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onNext && onNext()}
                  style={{
                    width: "50%",

                    height: "100%",
                  }}
                >
                  <></>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!!!disablePress && !(session && session.isRepost) && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
                width: "100%",
                height: "100%",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => onBack && onBack()}
                style={{
                  width: "50%",
                  height: "100%",
                }}
              >
                <></>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onNext && onNext()}
                style={{
                  width: "50%",
                  height: "100%",
                }}
              >
                <></>
              </TouchableOpacity>
            </View>
          )}

          {!!!showOnlyImage &&
            photo.texts.map((txtLabel, labelIndex) => (
              <View
                key={labelIndex}
                style={{
                  zIndex: txtLabel.zIndex,
                  backgroundColor: txtLabel.textBg
                    ? txtLabel.color
                    : "rgba(0,0,0,0)",
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: [
                    {
                      translateX: txtLabel.x,
                    },
                    {
                      translateY: txtLabel.y,
                    },
                    {
                      scale: txtLabel.ratio,
                    },
                  ],
                }}
              >
                <Text
                  style={{
                    width: txtLabel.width,
                    height: txtLabel.height + 5,
                    textAlign:
                      txtLabel.textAlign === "flex-start"
                        ? "left"
                        : txtLabel.textAlign === "flex-end"
                        ? "right"
                        : "center",
                    fontSize: 40,
                    fontWeight: "800",
                    color: txtLabel.textBg ? "#000" : txtLabel.color,
                  }}
                >
                  {txtLabel.text}
                </Text>
              </View>
            ))}
          {!!!showOnlyImage &&
            photo.labels.map((label, labelIndex) => (
              <View
                // activeOpacity={0.8}
                // onPress={_onLabelPress.bind(null, label)}
                key={labelIndex}
                style={{
                  zIndex: label.zIndex,
                  backgroundColor:
                    label.type === "emoji" ? "rgba(0,0,0,0)" : "#fff",
                  borderRadius: 5,
                  position: "absolute",
                  width: label.width,
                  height: label.height,
                  justifyContent: "center",
                  alignItems: "center",
                  top: 0,
                  left: 0,
                  transform: [
                    {
                      translateX: label.x,
                    },
                    {
                      translateY: label.y,
                    },
                    {
                      scale: label.ratio,
                    },
                  ],
                }}
              >
                {label.type === "emoji" ? (
                  <Text
                    style={{
                      fontSize: label.fontSize,
                    }}
                  >
                    {label.text}
                  </Text>
                ) : (
                  <BodyText
                    {...(label.type === "address"
                      ? {
                          icon: {
                            name: "map-marker",
                            size: label.fontSize,
                          },
                        }
                      : {})}
                    // numberOfLines={1}
                    style={{
                      fontSize: label.fontSize,
                      maxWidth:
                        label.width -
                        (label.type === "address" ? label.fontSize : 0),
                    }}
                  >
                    {label.text}
                  </BodyText>
                )}
              </View>
            ))}

          <Animated.View
            // @ts-ignore
            style={{
              width: fitSize ? "100%" : photo.width,
              height: fitSize ? "100%" : photo.height,
              transform: [
                {
                  scale: fitSize ? 1 : photo.ratio,
                },
                // {
                //   rotate: photo.rotateDeg,
                // },
                {
                  translateX: photo.translateX,
                },
                {
                  translateY: photo.translateY,
                },
              ],
            }}
          >
            {photo.videoUri ? (
              <Video
                style={{
                  width: "100%",
                  height: "100%",
                }}
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded) {
                    setReady(true);
                  }
                }}
                source={{
                  uri: photo.videoUri.replace(
                    "https://firebasestorage.googleapis.com/",
                    IMAGEKIT_FULL_REPLACE
                  ),
                }}
                useNativeControls={false}
                isLooping={false}
                shouldPlay={true}
              />
            ) : (
              <Image
                contentFit="contain"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={{
                  uri: photo.uri.replace(
                    "https://firebasestorage.googleapis.com/",
                    IMAGEKIT_FULL_REPLACE
                  ),
                }}
              />
            )}
          </Animated.View>
        </Image>
      </View>
    );
  }
};

export default SuperImage;

const styles = StyleSheet.create({
  backgroundContainer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
