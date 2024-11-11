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

export default function ArenaDetailVoteScreen() {
  const me = useMe();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    currentChallenge,
    overallChallengeStatus,
    voteStatusText,
    didVote,
    isOwner,
    myChallengeStatus,
    canConfirmWinners,
    submissions,
    canVote,
    onAddVote,
  } = useChallengeContext();

  const { setUpSubmissions, clearCurrentAudio } = useTrackPlayerContext();

  const [didSetUp, setDidSetUp] = useState(false);
  const currentTrack = useCurrentTrack();
  const [showingConfirm, setShowingConfirm] = useState(false);
  const [showingThanks, setShowingThanks] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [asGrid, setAsGrid] = useState(false);

  const [viewingSubmission, setViewingSubmission] = useState(null);

  useEffect(() => {
    if (submissions.length > 0 && !didSetUp) {
      setDidSetUp(true);
      setUpSubmissions(submissions);
    }
  }, [submissions, didSetUp]);

  const isAdminOrOwner = useMemo(() => {
    if (me.isAdmin) {
      return true;
    }
    if (isOwner) {
      return true;
    }
    return false;
  }, [isOwner, me.id]);

  const createVote = async () => {
    setShowingConfirm(false);
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

    if (currentChallenge.allowsVoting) {
      let sendXp = {
        points: 1,
        kind: "sendVoteChallenge",
        userId: me.id,
        challengeId: currentChallenge.id,
        timeCreated: new Date(),
      };
      await addDoc(collection(getFirestore(), "users", me.id, "xp"), sendXp);

      let receiveXp = {
        points: 1,
        kind: "receiveVoteChallenge",
        userId: selectedSubmission.userId,
        challengeId: currentChallenge.id,
        timeCreated: new Date(),
      };
      await addDoc(
        collection(getFirestore(), "users", selectedSubmission.userId, "xp"),
        receiveXp
      );
    }

    let challengeRef = doc(
      getFirestore(),
      "challenges",
      selectedSubmission.challengeId
    );

    await updateDoc(challengeRef, {
      voteCount: increment(1),
    });

    let userRef = doc(getFirestore(), "users", selectedSubmission.userId);

    await updateDoc(userRef, {
      points: increment(1),
    });

    onAddVote(selectedSubmission, me.id);
    setSelectedSubmission(null);

    setShowingThanks(true);
  };

  const sortedSubmissions = useMemo(() => {
    let items = submissions || [];

    if (currentChallenge.complete) {
      items.sort(function (a, b) {
        return (b.votes || []).length - (a.votes || []).length;
      });
    }

    return items;
  }, [submissions, currentChallenge]);

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
      {viewingSubmission ? (
        <View style={{ flex: 1 }}>
          <ArenaDetailSingleItemScreen
            setViewingSubmission={setViewingSubmission}
            submission={viewingSubmission}
            canVote={canVote}
            onSubmitVote={(submission) => {
              setShowingConfirm(true);
            }}
            allSubmissions={sortedSubmissions}
          />
        </View>
      ) : (
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
                clearCurrentAudio();
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
            >
              {/* <Ionicons
                name={asGrid ? "list" : "grid"}
                size={asGrid ? 25 : 20}
                color={"white"}
              /> */}
            </TouchableOpacity>
          </View>

          {sortedSubmissions.length == 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <BoldMonoText>{"No submissions yet."}</BoldMonoText>
            </View>
          )}

          {sortedSubmissions.length > 0 && (
            <SubmissionListAudioPlayer
              asGrid={asGrid}
              currentTrack={currentTrack}
              posts={sortedSubmissions as any[]}
              selectedSubmission={selectedSubmission}
              setSelectedSubmission={setSelectedSubmission}
              canVote={canVote}
              showResults={
                overallChallengeStatus == OverallChallengeStatus.finished
              }
              winningSubmissionIds={currentChallenge.winningSubmissionIds || []}
              showVotes={currentChallenge.allowsVoting || isAdminOrOwner}
              onSubmitVote={(submission) => {
                setShowingConfirm(true);
              }}
              viewFullSubmission={(submission) => {
                setSelectedSubmission(null);
                setViewingSubmission(submission);
              }}
            />
          )}
          {canConfirmWinners && !selectedSubmission ? (
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
                submit={() => {
                  (navigation as any).navigate("ConfirmWinnerScreen", {
                    challengeId: currentChallenge.id,
                  });
                }}
                style={{
                  backgroundColor: colors.purple,
                  borderColor: colors.purple,
                }}
                title={"CONFIRM WINNERS"}
                loading={false}
              />
            </View>
          ) : canVote ? (
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
                submit={() => setShowingConfirm(true)}
                style={{
                  backgroundColor: colors.purple,
                  borderColor: colors.purple,
                }}
                title={"SUBMIT VOTE"}
                loading={false}
                disabled={selectedSubmission == null}
              />
            </View>
          ) : (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20,
              }}
            >
              <BodyText>{`no vote... ? ${myChallengeStatus}`}</BodyText>
            </View>
          )}
        </View>
      )}

      <VoteModal
        showingConfirm={showingConfirm}
        setShowingConfirm={setShowingConfirm}
        selectedSubmission={selectedSubmission}
        challenge={currentChallenge}
        createVote={createVote}
      />

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
              if (isAdminOrOwner) {
                // stay
              } else {
                navigation.goBack();
              }
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
            <Feather name="check-circle" size={40} color="black" />
            <Headline
              style={{ color: "black", fontSize: 18, marginTop: 10 }}
            >{`Thanks for voting!`}</Headline>
            <BodyText style={{ color: "black", opacity: 0.5, marginTop: 20 }}>
              Results will be published on announcement date.
            </BodyText>
          </View>
        </View>
      </Modal>
    </View>
  );
}
