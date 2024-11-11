import { useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import { useMe } from "../../../hooks/useMe";
import {
  MyChallengeActionStatus,
  OverallChallengeStatus,
} from "../../../providers/current-challenge-provider";
import ArenaViewAsOwner from "./detail-view-types/arena-view-owner";
import ArenaViewAsSubmitter from "./detail-view-types/arena-view-submitter";
import ArenaViewFinished from "./detail-view-types/arena-view-finished";

export default function ArenaDetail() {
  const me = useMe();
  const route = useRoute();
  const params = route.params as { challengeId: string };

  const {
    selectChallenge,
    currentChallenge,
    overallChallengeStatus,
    myChallengeStatus,
    isOwner,
  } = useChallengeContext();

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    const challengeId = params.challengeId;
    selectChallenge(challengeId);
  }, []);

  const isOwnerOrVotingAdmin = useMemo(() => {
    if (isOwner) {
      return true;
    }
    switch (myChallengeStatus) {
      case MyChallengeActionStatus.adminVote:
        return true;
      case MyChallengeActionStatus.didVote:
        if (me.isAdmin) {
          return true;
        }
      case MyChallengeActionStatus.needsOwnerComplete:
        if (me.isAdmin) {
          return true;
        }
      default:
        break;
    }

    return false;
  }, [currentChallenge, me.id, isOwner, myChallengeStatus]);

  if (!currentChallenge) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating />
      </View>
    );
  }

  if (
    currentChallenge &&
    overallChallengeStatus == OverallChallengeStatus.finished
  ) {
    return <ArenaViewFinished />;
  }

  if (currentChallenge && isOwnerOrVotingAdmin) {
    return <ArenaViewAsOwner />;
  }

  return <ArenaViewAsSubmitter />;
}
