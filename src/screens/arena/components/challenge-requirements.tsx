import { AntDesign } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View } from "react-native";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { Challenge } from "../../../models/challenge";
import { useChallengeHasRequirements } from "../../../hooks/useArenaProfileRequirements";

export default function ChallengeRequirements({
  challenge,
  leftSide,
}: {
  challenge: Challenge;
  leftSide?: boolean;
}) {
  const hasRequirements = useChallengeHasRequirements(challenge);
  const me = useMe();

  const userHasSocialLink = useMemo(() => {
    return (
      me.instagram ||
      me.twitter ||
      me.website ||
      me.spotify ||
      me.youtube ||
      me.soundcloud
    );
  }, [me.id]);

  const userIsPremium = useMemo(() => {
    // tara here premium
    return true;
    // return (
    //   me.accessLevel == "premium_monthly" || me.accessLevel == "premium_yearly"
    // );
  }, [me.id, me.accessLevel]);

  const userHasMinFollowers = useMemo(() => {
    return me.followerCount >= challenge.profileRequirements.minFollowers;
  }, [me.id, challenge]);

  const userHasMinPosts = useMemo(() => {
    return me.postCount >= challenge.profileRequirements.minPosts;
  }, [me.id, challenge]);

  const userHasMinXP = useMemo(() => {
    return me.xp >= challenge.profileRequirements.minXP;
  }, [me.id, challenge]);

  const userIsPreviousWinner = useMemo(() => {
    return me.winCount > 0;
  }, [me.id]);

  const userHasBeenCosigned = useMemo(() => {
    return me.cosignCount > 0;
  }, [me.id]);

  const userHasWrittenCosign = useMemo(() => {
    return me.cosignWrittenCount > 0;
  }, [me.id]);

  if (!hasRequirements) {
    return <View />;
  }

  if (!challenge || !challenge.profileRequirements) {
    return <View />;
  }

  return (
    <View
      style={
        leftSide
          ? {}
          : {
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              width: SCREEN_WIDTH,
            }
      }
    >
      {!leftSide && (
        <BoldMonoText
          style={{ opacity: 0.5, marginBottom: 8 }}
        >{`Entry Requirements:`}</BoldMonoText>
      )}

      {challenge.profileRequirements.hasSocialLink && (
        <RequirementsRow
          leftSide={leftSide}
          // @ts-ignore
          active={userHasSocialLink}
          text={`profile contains social media link`}
        />
      )}

      {challenge.profileRequirements.premiumOnly && (
        <RequirementsRow
          leftSide={leftSide}
          active={userIsPremium}
          text={`only premium users can submit`}
        />
      )}

      {challenge.profileRequirements.minFollowers > 0 && (
        <RequirementsRow
          leftSide={leftSide}
          active={userHasMinFollowers}
          text={`over ${challenge.profileRequirements.minFollowers} followers`}
        />
      )}

      {challenge.profileRequirements.minPosts > 0 && (
        <RequirementsRow
          leftSide={leftSide}
          active={userHasMinPosts}
          text={`over ${challenge.profileRequirements.minPosts} posts`}
        />
      )}

      {challenge.profileRequirements.minXP > 0 && (
        <RequirementsRow
          leftSide={leftSide}
          active={userHasMinXP}
          text={`over ${challenge.profileRequirements.minXP} XP`}
        />
      )}

      {challenge.profileRequirements.isPreviousWinner && (
        <RequirementsRow
          leftSide={leftSide}
          active={userIsPreviousWinner}
          text={`previous winner`}
        />
      )}

      {challenge.profileRequirements.hasBeenCosigned && (
        <RequirementsRow
          leftSide={leftSide}
          active={userHasBeenCosigned}
          text={`profile has been endorsed`}
        />
      )}

      {challenge.profileRequirements.hasWrittenCosign && (
        <RequirementsRow
          leftSide={leftSide}
          active={userHasWrittenCosign}
          text={`has written an endorsement`}
        />
      )}
    </View>
  );
}

const RequirementsRow = ({
  leftSide,
  active,
  text,
}: {
  leftSide: boolean;
  active: boolean;
  text: string;
}) => {
  return (
    <View
      style={
        leftSide
          ? { flexDirection: "row", alignItems: "center" }
          : {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
            }
      }
    >
      {active ? (
        <AntDesign name="checkcircleo" size={12} color={colors.blue} />
      ) : (
        <AntDesign name="closecircleo" size={12} color="white" />
      )}

      <BodyText style={{ marginLeft: 12 }}>{text}</BodyText>
    </View>
  );
};
