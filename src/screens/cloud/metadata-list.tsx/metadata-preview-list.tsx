import { AntDesign } from "@expo/vector-icons";
import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import EmptyAudioBackground, {
  EmptyVideoBackground,
} from "../../../components/images/empty-audio-background";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useNavigation } from "@react-navigation/native";

export default function MetadataPreviewList({
  posts,
  kind,
  onPressViewAll,
  customRenderTitle,
  itemWidth,
  containerStyles,
  includeViewAllTile,
  includeAudioName,
}: {
  posts: any[];
  kind: string;
  onPressViewAll: () => void;
  customRenderTitle?: React.ReactNode;
  itemWidth: number;
  containerStyles?: any;
  includeViewAllTile?: boolean;
  includeAudioName?: boolean;
}) {
  const navigation = useNavigation();

  const title = useMemo(() => {
    if (customRenderTitle) {
      return customRenderTitle;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BoldMonoText>{kind}</BoldMonoText>

        <BodyText
          style={{
            color: colors.purple,
            textDecorationColor: colors.purple,
            textDecorationLine: "underline",
            opacity: 0.8,
          }}
        >
          {"see all"}
        </BodyText>
      </View>
    );
  }, [kind, customRenderTitle]);

  if (kind == "Files" || kind == "Images") {
    return (
      <Pressable
        style={{
          backgroundColor: colors.lightblack,
          width: "100%",

          borderRadius: 20,
          marginBottom: 20,
          paddingVertical: 14,
          ...containerStyles,
        }}
        onPress={() => {
          onPressViewAll();
        }}
      >
        <View style={{ paddingHorizontal: 14 }}>{title}</View>

        <View
          style={{
            flexDirection: "row",
            paddingTop: 10,
            paddingHorizontal: 10,
            flexWrap: "wrap",
          }}
        >
          {posts.map((item) => (
            <View
              style={{
                marginHorizontal: 4,
              }}
              key={item.id}
            >
              {item.image ? (
                <Image
                  style={{
                    width: itemWidth,
                    height: itemWidth,
                    marginBottom: 8,
                    borderRadius: 6,
                  }}
                  source={{ uri: item.image }}
                />
              ) : item.video ? (
                <EmptyVideoBackground
                  size={itemWidth}
                  iconSize={20}
                  title={""}
                  light={true}
                />
              ) : (
                <EmptyAudioBackground size={itemWidth} />
              )}
            </View>
          ))}
          {includeViewAllTile && (
            <View style={{ marginHorizontal: 4 }}>
              <View
                style={{
                  borderRadius: 8,
                  width: itemWidth,
                  height: itemWidth,

                  backgroundColor: colors.transparentWhite2,
                  marginBottom: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="arrowright" size={20} color="white" />
              </View>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  if (kind == "Audio") {
    return (
      <View
        style={{
          backgroundColor: colors.lightblack,
          width: "100%",
          borderRadius: 20,
          marginBottom: 20,
          padding: 14,
          ...containerStyles,
        }}
      >
        {title}

        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          {posts.map((item) => (
            <TouchableOpacity
              style={{ marginRight: 8 }}
              key={item.id}
              onPress={() => {
                (navigation as any).navigate("ObjectViewerDetail", {
                  postId: item.id,
                  parentFolderId: null,
                });
              }}
            >
              {item.audioImage ? (
                <Image
                  style={{ width: itemWidth, height: itemWidth }}
                  source={{ uri: item.audioImage }}
                />
              ) : (
                <EmptyAudioBackground size={itemWidth} />
              )}
              {includeAudioName && (
                <BodyText
                  style={{
                    width: itemWidth,
                    marginTop: 4,
                    fontSize: 14,
                  }}
                >
                  {item.uploadTitle}
                </BodyText>
              )}
            </TouchableOpacity>
          ))}
          {includeViewAllTile && (
            <TouchableOpacity
              style={{ marginHorizontal: 4 }}
              onPress={() => {
                onPressViewAll();
              }}
            >
              <View
                style={{
                  borderRadius: 8,
                  width: itemWidth,
                  height: itemWidth,
                  backgroundColor: colors.transparentWhite2,
                  marginBottom: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="arrowright" size={20} color="white" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (kind == "Links") {
    return (
      <Pressable
        style={{
          backgroundColor: colors.lightblack,
          width: "100%",

          borderRadius: 20,
          marginBottom: 20,
          padding: 14,
          ...containerStyles,
        }}
        onPress={() => {
          onPressViewAll();
        }}
      >
        {title}

        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          {posts.map((item) => (
            <View
              style={{ marginRight: 8, width: itemWidth, height: itemWidth }}
              key={item.id}
            >
              <LinkPreview
                renderLinkPreview={(data) => (
                  <View>
                    {data && data.previewData && data.previewData.image ? (
                      <Image
                        style={{ width: itemWidth, height: itemWidth }}
                        source={{ uri: data.previewData.image.url }}
                      />
                    ) : (
                      <View
                        style={{
                          width: itemWidth,
                          height: itemWidth,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: colors.black,
                          borderColor: colors.transparentWhite5,
                          borderWidth: 0.5,
                        }}
                      >
                        <AntDesign name="link" size={20} color="white" />
                      </View>
                    )}
                  </View>
                )}
                text={item.text}
              />
            </View>
          ))}
        </View>
      </Pressable>
    );
  }

  return <View style={{ paddingHorizontal: 20, marginTop: 15 }}></View>;
}
