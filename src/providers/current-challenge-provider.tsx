import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { useUserMeetsChallengeRequirements } from "../hooks/useArenaProfileRequirements";
import { useMe } from "../hooks/useMe";
import { Challenge } from "../models/challenge";
import { DEFAULT_ID } from "../constants/utils";
import { Submission } from "../models/submission";
export const CurrentChallengeContext = React.createContext(null);

export enum OverallChallengeStatus {
  unstarted = "unstarted",
  finished = "finished",
  submitting = "submitting",
  voting = "voting",
  awaitingWinner = "awaitingWinner",
}

export enum MyChallengeActionStatus {
  unstarted = "unstarted",
  finished = "finished",
  shouldSubmit = "shouldSubmit",
  canViewSubmissionsPrevote = "canViewSubmissionsPrevote",
  canViewSubmissionsNovote = "canViewSubmissionsNovote",
  canVote = "canVote",
  didVote = "didVote",
  adminVote = "adminVote",
  needsOwnerComplete = "needsOwnerComplete",
}

export enum VoteKind {
  allVote = "allVote",
  ownerVoteSingle = "ownerVoteSingle",
  ownerVoteMultiple = "ownerVoteMultiple",
  correctChoice = "correctChoice",
}

export default function CurrentChallengeProvider({ children }) {
  const [currentChallenge, setCurrentChallenge] = React.useState(null);
  const [currentChallengeId, setCurrentChallengeId] = React.useState(null);
  const [submissions, setSubmissions] = useState([]);
  const meetsRequirements = useUserMeetsChallengeRequirements(currentChallenge);
  const me = useMe();
  let userId = me && me.id ? me.id : DEFAULT_ID;

  const selectChallenge = async (challengeId: string) => {
    if (challengeId) {
      console.log("selectChallenge", challengeId);
      setCurrentChallengeId(challengeId);
      const docRef = doc(getFirestore(), "challenges", challengeId);
      let challengeSnapshot = await getDoc(docRef);
      let challenge = {
        ...challengeSnapshot.data(),
        id: challengeId,
      } as Challenge;
      setCurrentChallenge(challenge);

      const coll = collection(getFirestore(), "submissions");
      const qref = query(coll, where("challengeId", "==", challenge.id));

      const snapshot = await getDocs(qref);

      let subs = [];
      snapshot.forEach((doc) => {
        subs.push({ ...doc.data(), id: doc.id });
      });
      setSubmissions(subs);
    } else {
      setCurrentChallenge(null);
      setCurrentChallengeId(null);
      setSubmissions([]);
    }
  };

  const didSubmit = useMemo(() => {
    if (currentChallenge) {
      return (currentChallenge.memberIds || []).includes(userId);
    } else {
      return false;
    }
  }, [currentChallenge, userId]);

  const challengeIsStarted = useMemo(() => {
    if (currentChallenge && currentChallenge.startDate) {
      return moment().isAfter(
        moment(new Date(currentChallenge.startDate.seconds * 1000))
      );
    }
    return false;
  }, [currentChallenge]);

  const votingIsStarted = useMemo(() => {
    if (currentChallenge && currentChallenge.voteDate) {
      return moment().isAfter(
        moment(new Date(currentChallenge.voteDate.seconds * 1000))
      );
    }
    return false;
  }, [currentChallenge]);

  const challengeIsFinished = useMemo(() => {
    if (currentChallenge && currentChallenge.endDate) {
      return moment().isAfter(
        moment(new Date(currentChallenge.endDate.seconds * 1000))
      );
    }
    return false;
  }, [currentChallenge]);

  const formattedStartDate = useMemo(() => {
    if (currentChallenge && currentChallenge.startDate) {
      return moment(new Date(currentChallenge.startDate.seconds * 1000)).format(
        "MMM Do, YYYY"
      );
    }
    return "";
  }, [currentChallenge]);

  const formattedVoteDate = useMemo(() => {
    if (currentChallenge && currentChallenge.voteDate) {
      return moment(new Date(currentChallenge.voteDate.seconds * 1000)).format(
        "MMM Do, YYYY"
      );
    }
    return "";
  }, [currentChallenge]);

  const formattedEndDate = useMemo(() => {
    if (currentChallenge && currentChallenge.endDate) {
      return moment(new Date(currentChallenge.endDate.seconds * 1000)).format(
        "MMM Do, YYYY"
      );
    }
    return "";
  }, [currentChallenge]);

  const myVotes = useMemo(() => {
    return (submissions || []).filter((s) => (s.votes || []).includes(userId));
  }, [submissions, userId]);

  const didVote = useMemo(() => {
    return (myVotes || []).length > 0;
  }, [myVotes]);

  const mySubmissions = useMemo(() => {
    return (submissions || []).filter((s) => s.userId == userId);
  }, [submissions, userId]);

  const didAddMaxSubmissions = useMemo(() => {
    if (currentChallenge) {
      return mySubmissions.length >= currentChallenge.maxSubmissions;
    } else {
      return false;
    }
  }, [currentChallenge, mySubmissions, userId]);

  const overallChallengeStatus = useMemo(() => {
    if (!challengeIsStarted) {
      return OverallChallengeStatus.unstarted;
    } else if (currentChallenge && currentChallenge.complete) {
      return OverallChallengeStatus.finished;
    } else if (!votingIsStarted) {
      return OverallChallengeStatus.submitting;
    } else if (votingIsStarted && !challengeIsFinished) {
      return OverallChallengeStatus.voting;
    } else {
      return OverallChallengeStatus.awaitingWinner;
    }
  }, [challengeIsStarted, votingIsStarted, challengeIsFinished]);

  const isAdmin = useMemo(() => {
    if (!me) {
      return false;
    }
    return me.isAdmin || false;
  }, [me?.isAdmin]);

  const isOwner = useMemo(() => {
    if (!currentChallenge) {
      return false;
    }
    if (
      !currentChallenge.ownerId &&
      overallChallengeStatus == OverallChallengeStatus.awaitingWinner
    ) {
      return isAdmin;
    }
    return currentChallenge && currentChallenge.ownerId == userId;
  }, [currentChallenge, userId, isAdmin, overallChallengeStatus]);

  const voteKind = useMemo(() => {
    if (!currentChallenge) {
      return VoteKind.allVote;
    }
    if (currentChallenge.kind == "multiple-choice") {
      return VoteKind.correctChoice;
    }
    if (currentChallenge.allowsVoting) {
      return VoteKind.allVote;
    }
    if (currentChallenge && currentChallenge.numWinners > 1) {
      return VoteKind.ownerVoteMultiple;
    } else {
      return VoteKind.ownerVoteSingle;
    }
  }, [isOwner, currentChallenge]);

  const myChallengeStatus = useMemo(() => {
    if (
      currentChallenge &&
      currentChallenge.kind == "multiple-choice" &&
      didVote
    ) {
      return MyChallengeActionStatus.finished;
    }
    switch (overallChallengeStatus) {
      case OverallChallengeStatus.unstarted:
        return MyChallengeActionStatus.unstarted;
      case OverallChallengeStatus.finished:
        return MyChallengeActionStatus.finished;
      case OverallChallengeStatus.submitting:
        if (didSubmit || isOwner) {
          return MyChallengeActionStatus.canViewSubmissionsPrevote;
        }
        if (!didAddMaxSubmissions) {
          if (meetsRequirements) {
            return MyChallengeActionStatus.shouldSubmit;
          } else {
            return MyChallengeActionStatus.canViewSubmissionsPrevote;
          }
        } else {
          if (currentChallenge && currentChallenge.allowsVoting) {
            return MyChallengeActionStatus.canViewSubmissionsPrevote;
          } else {
            return MyChallengeActionStatus.canViewSubmissionsNovote;
          }
        }

      case OverallChallengeStatus.voting:
        if (currentChallenge && currentChallenge.allowsVoting) {
          if (didVote) {
            return MyChallengeActionStatus.didVote;
          } else {
            return MyChallengeActionStatus.canVote;
          }
        } else if (currentChallenge.ownerId == userId) {
          return MyChallengeActionStatus.adminVote;
        } else {
          return MyChallengeActionStatus.canViewSubmissionsNovote;
        }
      case OverallChallengeStatus.awaitingWinner:
        if (isOwner) {
          return MyChallengeActionStatus.needsOwnerComplete;
        } else {
          return MyChallengeActionStatus.canViewSubmissionsNovote;
        }
    }
  }, [
    currentChallenge,
    overallChallengeStatus,
    didAddMaxSubmissions,
    didVote,
    userId,
    meetsRequirements,
  ]);

  const voteStatusText = useMemo(() => {
    switch (myChallengeStatus) {
      case MyChallengeActionStatus.canViewSubmissionsPrevote:
        return `Voting will start ${formattedVoteDate}`;
      case MyChallengeActionStatus.canViewSubmissionsNovote:
        return `Winners will be selected ${formattedEndDate}`;
      case MyChallengeActionStatus.didVote:
        return "You have already voted.";
      case MyChallengeActionStatus.finished:
        return `Voting ended on ${formattedEndDate}`;
    }

    return "";
  }, [myChallengeStatus, formattedVoteDate, formattedEndDate]);

  const challengeStatusText = useMemo(() => {
    switch (myChallengeStatus) {
      case MyChallengeActionStatus.unstarted:
        return `Challenge Starts: ${formattedStartDate}`;
      case MyChallengeActionStatus.finished:
        `Ended ${formattedEndDate}`;
      case MyChallengeActionStatus.shouldSubmit:
        return `Submission Deadline: ${formattedVoteDate}`;
      case MyChallengeActionStatus.canViewSubmissionsPrevote:
        return `VOTING Starts: ${formattedVoteDate}`;
      case MyChallengeActionStatus.canViewSubmissionsNovote:
        return `Challenge Ends: ${formattedEndDate}`;
      case MyChallengeActionStatus.canVote:
        return `Voting Ends: ${formattedEndDate}`;
      case MyChallengeActionStatus.didVote:
        return `Voting Ends: ${formattedEndDate}`;
      case MyChallengeActionStatus.adminVote:
        return `Select Winners: ${formattedEndDate}`;
      case MyChallengeActionStatus.needsOwnerComplete:
        return `Select Winners: ${formattedEndDate}`;
    }
  }, [
    myChallengeStatus,
    formattedStartDate,
    formattedVoteDate,
    formattedEndDate,
  ]);

  const canVote = useMemo(() => {
    if (myChallengeStatus == MyChallengeActionStatus.canVote) {
      return true;
    }
    if (myChallengeStatus == MyChallengeActionStatus.adminVote) {
      return true;
    }
    if (myChallengeStatus == MyChallengeActionStatus.needsOwnerComplete) {
      return true;
    }

    return false;
  }, [myChallengeStatus]);

  const hasTotalVotes = useMemo(() => {
    if (!currentChallenge) {
      return false;
    }
    let votesNeeded = Math.min(submissions.length, currentChallenge.numWinners);
    if (myVotes.length >= votesNeeded) {
      return true;
    } else {
      return false;
    }
  }, [myVotes, submissions, currentChallenge]);

  const canConfirmWinners = useMemo(() => {
    if (
      myChallengeStatus == MyChallengeActionStatus.adminVote ||
      myChallengeStatus == MyChallengeActionStatus.needsOwnerComplete
    ) {
      if (hasTotalVotes) {
        return true;
      }
    } else {
      return false;
    }
  }, [myChallengeStatus, hasTotalVotes]);

  const myCurrentStatusText = useMemo(() => {
    if (myChallengeStatus == MyChallengeActionStatus.didVote) {
      return "You have already voted in this challenge.";
    }

    if (
      myChallengeStatus == MyChallengeActionStatus.canViewSubmissionsNovote ||
      myChallengeStatus == MyChallengeActionStatus.canViewSubmissionsPrevote
    ) {
      return `You have already submitted to this challenge.`;
    }

    return null;
  }, []);

  const onAddSubmission = (submission: Submission) => {
    setSubmissions([...submissions, submission]);
  };
  const onUpdateChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
  };
  const onAddVote = (submission: Submission, userId: string) => {
    setCurrentChallenge({
      ...currentChallenge,
      voteCount: currentChallenge.voteCount + 1,
    });
    setSubmissions([
      ...submissions.filter((item) => item.id != submission.id),
      { ...submission, votes: [...submission.votes, userId] },
    ]);
  };

  return (
    <CurrentChallengeContext.Provider
      value={{
        selectChallenge,
        currentChallenge,
        overallChallengeStatus,
        myChallengeStatus,
        challengeStatusText,
        submissions,
        didSubmit,
        didVote,
        voteStatusText,
        onAddSubmission,
        onUpdateChallenge,
        onAddVote,
        isOwner,
        voteKind,
        myVotes,
        canVote,
        canConfirmWinners,
        myCurrentStatusText,
        hasTotalVotes,
      }}
    >
      {children}
    </CurrentChallengeContext.Provider>
  );
}
