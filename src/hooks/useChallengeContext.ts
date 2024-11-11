import { useContext } from "react";

import {
  CurrentChallengeContext,
  MyChallengeActionStatus,
  OverallChallengeStatus,
  VoteKind,
} from "../providers/current-challenge-provider";
import { Challenge } from "../models/challenge";
import { Submission } from "../models/submission";

export const useChallengeContext = (): {
  selectChallenge: (challengeId: string) => void;
  currentChallenge: Challenge;
  overallChallengeStatus: OverallChallengeStatus;
  myChallengeStatus: MyChallengeActionStatus;
  isOwner;
  didVote: boolean;
  didSubmit: boolean;
  canVote: boolean;
  canConfirmWinners: boolean;
  myCurrentStatusText: string;
  challengeStatusText: string;
  voteStatusText: string;
  submissions: Submission[];
  myVotes: Submission[];
  onAddSubmission: (submission: Submission) => void;
  onUpdateChallenge: (challenge: Challenge) => void;
  onAddVote: (submission: Submission, userId: string) => void;
  voteKind: VoteKind;
  hasTotalVotes: boolean;
} => {
  const {
    selectChallenge,
    currentChallenge,
    overallChallengeStatus,
    myChallengeStatus,
    didVote,
    isOwner,
    challengeStatusText,
    submissions,
    onAddSubmission,
    onUpdateChallenge,
    voteStatusText,
    myVotes,
    onAddVote,
    didSubmit,
    voteKind,
    canVote,
    canConfirmWinners,
    myCurrentStatusText,
    hasTotalVotes,
  } = useContext(CurrentChallengeContext);

  return {
    selectChallenge,
    currentChallenge,
    overallChallengeStatus,
    myChallengeStatus,
    didVote,
    isOwner,
    challengeStatusText,
    submissions,
    onAddSubmission,
    onUpdateChallenge,
    myVotes,
    onAddVote,
    didSubmit,
    voteStatusText,
    voteKind,
    canVote,
    canConfirmWinners,
    myCurrentStatusText,
    hasTotalVotes,
  };
};
