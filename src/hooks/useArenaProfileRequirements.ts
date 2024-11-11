import { Challenge } from "../models/challenge";
import { useMe } from "./useMe";

export const useChallengeHasRequirements = (challenge: Challenge): boolean => {
  if (challenge && challenge.profileRequirements) {
    return (
      challenge.profileRequirements.hasSocialLink ||
      challenge.profileRequirements.premiumOnly ||
      challenge.profileRequirements.minFollowers > 0 ||
      challenge.profileRequirements.isPreviousWinner ||
      challenge.profileRequirements.minPosts > 0 ||
      challenge.profileRequirements.minXP > 0 ||
      challenge.profileRequirements.hasBeenCosigned ||
      challenge.profileRequirements.hasWrittenCosign
    );
  }
  return false;
};

export const useUserMeetsChallengeRequirements = (
  challenge: Challenge
): boolean => {
  const me = useMe();
  const hasRequirements = useChallengeHasRequirements(challenge);

  if (!hasRequirements) {
    return true;
  }

  if (!me || !me.id || !challenge || !challenge.profileRequirements) {
    return false;
  }

  if (challenge.profileRequirements.hasSocialLink) {
    if (
      me.instagram ||
      me.twitter ||
      me.website ||
      me.spotify ||
      me.youtube ||
      me.soundcloud
    ) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.premiumOnly) {
    if (
      me.accessLevel == "premium_monthly" ||
      me.accessLevel == "premium_yearly"
    ) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.minFollowers > 0) {
    if (me.followerCount >= challenge.profileRequirements.minFollowers) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.minXP > 0) {
    if (me.xp >= challenge.profileRequirements.minXP) {
      // good
    } else {
      return false;
    }
  }

  if (challenge.profileRequirements.minPosts > 0) {
    if (me.postCount >= challenge.profileRequirements.minPosts) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.isPreviousWinner) {
    if (me.winCount > 0) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.hasBeenCosigned) {
    if (me.cosignCount > 0) {
      // good
    } else {
      return false;
    }
  }
  if (challenge.profileRequirements.hasWrittenCosign) {
    if (me.cosignWrittenCount > 0) {
      // good
    } else {
      return false;
    }
  }

  return true;
};
