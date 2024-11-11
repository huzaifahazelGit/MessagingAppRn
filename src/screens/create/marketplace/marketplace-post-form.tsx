import { useNavigation, useRoute } from "@react-navigation/native";
import * as VideoThumbnails from "expo-video-thumbnails";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native";
import {
  Part,
  isMentionPartType,
  parseValue,
} from "react-native-controlled-mentions";
import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { IS_IOS } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { MarketplaceItem } from "../../../models/marketplace";
import { Post } from "../../../models/post";
import { bodyTextForKind } from "../../../services/activity-service";
import { uploadFileAsync } from "../../../services/upload-service";
import { DataUploadSelectionPhase } from "../select-phase";
import {
  EMPTY_UPLOAD_SELECTION_OBJECT,
  UploadKinds,
} from "../upload-constants";
import { MarketplaceCaptionPhase } from "./caption-phase";

// shaoib - marketplace

export default function MarketplacePostForm() {
  const me = useMe();
  const navigation = useNavigation();

  const [uploadData, setUploadData] = useState(EMPTY_UPLOAD_SELECTION_OBJECT);
  const [location, setLocation] = useState("");
  const [imageThumbnailURL, setImageThumbnailURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [imageURL, setImageUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState({
    min: 0,
    max: 10000,
  });
  const [phase, setPhase] = useState<"audio" | "caption">("audio");
  const route = useRoute();
  const params = route.params as any;

  const submit = async () => {
    submitPost();
  };

  const reset = () => {
    setLocation("");
    setImageThumbnailURL("");
    setUploadData(EMPTY_UPLOAD_SELECTION_OBJECT);
    setImageUrl("");
    setVideoURL("");
    setDescription("");
    setTags([]);
    setPhase("audio");
  };

  const resetAndGoBack = () => {
    reset();

    if (params && params.fromArena) {
      (navigation as any).navigate("Arena");
    } else {
      (navigation as any).navigate("Discover", { feedType: "marketplace" });
    }
  };

  const currentPost = useMemo(() => {
    let post: MarketplaceItem = {
      userId: me.id,
      username: me.username,

      createdate: new Date(),
      startDate: new Date(),
      endDate: endDate,
      budgetMin: budget.min,
      budgetMax: budget.max,
      lastupdate: new Date(),
      description: description,
      image: imageURL ? imageURL : null,
      tags: [...tags, "marketplace"],
      archived: false,
      private: false,
      location: location,
      featured: false,
      likeCount: 0,
      commentCount: 0,
      likedAvatars: [],
      commentedAvatars: [],
      // @ts-ignore
      kind: videoURL ? "video" : imageURL ? "image" : "text",
      marketplace: true,
      submitCount: 0,
    };
    return post;
  }, [
    me,
    uploadData,
    description,
    imageThumbnailURL,
    tags,
    location,
    videoURL,
    imageURL,
    endDate,
    budget,
  ]);

  const submitPost = async () => {
    let post = {
      ...currentPost,
    };
    const { parts } = parseValue(post.description, [
      {
        trigger: "@",
      },
    ]);
    let res = await addDoc(collection(getFirestore(), "marketplace"), {
      ...post,
    });
    parts.forEach((part: Part) => {
      if (part.partType && isMentionPartType(part.partType)) {
        let userId = part.data?.id;
        createMentionActivity(userId, { ...post, id: res.id } as any);
      }
    });

    const userRef = doc(getFirestore(), "users", me.id);
    updateDoc(userRef, {
      lastReset: new Date(),
    });

    resetAndGoBack();
  };

  const createMentionActivity = async (userId: string, post: Post) => {
    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "post-mention";
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
    if (!videoURL && !description && !imageURL) {
      return false;
    }

    return true;
  }, [me.id, description, uploadLoading, videoURL, imageURL]);

  const startObjectUpload = async () => {
    if (uploadData.imageURL) {
      setUploadLoading(true);
      const url = await uploadFileAsync(
        getStorage(),
        uploadData.imageURL,
        "marketplace"
      );
      setImageUrl(url);
      setUploadLoading(false);
    } else if (uploadData.videoURL) {
      setUploadLoading(true);
      const url = await uploadFileAsync(
        getStorage(),
        uploadData.videoURL,
        "marketplace"
      );
      setVideoURL(url);
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        uploadData.videoURL
      );
      const videoThumb = await uploadFileAsync(
        getStorage(),
        uri,
        `marketplace`
      );
      setImageThumbnailURL(videoThumb);
      setUploadLoading(false);
    }
  };

  return (
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

        <BoldMonoText style={{}}>NEW MARKETPLACE LISTING</BoldMonoText>

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
                onPress={submit}
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
                startObjectUpload();
                setPhase("caption");
              }}
            >
              <BoldMonoText style={{ color: "white" }}>NEXT</BoldMonoText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {phase == "audio" && (
        <DataUploadSelectionPhase
          uploadKinds={[UploadKinds.Image]}
          uploadData={uploadData}
          setUploadData={setUploadData}
        />
      )}

      {phase == "caption" && (
        <MarketplaceCaptionPhase
          tags={tags}
          setTags={setTags}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
          audioObject={uploadData.audioObject}
          setAudioObject={(obj) => {
            setUploadData({
              ...uploadData,
              audioObject: obj,
            });
          }}
          setPhase={setPhase}
          imageUrl={uploadData.imageURL}
          videoUrl={uploadData.videoURL}
          budget={budget}
          setBudget={setBudget}
          deadline={endDate}
          setDeadline={setEndDate}
        />
      )}
    </KeyboardAvoidingView>
  );
}
