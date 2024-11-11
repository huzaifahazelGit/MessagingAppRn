import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import AvatarList from "../../../components/lists/avatar-list";
import { LightButton } from "../../../components/buttons/buttons";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_HEIGHT } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { Challenge } from "../../../models/challenge";
import { Submission } from "../../../models/submission";
import { uploadFileAsync } from "../../../services/upload-service";
import { SubmissionPostImagePrevew } from "../../create/select-phase/post-image-preview";
import { useChallengeContext } from "../../../hooks/useChallengeContext";

export const ConfirmModal = ({
  showingConfirm,
  setShowingConfirm,
  setShowingThanks,
  selectedSubmission,
  challenge,
  challengeId,
}: {
  showingConfirm: boolean;
  setShowingConfirm: any;
  setShowingThanks: any;
  selectedSubmission: Submission;
  challenge: Challenge;
  challengeId: string;
}) => {
  const { onAddSubmission } = useChallengeContext();
  const [loading, setLoading] = useState(false);
  const me = useMe();

  const createSubmission = async () => {
    setLoading(true);

    let url = selectedSubmission.audio ? selectedSubmission.audio : "";

    if (selectedSubmission.postId && selectedSubmission.audio) {
      url = await uploadFileAsync(
        getStorage(),
        selectedSubmission.audio,
        `submissions/${challengeId}/audio`
      );
    }

    setLoading(false);
    setShowingConfirm(false);

    await addDoc(collection(getFirestore(), "submissions"), {
      ...selectedSubmission,
      audio: url,
    });

    onAddSubmission({ ...selectedSubmission, audio: url });

    let updateObj: any = {
      memberIds: arrayUnion(me.id),
    };
    const ref = doc(getFirestore(), "challenges", challengeId);
    if (me && me.profilePicture) {
      updateObj = {
        ...updateObj,
        submissionUserImages: arrayUnion(me.profilePicture),
      };
    }
    if (selectedSubmission && selectedSubmission.imageNumber) {
      updateObj = {
        ...updateObj,
        usedImageNumbers: arrayUnion(selectedSubmission.imageNumber),
      };
    }

    updateDoc(ref, {
      ...updateObj,
    });

    await updateDoc(doc(getFirestore(), "users", me.id), {
      submissionCount: increment(1),
    });

    setTimeout(() => {
      setShowingThanks(true);
    }, 200);
  };

  return (
    <Modal visible={showingConfirm} transparent={true} animationType={"fade"}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setShowingConfirm(false)}
        ></TouchableOpacity>
        <View
          style={{
            height: SCREEN_HEIGHT * 0.65,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,

            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <SubmissionPostImagePrevew
                width={240}
                submission={selectedSubmission}
              />
            </View>
            <BoldMonoText
              style={{
                marginTop: 20,
                color: "black",
                fontSize: 18,
                textAlign: "center",
                paddingHorizontal: 20,
              }}
            >{`You’re about to submit to “${challenge.title}"`}</BoldMonoText>
            <BodyText style={{ color: "black", opacity: 0.5, marginTop: 20 }}>
              You can't undo this action.
            </BodyText>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <AvatarList
                avatars={challenge.submissionUserImages || []}
                totalCount={challenge ? (challenge.memberIds || []).length : 0}
              />
            </View>
          </View>

          <View style={{ paddingBottom: 30, paddingHorizontal: 10 }}>
            <LightButton
              submit={createSubmission}
              title={"CONFIRM"}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
