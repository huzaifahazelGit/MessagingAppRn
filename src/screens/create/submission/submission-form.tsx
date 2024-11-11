import { useNavigation } from "@react-navigation/native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { getStorage } from "firebase/storage";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { IS_ANDROID, IS_IOS } from "../../../constants/utils";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import { useMe } from "../../../hooks/useMe";
import { PostKind } from "../../../models/post";
import { Submission } from "../../../models/submission";
import { uploadFileAsync } from "../../../services/upload-service";
import { IMAGE_NUMBERS } from "../../arena/arena-detail/arena-detail-select";
import { ConfirmModal } from "../../arena/modals/confirm-submit-modal";
import { ThanksModal } from "../../arena/modals/thanks-modal";
import { DataUploadSelectionPhase } from "../select-phase";
import {
  EMPTY_UPLOAD_SELECTION_OBJECT,
  UploadKinds,
} from "../upload-constants";
import { CaptionPhase } from "./caption-phase";

export default function ArenaDetailUploadSubmission() {
  const { onAddSubmission, currentChallenge } = useChallengeContext();
  const me = useMe();
  const navigation = useNavigation();
  const [showingConfirm, setShowingConfirm] = useState(false);
  const [showingThanks, setShowingThanks] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [uploadData, setUploadData] = useState(EMPTY_UPLOAD_SELECTION_OBJECT);
  const [videoURL, setVideoURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [phase, setPhase] = useState<"audio" | "caption">("audio");

  const currentKind = useMemo(() => {
    return audioURL
      ? PostKind.audio
      : videoURL
      ? PostKind.video
      : uploadData.linksObject.spotifyId
      ? PostKind.spotify
      : uploadData.linksObject.soundcloudLink
      ? PostKind.soundcloud
      : uploadData.linksObject.youtubeId
      ? PostKind.youtube
      : PostKind.audio;
  }, [audioURL, videoURL, uploadData]);

  const currentSubmission = useMemo(() => {
    var numberOptions = [...IMAGE_NUMBERS];
    if (currentChallenge && currentChallenge.usedImageNumbers) {
      numberOptions = numberOptions.filter(
        (item) => !currentChallenge.usedImageNumbers.includes(item)
      );
    }
    if (numberOptions.length == 0) {
      numberOptions = [...IMAGE_NUMBERS];
    }

    var imageNumber =
      numberOptions[Math.floor(Math.random() * numberOptions.length)];

    let submissionThumbnail = thumbnail
      ? thumbnail
      : uploadData.linksObject.image
      ? uploadData.linksObject.image
      : "";

    let post: Submission = {
      userId: me.id,
      userImage: me && me.profilePicture ? me.profilePicture : null,
      username: me && me.username ? me.username : "",
      uploadTitle:
        uploadData.audioObject && uploadData.audioObject.name
          ? uploadData.audioObject.name
          : uploadData.linksObject.title
          ? uploadData.linksObject.title
          : null,

      challengeId: currentChallenge.id,
      archived: false,
      createdate: new Date(),
      lastupdate: new Date(),
      image: submissionThumbnail,

      audio: audioURL
        ? audioURL
        : uploadData.audioObject
        ? uploadData.audioObject.uri
        : null,

      video: videoURL
        ? videoURL
        : uploadData.videoURL
        ? uploadData.videoURL
        : null,

      isFinalist: false,
      isWinner: false,
      votes: [],
      voterImages: [],
      imageNumber: submissionThumbnail ? null : imageNumber,
      kind: currentKind,

      soundcloudLink: uploadData.linksObject.soundcloudLink
        ? uploadData.linksObject.soundcloudLink
        : null,
      youtubeId: uploadData.linksObject.youtubeId
        ? uploadData.linksObject.youtubeId
        : null,
      spotifyId: uploadData.linksObject.spotifyId
        ? uploadData.linksObject.spotifyId
        : null,
      artistName: uploadData.linksObject.artist,
      duration: uploadData.linksObject.duration,

      postId: null,
    };
    return post;
  }, [me.id, uploadData, thumbnail, currentChallenge, audioURL, currentKind]);

  const reset = () => {
    setUploadLoading(false);

    setUploadData(EMPTY_UPLOAD_SELECTION_OBJECT);
    setVideoURL("");
    setAudioURL("");
    setThumbnail("");
    setPhase("audio");
  };

  const canMoveToCaption = useMemo(() => {
    if (
      !uploadData.videoURL &&
      !uploadData.linksObject.spotifyId &&
      !uploadData.linksObject.soundcloudLink &&
      !uploadData.linksObject.youtubeId &&
      !uploadData.audioObject
    ) {
      return false;
    }

    return true;
  }, [uploadData]);

  const ready = useMemo(() => {
    if (uploadLoading) {
      return false;
    }
    if (
      !audioURL &&
      !videoURL &&
      !uploadData.linksObject.spotifyId &&
      !uploadData.linksObject.soundcloudLink &&
      !uploadData.linksObject.youtubeId
    ) {
      return false;
    }

    return true;
  }, [me.id, audioURL, videoURL, uploadData, uploadLoading]);

  if (!currentChallenge) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      ></SafeAreaView>
    );
  }

  const startObjectUpload = async () => {
    try {
      if (uploadData.audioObject && uploadData.audioObject.uri) {
        setUploadLoading(true);
        const url = await uploadFileAsync(
          getStorage(),
          uploadData.audioObject.uri,
          `submissions/${currentChallenge.id}/audio`
        );
        setAudioURL(url);
        if (uploadData.imageURL) {
          const thumbnailURL = await uploadFileAsync(
            getStorage(),
            uploadData.imageURL,
            `submissions/${currentChallenge.id}/thumbnails`
          );
          setThumbnail(thumbnailURL);
        }
        setUploadLoading(false);
      } else if (uploadData.videoURL) {
        setUploadLoading(true);
        const videoURL = await uploadFileAsync(
          getStorage(),
          uploadData.videoURL,
          `submissions/${currentChallenge.id}/videos`
        );
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          uploadData.videoURL
        );
        const videoThumb = await uploadFileAsync(
          getStorage(),
          uri,
          `submissions/${currentChallenge.id}/thumbnails`
        );
        setThumbnail(videoThumb);
        setVideoURL(videoURL);
        setUploadLoading(false);
      }
    } catch (e) {
      console.log("err", e);
      Alert.alert(`Error uploading file: ${e.message}`);
      reset();
    }
  };

  if (!currentChallenge) {
    return <View />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            alignItems: "center",
          }}
        >
          <View style={{ width: 70 }}>
            <BackButton
              customBack={() => {
                if (phase == "audio") {
                  navigation.goBack();
                } else if (phase == "caption") {
                  reset();
                }
              }}
            />
          </View>

          <BoldMonoText style={{}}>NEW SUBMISSION</BoldMonoText>

          <View style={{ width: 70 }}>
            {phase == "caption" && (
              <View style={{ opacity: ready ? 1 : 0.6, width: 70 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.blue,
                    paddingVertical: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 14,
                    width: 70,
                  }}
                  disabled={!ready}
                  onPress={() => {
                    setShowingConfirm(true);
                  }}
                >
                  <BoldMonoText style={{ color: "black" }}>POST</BoldMonoText>
                </TouchableOpacity>
              </View>
            )}
            {phase == "audio" && (
              <TouchableOpacity
                style={{
                  borderColor: "white",
                  borderWidth: 1,
                  paddingVertical: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 14,
                  width: 70,
                }}
                onPress={() => {
                  if (canMoveToCaption) {
                    startObjectUpload();
                    setPhase("caption");
                  } else {
                    Alert.alert("Please add a media file");
                  }
                }}
              >
                <BoldMonoText style={{ color: "white" }}>NEXT</BoldMonoText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {phase == "audio" && (
          <DataUploadSelectionPhase
            uploadKinds={
              currentChallenge && currentChallenge.allowsVideo
                ? [UploadKinds.Audio, UploadKinds.Video, UploadKinds.Links]
                : [UploadKinds.Audio]
            }
            uploadData={uploadData}
            setUploadData={setUploadData}
          />
        )}

        {phase == "caption" && (
          <CaptionPhase uploadData={uploadData} setUploadData={setUploadData} />
        )}
      </KeyboardAvoidingView>

      <ConfirmModal
        showingConfirm={showingConfirm}
        setShowingConfirm={setShowingConfirm}
        selectedSubmission={currentSubmission}
        challenge={currentChallenge}
        setShowingThanks={setShowingThanks}
        challengeId={currentChallenge.id}
      />

      <ThanksModal
        showingThanks={showingThanks}
        setShowingThanks={() => {
          setShowingThanks(false);
          (navigation as any).navigate("ArenaDetails", {
            screen: "ArenaDetailScreen",
            params: {
              challengeId: currentChallenge.id,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
