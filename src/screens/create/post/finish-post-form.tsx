import { useNavigation, useRoute } from "@react-navigation/native";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Part,
  isMentionPartType,
  parseValue,
} from "react-native-controlled-mentions";

import * as VideoThumbnails from "expo-video-thumbnails";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { IS_IOS, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { EMPTY_POST, Post, PostKind } from "../../../models/post";
import { User } from "../../../models/user";
import { bodyTextForKind } from "../../../services/activity-service";
import {
  getBlob,
  getRefForStorage,
  uploadFileAsync,
} from "../../../services/upload-service";
import { EMPTY_UPLOAD_SELECTION_OBJECT } from "../upload-constants";
import { AdvancedPhase } from "./advanced-phase";
import { CaptionPhase } from "./caption-phase";

export default function FinishFeedPostForm() {
  const me = useMe();
  const navigation = useNavigation();

  const [uploadData, setUploadData] = useState(EMPTY_UPLOAD_SELECTION_OBJECT);
  const [post, setPost] = useState(EMPTY_POST);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [imageURL, setImageUrl] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");

  const [audioURL, setAudioURL] = useState("");
  const [audioThumbnail, setAudioThumbnail] = useState("");

  const [coauthors, setCoauthors] = useState<User[]>([]);
  const [releaseDate, setReleaseDate] = useState(null);
  const [phase, setPhase] = useState<"caption" | "advanced">("caption");

  const [showingProgress, setShowingProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const route = useRoute();
  const params = route.params as any;

  useEffect(() => {
    if (me && me.id && !post.userId) {
      setPost({
        ...post,
        userId: me.id,
        collaboratorIds: [me.id],
        username: me.username,
      });
    }
  }, [me?.id, post]);

  useEffect(() => {
    let data = JSON.parse(params.uploadData);
    setUploadData(data);
    startObjectUpload(data);
  }, []);

  const reset = () => {
    navigation.goBack();
  };

  const resetAndGoBack = () => {
    if (params && params.fromArena) {
      setTimeout(() => {
        (navigation as any).navigate("Arena");
      }, 500);
    } else {
      setTimeout(() => {
        (navigation as any).navigate("Discover", { feedType: "explore" });
      }, 500);
    }

    reset();
  };

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
      : imageURL
      ? PostKind.image
      : PostKind.text;
  }, [audioURL, videoURL, uploadData, imageURL]);

  let audioThumb = audioThumbnail
    ? audioThumbnail
    : uploadData.linksObject.image
    ? uploadData.linksObject.image
    : "";

  const currentPost = useMemo(() => {
    let finalPost: Post = {
      ...post,
      uploadTitle:
        uploadData.audioObject && uploadData.audioObject.name
          ? uploadData.audioObject.name
          : uploadData.linksObject.title
          ? uploadData.linksObject.title
          : null,
      audioThumbnail: audioThumb,
      audio: audioURL ? audioURL : null,
      downloadable: uploadData.audioObject
        ? uploadData.audioObject.downloadable
        : false,
      playlistIds:
        uploadData.audioObject && uploadData.audioObject.profileDisplay
          ? [me.id]
          : [],

      createdate: releaseDate ? releaseDate : new Date(),
      delayedPost: releaseDate != null,

      video: videoURL ? videoURL : null,
      videoThumbnail: videoThumbnail ? videoThumbnail : null,
      image: imageURL
        ? imageURL
        : audioThumb
        ? audioThumb
        : videoThumbnail
        ? videoThumbnail
        : null,

      kind: currentKind as PostKind,

      spotifyId: uploadData.linksObject.spotifyId,
      artistName: uploadData.linksObject.artist,
      duration: uploadData.linksObject.duration,

      soundcloudLink: uploadData.linksObject.soundcloudLink,
      youtubeId: uploadData.linksObject.youtubeId,
      coauthors: coauthors || [],

      reposted: false,
      lastInteractor: me.id,
    };
    return finalPost;
  }, [
    me,
    audioThumbnail,
    videoURL,
    imageURL,
    audioURL,
    uploadData,
    releaseDate,
    videoThumbnail,
    currentKind,
  ]);

  const submitPost = async () => {
    const { parts } = parseValue(post.description, [
      {
        trigger: "@",
      },
    ]);

    let res = await addDoc(collection(getFirestore(), "posts"), {
      ...currentPost,
    });
    parts.forEach((part: Part) => {
      if (part.partType && isMentionPartType(part.partType)) {
        let userId = part.data?.id;
        createNewActivity(
          userId,
          { ...post, id: res.id } as any,
          "post-mention"
        );
      }
    });
    let updates: any = {
      lastReset: new Date(),
      postCount: increment(1),
    };
    if ((me.postStreak || 0) == 0) {
      updates = { ...updates, postStreak: 1 };
    }
    if (post.audio) {
      updates = { ...updates, audioCount: increment(1) };
    }
    const userRef = doc(getFirestore(), "users", me.id);
    await updateDoc(userRef, {
      ...updates,
    });

    if ((currentPost.coauthors || []).length > 0) {
      currentPost.coauthors.forEach(async (coauthor) => {
        createNewActivity(
          coauthor.id,
          { ...post, id: res.id } as any,
          "create-coauthor"
        );
      });
    }
    resetAndGoBack();
  };

  const createNewActivity = async (
    userId: string,
    post: Post,
    activityKind: string
  ) => {
    var createActivity = httpsCallable(getFunctions(), "createActivity");

    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: userId,
      kind: activityKind,
      post: {
        id: post.id,
        kind: post.kind,
        image: post.image,
      },
      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {},
    });
  };

  const ready = useMemo(() => {
    if (uploadLoading) {
      return false;
    }
    if (!audioURL && !videoURL && !currentPost.description && !imageURL) {
      return false;
    }

    return true;
  }, [me.id, audioURL, currentPost, uploadLoading, videoURL, imageURL]);

  const startObjectUpload = async (uploadData) => {
    try {
      if (uploadData.audioObject && uploadData.audioObject.uri) {
        uploadAudio(uploadData.audioObject.uri, uploadData.imageURL);
      } else if (uploadData.videoURL) {
        uploadVideo(uploadData.videoURL);
      } else if (uploadData.imageURL) {
        setUploadLoading(true);
        const url = await uploadFileAsync(
          getStorage(),
          uploadData.imageURL,
          "posts"
        );
        setImageUrl(url);
        setUploadLoading(false);
      }
    } catch (e) {
      console.log("err", e);
      Alert.alert(`Error uploading file: ${e.message}`);
      reset();
    }
  };

  const uploadVideo = async (vidUrl) => {
    setUploadLoading(true);
    const blob = await getBlob(vidUrl);
    const uploadRef = getRefForStorage(getStorage(), vidUrl, "posts");
    const uploadTask = uploadBytesResumable(uploadRef, blob);

    setShowingProgress(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        let progressInt = Math.round(progress);
        if (progressInt > 5) {
          setUploadProgress(progressInt - 5);
        }
      },
      (error) => {
        Alert.alert("Error", `${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(vidUrl);
            setUploadProgress(97);
            const videoThumb = await uploadFileAsync(
              getStorage(),
              uri,
              "posts"
            );
            setVideoThumbnail(videoThumb);
          } catch (err) {
            Alert.alert("Error", `${err.message}`);
          }

          setVideoURL(downloadURL);
          setUploadProgress(100);
          setShowingProgress(false);
          setUploadLoading(false);
        });
      }
    );
  };

  const uploadAudio = async (audioUri, imageUri) => {
    setUploadLoading(true);
    const blob = await getBlob(audioUri);
    const uploadRef = getRefForStorage(getStorage(), audioUri, "posts");
    const uploadTask = uploadBytesResumable(uploadRef, blob);

    setShowingProgress(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        let progressInt = Math.round(progress);
        if (progressInt > 5) {
          setUploadProgress(progressInt - 5);
        }
      },
      (error) => {
        Alert.alert("Error", `${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setAudioURL(downloadURL);
          if (imageUri) {
            const thumbnailURL = await uploadFileAsync(
              getStorage(),
              imageUri,
              "posts"
            );
            setAudioThumbnail(thumbnailURL);
          }
          setUploadProgress(100);
          setShowingProgress(false);
          setUploadLoading(false);
        });
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
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
                if (phase == "caption") {
                  reset();
                } else if (phase == "advanced") {
                  setPhase("caption");
                }
              }}
            />
          </View>

          <BoldMonoText style={{}}>NEW POST</BoldMonoText>

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
                  onPress={submitPost}
                >
                  <BoldMonoText style={{ color: "black" }}>POST</BoldMonoText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {phase == "caption" && (
          <CaptionPhase
            setPhase={setPhase}
            post={currentPost as Post}
            setPost={setPost}
            uploadData={uploadData}
            setUploadData={setUploadData}
          />
        )}

        {phase == "advanced" && (
          <AdvancedPhase
            releaseDate={releaseDate}
            setReleaseDate={setReleaseDate}
            uploadData={uploadData}
            setUploadData={setUploadData}
            coauthors={coauthors}
            setCoauthors={setCoauthors}
          />
        )}

        {showingProgress && (
          <View style={{ marginHorizontal: 25, paddingBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: 0.8,
                marginBottom: 6,
              }}
            >
              <BoldMonoText>UPLOADING...</BoldMonoText>
              <BoldMonoText>{`${uploadProgress}%`}</BoldMonoText>
            </View>
            <View
              style={{
                borderRadius: 4,
                width: SCREEN_WIDTH - 50,
                height: 3,
                backgroundColor: colors.transparentWhite5,
              }}
            >
              <View
                style={{
                  borderRadius: 4,
                  width: ((SCREEN_WIDTH - 50) * uploadProgress) / 100,
                  height: 3,
                  backgroundColor: colors.blue,
                }}
              ></View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
