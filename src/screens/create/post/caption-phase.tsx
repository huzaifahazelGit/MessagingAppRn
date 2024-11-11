import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SoundcloudPlayer,
  YoutubePlayer,
} from "../../../components/audio/links-players";
import { SpotifyPlayer } from "../../../components/audio/spotify-player";
import { InputWithMentions } from "../../../components/inputs/mention-input";
import { BodyText } from "../../../components/text";
import LocationButton from "../../../components/upload-wrappers/location-upload";
import TagsWrapper from "../../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { Post } from "../../../models/post";
import { GeneralDataStore } from "../../../store/general-data-store";
import { UploadSelectionObject } from "../upload-constants";

export const CaptionPhase = ({
  uploadData,
  setUploadData,
  post,
  setPost,
  setPhase,
}: {
  uploadData: UploadSelectionObject;
  setUploadData: any;
  post: Post;
  setPost: any;
  setPhase: any;
}) => {
  const [focused, setFocused] = useState(false);

  const me = useMe();
  const companies = GeneralDataStore.useState((s) => s.companies);

  const shouldHaveUserToggle = useMemo(() => {
    return (companies || []).filter((item) => !item.archived).length > 0;
  }, [companies]);

  const linksObject = useMemo(() => {
    return uploadData.linksObject;
  }, [uploadData]);

  const isYoutubeLink = useMemo(() => {
    return linksObject && linksObject.youtubeId && linksObject.youtubeId != "";
  }, [linksObject]);

  const isSpotifyLink = useMemo(() => {
    return linksObject && linksObject.spotifyId && linksObject.spotifyId != "";
  }, [linksObject]);

  const isSoundcloudLink = useMemo(() => {
    return (
      linksObject &&
      linksObject.soundcloudLink &&
      linksObject.soundcloudLink != ""
    );
  }, [linksObject]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        ></Pressable>

        <View>
          <View
            style={{ marginHorizontal: 8, marginTop: 12, marginBottom: 20 }}
          >
            {isYoutubeLink ? (
              <YoutubePlayer
                youtubeId={linksObject.youtubeId}
                containerWidth={SCREEN_WIDTH - 56}
                webviewStyles={{}}
              />
            ) : (
              <View />
            )}
            <View style={{ flexDirection: "row" }}>
              {isSoundcloudLink ? (
                <SoundcloudPlayer
                  soundcloudLink={linksObject.soundcloudLink}
                  containerWidth={120}
                  webviewStyles={{}}
                />
              ) : isSpotifyLink ? (
                <View>
                  <SpotifyPlayer
                    post={post}
                    spotifyId={linksObject.spotifyId}
                    containerWidth={133}
                    smallVersion={true}
                  />
                </View>
              ) : isYoutubeLink ? (
                <View></View>
              ) : uploadData.videoURL ? (
                <View>
                  <Video
                    style={{
                      width: 120,
                      height: 180,
                      borderRadius: 8,
                    }}
                    source={{
                      uri: uploadData.videoURL,
                    }}
                    useNativeControls={false}
                    shouldPlay={false}
                    resizeMode={ResizeMode.COVER}
                  />
                </View>
              ) : uploadData.imageURL || uploadData.audioObject ? (
                <Image
                  style={{ width: 120, height: 120, borderRadius: 4 }}
                  source={
                    uploadData.imageURL
                      ? { uri: uploadData.imageURL }
                      : require("../../../../assets/icon-audio-default.png")
                  }
                />
              ) : (
                <View />
              )}
              <View style={{ marginLeft: 6 }}>
                <InputWithMentions
                  suggestionsStyles={{
                    top: 80,
                    width: SCREEN_WIDTH - 160,
                  }}
                  placeholder={"Write caption"}
                  focused={focused}
                  setFocused={setFocused}
                  description={post.description}
                  setDescription={(item) => {
                    setPost({
                      ...post,
                      description: item,
                    });
                  }}
                  inputStyles={{
                    color: "white",
                    width: SCREEN_WIDTH - 160,
                    height: 80,
                  }}
                  placeholderColor={colors.transparentWhite4}
                />
              </View>
            </View>
          </View>

          {uploadData.audioObject ? (
            <View style={{ paddingHorizontal: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "white",
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                }}
              >
                <TextInput
                  style={[
                    {
                      fontFamily: Fonts.Regular,
                      width: "100%",
                      color: "white",
                    },
                  ]}
                  placeholder="Name Audio Track"
                  placeholderTextColor={colors.white}
                  cursorColor={"white"}
                  value={uploadData.audioObject.name}
                  onChangeText={(text) =>
                    setUploadData({
                      ...uploadData,
                      audioObject: {
                        ...uploadData.audioObject,
                        name: text,
                      },
                    })
                  }
                />
              </View>
            </View>
          ) : (
            <View />
          )}

          {focused ? (
            <Pressable
              style={{
                flex: 1,
                width: SCREEN_WIDTH,
                minHeight: 200,
              }}
              onPress={() => Keyboard.dismiss()}
            ></Pressable>
          ) : (
            <View>
              <View style={{ paddingHorizontal: 8 }}>
                <TagsWrapper
                  tags={post.tags}
                  setTags={(item) => {
                    setPost({
                      ...post,
                      tags: item,
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Add Tags
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {post.tags.length > 0 ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.purple }}
                        >
                          {`#${post.tags.join(" #")}`}
                        </BodyText>
                      ) : (
                        <View />
                      )}
                      <Ionicons
                        name="chevron-forward-outline"
                        size={18}
                        color="white"
                      />
                    </View>
                  </View>
                </TagsWrapper>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <LocationButton
                  setLocation={(item) => {
                    setPost({
                      ...post,
                      location: item,
                    });
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                      Add Location
                    </BodyText>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {post.location ? (
                        <BodyText
                          style={{ fontSize: 14, color: colors.purple }}
                        >
                          {post.location}
                        </BodyText>
                      ) : (
                        <View />
                      )}
                      <Ionicons
                        name="chevron-forward-outline"
                        size={18}
                        color="white"
                      />
                    </View>
                  </View>
                </LocationButton>
              </View>

              <View style={{ paddingHorizontal: 8 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setPhase("advanced");
                  }}
                >
                  <BodyText style={{ marginLeft: 4, fontSize: 14 }}>
                    Advanced Settings
                  </BodyText>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
