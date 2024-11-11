import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage } from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
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
import { EMPTY_CHALLENGE } from "../../../models/challenge";
import { Post } from "../../../models/post";
import { bodyTextForKind } from "../../../services/activity-service";
import { uploadFileAsync } from "../../../services/upload-service";
import { DataUploadSelectionPhase } from "../select-phase";
import {
  EMPTY_UPLOAD_SELECTION_OBJECT,
  UploadKinds,
} from "../upload-constants";
import { ArenaCaptionPhase } from "./caption-phase";
import { ArenaRequirementsPhase } from "./requirements-phase";
import { AdvancedPhase } from "./advanced-phase";

export default function ArenaPostForm() {
  const me = useMe();
  const navigation = useNavigation();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadData, setUploadData] = useState(EMPTY_UPLOAD_SELECTION_OBJECT);
  const [tempChallenge, setTempChallenge] = useState(EMPTY_CHALLENGE);
  const [finalImageURL, setFinalImageURL] = useState("");

  useEffect(() => {
    if (me && me.id && !tempChallenge.ownerId) {
      setTempChallenge({ ...tempChallenge, ownerId: me.id });
    }
  }, [me?.id, tempChallenge]);

  const [phase, setPhase] = useState<
    "audio" | "caption" | "requirements" | "advanced"
  >("audio");

  const challenge = useMemo(() => {
    return { ...tempChallenge, coverImage: finalImageURL };
  }, [tempChallenge, finalImageURL]);

  const submit = async () => {
    submitPost();
  };

  const reset = () => {
    setUploadData(EMPTY_UPLOAD_SELECTION_OBJECT);
    setTempChallenge(EMPTY_CHALLENGE);
    setUploadLoading(false);
    setPhase("audio");
  };

  const resetAndGoBack = () => {
    reset();

    (navigation as any).navigate("Arena");
  };

  const submitPost = async () => {
    const { parts } = parseValue(challenge.description, [
      {
        trigger: "@",
      },
    ]);
    let res = await addDoc(collection(getFirestore(), "challenges"), {
      ...challenge,
    });

    parts.forEach((part: Part) => {
      if (part.partType && isMentionPartType(part.partType)) {
        let userId = part.data?.id;
        createMentionActivity(userId, { ...challenge, id: res.id } as any);
      }
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
    if (!challenge.description || !challenge.coverImage || !challenge.title) {
      return false;
    }

    return true;
  }, [challenge, uploadLoading]);

  const startObjectUpload = async () => {
    if (uploadData.imageURL) {
      setUploadLoading(true);
      const url = await uploadFileAsync(
        getStorage(),
        uploadData.imageURL,
        "challenges"
      );
      setFinalImageURL(url);
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
              } else if (phase == "requirements") {
                setPhase("caption");
              } else if (phase == "advanced") {
                setPhase("caption");
              }
            }}
          />
        </View>

        <BoldMonoText style={{}}>
          {phase == "requirements"
            ? `PROFILE REQUIREMENTS`
            : phase == "advanced"
            ? `ADVANCED SETTINGS`
            : `NEW ARENA CHALLENGE`}
        </BoldMonoText>

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
        <ArenaCaptionPhase
          challenge={challenge}
          setChallenge={setTempChallenge}
          setPhase={setPhase}
        />
      )}

      {phase == "advanced" && (
        <AdvancedPhase challenge={challenge} setChallenge={setTempChallenge} />
      )}

      {phase == "requirements" && (
        <ArenaRequirementsPhase
          profileRequirements={challenge.profileRequirements}
          setProfileRequirements={(updates) =>
            setTempChallenge({ ...challenge, profileRequirements: updates })
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}
