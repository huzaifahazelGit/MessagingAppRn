import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SubmissionListAudioPlayer from "../../../components/audio/submission-list-audio-player";
import { LightButton } from "../../../components/buttons/buttons";
import { BodyText, BoldMonoText, Headline } from "../../../components/text";
import { colors } from "../../../constants/colors";
import {
  DEFAULT_ID,
  IS_ANDROID,
  SCREEN_HEIGHT,
} from "../../../constants/utils";
import { useChallengeForId } from "../../../hooks/useChallenges";
import { useMe } from "../../../hooks/useMe";
import { useChallengeSubmissions } from "../../../hooks/useSubmissions";
import { VoteModal } from "../modals/vote-modal";
import ArenaDetailSingleItemScreen from "./arena-detail-single-item";
import { useCurrentTrack } from "../../../hooks/useCurrentTrack";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import {
  MyChallengeActionStatus,
  OverallChallengeStatus,
} from "../../../providers/current-challenge-provider";
import { useTrackPlayerContext } from "../../../hooks/useTrackPlayerContext";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function ArenaDetailChooseMultipleChoiceScreen() {
  const me = useMe();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    currentChallenge,
    didVote,
    isOwner,

    canConfirmWinners,
    submissions,
    onAddVote,
  } = useChallengeContext();

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showingThanks, setShowingThanks] = useState(false);

  const didVoteOrIsOwner = useMemo(() => {
    return didVote || isOwner;
  }, [didVote, isOwner]);

  const isCorrect = useMemo(() => {
    if (selectedSubmission && selectedSubmission.correct) {
      return true;
    }
    return false;
  }, [selectedSubmission]);

  const createVote = async () => {
    const ref = doc(getFirestore(), "submissions", selectedSubmission.id);

    if (me && me.profilePicture) {
      await updateDoc(ref, {
        votes: arrayUnion(me.id),
        voterImages: arrayUnion(me.profilePicture),
      });
    } else {
      await updateDoc(ref, {
        votes: arrayUnion(me.id),
      });
    }

    let sendXp = {
      points: 1,
      kind: "sendVoteChallenge",
      userId: me.id,
      challengeId: currentChallenge.id,
      timeCreated: new Date(),
    };
    await addDoc(collection(getFirestore(), "users", me.id, "xp"), sendXp);

    if (selectedSubmission && selectedSubmission.correct) {
      let sendXp = {
        points: currentChallenge.xpRewarded,
        kind: "winChallenge",
        userId: me.id,
        challengeId: currentChallenge.id,
        timeCreated: new Date(),
      };
      await addDoc(collection(getFirestore(), "users", me.id, "xp"), sendXp);
    }

    let challengeRef = doc(getFirestore(), "challenges", currentChallenge.id);

    let updates: any = {
      voteCount: increment(1),
      memberIds: arrayUnion(me.id),
    };
    if (selectedSubmission && selectedSubmission.correct) {
      updates = {
        ...updates,
        winnerIds: arrayUnion(me.id),
      };
    }
    await updateDoc(challengeRef, {
      ...updates,
    });

    onAddVote(selectedSubmission, me.id);

    setShowingThanks(true);
  };

  if (!currentChallenge) {
    return <View />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: IS_ANDROID ? insets.top + 40 : insets.top,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={{ width: 30 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="ios-arrow-back" size={30} color={"white"} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BoldMonoText style={{ fontSize: 24 }}>
              {currentChallenge ? currentChallenge.title : ""}
            </BoldMonoText>
          </View>
          <TouchableOpacity
            style={{ width: 30, alignItems: "flex-end" }}
            onPress={() => {
              // setAsGrid(!asGrid);
            }}
          ></TouchableOpacity>
        </View>

        <BoldMonoText
          style={{
            fontSize: 20,
            marginHorizontal: 20,
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          {currentChallenge.description}
        </BoldMonoText>

        {submissions.map((choice, index) => (
          <View>
            <TouchableOpacity
              key={choice.id}
              style={{
                marginHorizontal: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                flexDirection: "row",
                backgroundColor:
                  didVoteOrIsOwner && (choice as any).correct
                    ? colors.blue
                    : "transparent",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginVertical: 8,
                borderColor:
                  didVoteOrIsOwner && (choice as any).correct
                    ? colors.blue
                    : selectedSubmission && selectedSubmission.id == choice.id
                    ? colors.purple
                    : colors.white,
              }}
              onPress={() => setSelectedSubmission(choice)}
            >
              <BoldMonoText>{(choice as any).name}</BoldMonoText>
              {((choice.votes || []).includes(me.id) ||
                (isOwner && (choice as any).correct)) && (
                <Feather
                  name={
                    didVoteOrIsOwner && (choice as any).correct
                      ? "check-circle"
                      : "x-circle"
                  }
                  style={{ marginLeft: 8 }}
                  size={20}
                  color={
                    didVoteOrIsOwner && (choice as any).correct
                      ? "white"
                      : "red"
                  }
                />
              )}
            </TouchableOpacity>
            {didVoteOrIsOwner && (
              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  opacity: 0.7,
                }}
              >
                <BoldMonoText style={{ marginLeft: 20, marginBottom: 20 }}>
                  {`${(choice.votes || []).length} vote${
                    (choice.votes || []).length == 1 ? "" : "s"
                  }`}
                </BoldMonoText>
              </View>
            )}
          </View>
        ))}

        {!didVoteOrIsOwner && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 20,
            }}
          >
            <LightButton
              submit={() => createVote()}
              style={{
                backgroundColor: colors.purple,
                borderColor: colors.purple,
              }}
              title={"SUBMIT"}
              loading={false}
              disabled={selectedSubmission == null}
            />
          </View>
        )}
      </View>

      <Modal visible={showingThanks} transparent={true} animationType={"fade"}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setShowingThanks(false);
            }}
          ></TouchableOpacity>
          <View
            style={{
              height: SCREEN_HEIGHT * 0.25,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,

              alignItems: "center",
              paddingTop: 40,
            }}
          >
            {isCorrect ? (
              <Feather name="check-circle" size={40} color="green" />
            ) : (
              <Feather name="x-circle" size={40} color="red" />
            )}
            <Headline
              style={{ color: "black", fontSize: 18, marginTop: 10 }}
            >{`Thanks for voting!`}</Headline>
            <BodyText
              style={{
                color: "black",
                opacity: 0.5,
                marginTop: 20,
                textAlign: "center",
                marginHorizontal: 40,
              }}
            >
              {isCorrect
                ? "You voted for the correct answer!"
                : "Unfortunately, you voted for the wrong answer. Better luck next time!"}
            </BodyText>
          </View>
        </View>
      </Modal>
    </View>
  );
}
