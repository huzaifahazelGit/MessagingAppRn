import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import SubmissionListAudioPlayer from "../../../components/audio/submission-list-audio-player";
import { colors } from "../../../constants/colors";
import { DEFAULT_ID, IS_ANDROID } from "../../../constants/utils";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import { useMe } from "../../../hooks/useMe";
import { OverallChallengeStatus } from "../../../providers/current-challenge-provider";
import ArenaDetailSingleItemScreen from "./arena-detail-single-item";
import { BoldMonoText } from "../../../components/text";
import { useTrackPlayerContext } from "../../../hooks/useTrackPlayerContext";
import { useCurrentTrack } from "../../../hooks/useCurrentTrack";

export default function ArenaDetailViewSubmissionsScreen() {
  const me = useMe();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const {
    currentChallenge,
    overallChallengeStatus,
    voteStatusText,
    submissions,
  } = useChallengeContext();

  const currentTrack = useCurrentTrack();

  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [didSetUp, setDidSetUp] = useState(false);
  let userId = me && me.id ? me.id : DEFAULT_ID;

  const { setUpSubmissions, clearCurrentAudio } = useTrackPlayerContext();

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
    if (currentChallenge && currentChallenge.ownerId == userId) {
      return true;
    }
    return false;
  }, [currentChallenge, me.id, userId]);

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
            canVote={false}
            onSubmitVote={(submission) => {}}
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
              marginTop: -10,
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
              <Image
                style={{
                  width: 160,
                  height: 60,
                }}
                contentFit={"contain"}
                source={require("../../../../assets/icon-title.png")}
              />
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

          <SubmissionListAudioPlayer
            asGrid={true}
            posts={sortedSubmissions as any[]}
            selectedSubmission={viewingSubmission}
            setSelectedSubmission={setViewingSubmission}
            canVote={false}
            showResults={
              overallChallengeStatus == OverallChallengeStatus.finished
            }
            winningSubmissionIds={currentChallenge.winningSubmissionIds || []}
            showVotes={currentChallenge.allowsVoting || isAdminOrOwner}
            onSubmitVote={(submission) => {}}
            currentTrack={currentTrack}
            viewFullSubmission={(submission) => {
              setViewingSubmission(submission);
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <BoldMonoText>{voteStatusText}</BoldMonoText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
