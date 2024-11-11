import { Image } from "expo-image";
import { ImageBackground, View } from "react-native";
import { colors } from "../../constants/colors";
import { BoldMonoText } from "../text";
import { FontAwesome5 } from "@expo/vector-icons";
import { Post } from "../../models/post";
import { getResizedImage } from "../../services/utils";

export default function EmptyAudioBackground({ size }: { size: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,

        borderRadius: 8,
      }}
    >
      <Image
        contentFit="cover"
        source={require("../../../assets/icon-audio-default.png")}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          borderColor: colors.transparentWhite5,
          borderWidth: 1,
        }}
      />
    </View>
  );
}

export function EmptyAudioBackgroundWrapper({
  children,
  post,
  size,
}: {
  size: number;
  post: Post;
  children: any;
}) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={
        post && post.image
          ? {
              uri: getResizedImage(post.image),
            }
          : require("../../../assets/icon-audio-default.png")
      }
      style={{ width: size, height: size, borderRadius: 8, overflow: "hidden" }}
    >
      {children}
    </ImageBackground>
  );
}

export function EmptyVideoBackground({
  size,
  iconSize,
  title,
  light,
}: {
  size: number;
  iconSize: number;
  title: string;
  light?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "space-between",

        backgroundColor: light ? "white" : "black",
        borderColor: colors.transparentWhite5,
        borderWidth: 0.5,
        borderRadius: 6,
      }}
    >
      <View style={{ height: title ? 30 : 0 }}></View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <FontAwesome5
          name="video"
          size={iconSize}
          color={light ? "black" : "white"}
        />
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {title ? (
          <BoldMonoText
            style={{
              opacity: 0.8,
              paddingHorizontal: 8,
              paddingBottom: 4,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {title}
          </BoldMonoText>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
}
