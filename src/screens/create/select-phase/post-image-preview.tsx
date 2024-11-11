import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SoundcloudPlayer,
  YoutubePlayer,
} from "../../../components/audio/links-players";
import HeightAdjustedVideo from "../../../components/height-adjusted-video";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { TempLinksObject, UploadSelectionObject } from "../upload-constants";
import { Submission } from "../../../models/submission";
import { SpotifyPlayer } from "../../../components/audio/spotify-player";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export const UploadObjectPostImagePrevew = ({
  uploadData,
  setUploadData,
  loading,
  width,
  onCrop,
}: {
  uploadData: UploadSelectionObject;
  setUploadData: any;
  loading: boolean;
  width: number;
  onCrop: any;
}) => {
  const linksObject = useMemo(() => {
    return uploadData.linksObject;
  }, [uploadData]);

  return (
    <SimplePostImagePreview
      width={width}
      youtubeId={linksObject.youtubeId}
      spotifyId={linksObject.spotifyId}
      soundcloudLink={linksObject.soundcloudLink}
      videoURL={uploadData.videoURL}
      imageURL={uploadData.imageURL}
      audioTitle={
        uploadData && uploadData.audioObject
          ? uploadData.audioObject.name
          : undefined
      }
      onCrop={onCrop}
      linksObject={uploadData.linksObject}
      loading={loading}
      clearAudioTitle={() => {
        setUploadData({
          ...uploadData,
          audioObject: null,
        });
      }}
    />
  );
};

export const SubmissionPostImagePrevew = ({
  submission,
  width,
}: {
  submission: Submission;
  width: number;
}) => {
  if (!submission) {
    return <View />;
  }

  return (
    <SimplePostImagePreview
      width={width}
      youtubeId={submission.youtubeId}
      spotifyId={submission.spotifyId}
      soundcloudLink={submission.soundcloudLink}
      videoURL={submission.video}
      imageURL={submission.image}
      audioTitle={submission.uploadTitle}
      onCrop={null}
    />
  );
};

const SimplePostImagePreview = ({
  width,
  youtubeId,
  spotifyId,
  soundcloudLink,
  videoURL,
  imageURL,
  audioTitle,
  loading,
  clearAudioTitle,
  linksObject,
  onCrop,
}: {
  width: number;
  youtubeId?: string;
  spotifyId?: string;
  soundcloudLink?: string;
  videoURL?: string;
  imageURL?: string;
  audioTitle?: string;
  loading?: boolean;
  setVideoURL?: any;
  clearAudioTitle?: any;
  linksObject?: TempLinksObject;
  onCrop: any;
}) => {
  return (
    <View
      style={{
        width: width,
        height: youtubeId
          ? width * (9 / 16)
          : spotifyId || soundcloudLink || videoURL
          ? undefined
          : width,
        borderColor: "transparent",
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator animating={true} color={"white"} />
      ) : youtubeId ? (
        <YoutubePlayer
          youtubeId={youtubeId}
          containerWidth={width}
          webviewStyles={{}}
        />
      ) : spotifyId ? (
        <SpotifyPlayer
          spotifyId={spotifyId}
          containerWidth={width}
          smallVersion={false}
          disabled={true}
          post={
            linksObject
              ? ({
                  image: linksObject.image,
                  artistName: linksObject.artist,
                  uploadTitle: linksObject.title,
                  duration: linksObject.duration,
                } as any)
              : null
          }
        />
      ) : soundcloudLink ? (
        <SoundcloudPlayer
          soundcloudLink={soundcloudLink}
          containerWidth={width}
          webviewStyles={{}}
        />
      ) : videoURL ? (
        <HeightAdjustedVideo
          videoURL={videoURL}
          setVideoURL={(item) => {}}
          fullWidth={width - 2}
          visible={false}
        />
      ) : (
        <ImageBackground
          style={{
            width: width,
            height: width,
            borderRadius: 8,
            overflow: "hidden",
            justifyContent: "space-between",
          }}
          source={
            imageURL
              ? { uri: imageURL }
              : require("../../../../assets/icon-audio-default.png")
          }
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent"]}
            style={{
              width: width,
              height: width,
              borderRadius: 8,
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            {imageURL && onCrop ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  margin: 12,
                }}
              >
                <TouchableOpacity onPress={onCrop}>
                  <MaterialIcons name="zoom-out-map" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View></View>
            )}
            {audioTitle ? (
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.blue,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <BodyText style={{ color: "black" }}>{audioTitle}</BodyText>
                <TouchableOpacity
                  onPress={() => {
                    if (clearAudioTitle) {
                      clearAudioTitle();
                    }
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}
          </LinearGradient>
        </ImageBackground>
      )}
    </View>
  );
};
