import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View } from "react-native";
import { LightButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import { useMe } from "../../../hooks/useMe";
import {
  MyChallengeActionStatus,
  VoteKind,
} from "../../../providers/current-challenge-provider";

export default function BottomButton() {
  const { currentChallenge, myChallengeStatus, voteKind } =
    useChallengeContext();
  const navigation = useNavigation();
  const me = useMe();

  const isAdmin = useMemo(() => {
    return me && me.isAdmin;
  }, [me.isAdmin]);

  const isMultipleChoice = useMemo(() => {
    return currentChallenge && currentChallenge.kind === "multiple-choice";
  }, [currentChallenge]);

  if (!currentChallenge) {
    return <View />;
  }

  switch (myChallengeStatus) {
    case MyChallengeActionStatus.unstarted:
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <BoldMonoText style={{ textAlign: "center" }}>
            This challenge hasn't started yet.
          </BoldMonoText>
        </View>
      );
    case MyChallengeActionStatus.finished:
      return (
        <View>
          <LightButton
            submit={() => {
              if (isMultipleChoice) {
                (navigation as any).navigate("ArenaDetailChooseMCScreen", {
                  challengeId: currentChallenge.id,
                });
              } else {
                (navigation as any).navigate(
                  "ArenaDetailViewSubmissionsScreen",
                  {
                    challengeId: currentChallenge.id,
                  }
                );
              }
            }}
            title={isMultipleChoice ? "VIEW RESULTS" : "VIEW SUBMISSIONS"}
            loading={false}
            style={{
              backgroundColor: colors.purple,
              borderColor: colors.purple,
            }}
          />
        </View>
      );
    case MyChallengeActionStatus.shouldSubmit:
      return (
        <View style={{}}>
          {isAdmin && !isMultipleChoice ? (
            <LightButton
              submit={() => {
                (navigation as any).navigate(
                  "ArenaDetailViewSubmissionsScreen",
                  {
                    challengeId: currentChallenge.id,
                  }
                );
              }}
              title={"VIEW SUBMISSIONS"}
              loading={false}
              outline={true}
              style={{ marginBottom: 10, borderColor: colors.purple }}
              textColor={colors.purple}
            />
          ) : (
            <View />
          )}
          <LightButton
            submit={() => {
              if (isMultipleChoice) {
                (navigation as any).navigate("ArenaDetailChooseMCScreen", {
                  challengeId: currentChallenge.id,
                });
              } else {
                (navigation as any).navigate("ArenaDetailSelect", {
                  challengeId: currentChallenge.id,
                });
              }
            }}
            title={"SUBMIT"}
            loading={false}
            style={{
              backgroundColor: colors.purple,
              borderColor: colors.purple,
            }}
          />
        </View>
      );
    case MyChallengeActionStatus.canViewSubmissionsPrevote:
      return (
        <LightButton
          submit={() => {
            if (isMultipleChoice) {
              (navigation as any).navigate("ArenaDetailChooseMCScreen", {
                challengeId: currentChallenge.id,
              });
            } else {
              (navigation as any).navigate("ArenaDetailViewSubmissionsScreen", {
                challengeId: currentChallenge.id,
              });
            }
          }}
          title={isMultipleChoice ? "VIEW RESULTS" : "VIEW SUBMISSIONS"}
          loading={false}
          style={{ backgroundColor: colors.purple, borderColor: colors.purple }}
        />
      );
    case MyChallengeActionStatus.canViewSubmissionsNovote:
      return (
        <LightButton
          submit={() => {
            if (isMultipleChoice) {
              (navigation as any).navigate("ArenaDetailChooseMCScreen", {
                challengeId: currentChallenge.id,
              });
            } else {
              (navigation as any).navigate("ArenaDetailViewSubmissionsScreen", {
                challengeId: currentChallenge.id,
              });
            }
          }}
          title={isMultipleChoice ? "VIEW RESULTS" : "VIEW SUBMISSIONS"}
          loading={false}
          style={{ backgroundColor: colors.purple, borderColor: colors.purple }}
        />
      );
    case MyChallengeActionStatus.didVote:
      return (
        <LightButton
          submit={() => {
            if (isMultipleChoice) {
              (navigation as any).navigate("ArenaDetailChooseMCScreen", {
                challengeId: currentChallenge.id,
              });
            } else {
              (navigation as any).navigate("ArenaDetailViewSubmissionsScreen", {
                challengeId: currentChallenge.id,
              });
            }
          }}
          title={isMultipleChoice ? "VIEW RESULTS" : "VIEW SUBMISSIONS"}
          loading={false}
          style={{ backgroundColor: colors.purple, borderColor: colors.purple }}
        />
      );
    case MyChallengeActionStatus.canVote:
      return (
        <LightButton
          submit={() => {
            (navigation as any).navigate("ArenaDetailVoteScreen", {
              challengeId: currentChallenge.id,
            });
          }}
          title={
            voteKind == VoteKind.allVote
              ? "VOTE"
              : currentChallenge.numWinners == 1
              ? "MAKE SELECTION"
              : `SELECT ${currentChallenge.numWinners} WINNERS`
          }
          loading={false}
          style={{
            backgroundColor: colors.blue,
            borderColor: colors.blue,
          }}
          textColor="black"
        />
      );

    case MyChallengeActionStatus.adminVote:
      return (
        <LightButton
          submit={() => {
            (navigation as any).navigate("ArenaDetailVoteScreen", {
              challengeId: currentChallenge.id,
            });
          }}
          title={
            voteKind == VoteKind.allVote
              ? "VOTE"
              : currentChallenge.numWinners == 1
              ? "MAKE SELECTION"
              : `SELECT ${currentChallenge.numWinners} WINNERS`
          }
          loading={false}
          style={{
            backgroundColor: colors.blue,
            borderColor: colors.blue,
          }}
          textColor="black"
        />
      );
    case MyChallengeActionStatus.needsOwnerComplete:
      return (
        <LightButton
          submit={() => {
            (navigation as any).navigate("ArenaDetailVoteScreen", {
              challengeId: currentChallenge.id,
            });
          }}
          title={
            voteKind == VoteKind.allVote
              ? "VOTE"
              : currentChallenge.numWinners == 1
              ? "MAKE SELECTION"
              : `SELECT ${currentChallenge.numWinners} WINNERS`
          }
          loading={false}
          style={{
            backgroundColor: colors.blue,
            borderColor: colors.blue,
          }}
          textColor="black"
        />
      );
  }

  return <View></View>;
}
