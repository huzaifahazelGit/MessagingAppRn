import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { increment } from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { LightButton } from "../../../components/buttons/buttons";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";
import { Activity } from "../../../models/activity";
import { Challenge } from "../../../models/challenge";
import { Submission } from "../../../models/submission";

export default function ConfirmWinnersModal({
  showingConfirmWinners,
  setShowingConfirm,
  challenge,
  votes,
}: {
  showingConfirmWinners: boolean;
  setShowingConfirm: any;
  challenge: Challenge;
  votes: Submission[];
}) {
  const [loaded, setLoaded] = useState(false);
  const [winners, setWinners] = useState([]);
  const [winningSubmissions, setWinningSubmissions] = useState<Submission[]>(
    []
  );

  useEffect(() => {
    if (showingConfirmWinners) {
      setLoaded(false);
      loadWinners();
    }
  }, [showingConfirmWinners]);

  const loadWinners = async () => {
    let promises = [];
    let winningItems = [];

    let sorted = votes.sort((a, b) => {
      return (b.votes || []).length - (a.votes || []).length;
    });
    var index = 0;
    sorted.forEach((vote) => {
      if (index < challenge.numWinners) {
        const docRef = doc(getFirestore(), "users", vote.userId);
        promises.push(
          getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
        );
        winningItems.push(vote);

        index++;
      }
    });

    let users = await Promise.all(promises);
    setWinningSubmissions(winningItems);
    setWinners(users);
    setLoaded(true);
  };

  const submit = async () => {
    setLoaded(false);
    let updates = {
      winnerIds: winners.map((winner) => winner.id),
      winningSubmissionIds: winningSubmissions.map((item) => item.id),
      complete: true,
    };
    await updateDoc(doc(getFirestore(), "challenges", challenge.id), {
      ...updates,
    });

    winningSubmissions.forEach(async (submission) => {
      let winner = winners.find((winner) => winner.id === submission.userId);
      if (winner) {
        updateDoc(doc(getFirestore(), "users", winner.id), {
          winCount: increment(1),
        });

        let newXp = {
          points: challenge.xpRewarded,
          kind: "winChallenge",
          userId: winner.id,
          challengeId: challenge.id,
          timeCreated: new Date(),
        };
        addDoc(collection(getFirestore(), "users", winner.id, "xp"), newXp);

        let act: Activity = {
          kind: "challenge-win",
          actorId: winner.id,
          actorName: winner.username,
          actorImage: winner.profilePicture ?? null,
          commentId: null,
          recipientId: winner.id,
          postId: null,
          challengeId: challenge.id,
          cleared: false,
          bodyText: `You won the challenge “${challenge.title}”!`,
          postKind: null,
          postImage: challenge.coverImage,
          timeCreated: new Date(),
          unread: true,
        };
        await addDoc(collection(getFirestore(), "activity"), {
          ...act,
        });
      }
    });

    setLoaded(true);
    setShowingConfirm(false);
  };

  const winnerForSubmission = (submission: Submission) => {
    return winners.find((winner) => winner.id === submission.userId);
  };

  return (
    <Modal
      visible={showingConfirmWinners}
      transparent={true}
      animationType={"fade"}
    >
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
            <BoldMonoText
              style={{
                color: "black",
                fontSize: 18,
                textAlign: "center",
                paddingHorizontal: 20,
              }}
            >{`Are you sure you'd like to confirm these winners for “${challenge.title}"?`}</BoldMonoText>
          </View>

          <View style={{ marginTop: -50 }}>
            <ScrollView
              style={{ height: 200 }}
              contentContainerStyle={{ height: 200 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {loaded ? (
                winningSubmissions.map((item) => {
                  return winnerForSubmission(item) ? (
                    <View
                      style={{
                        paddingRight: 20,
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      key={item.id}
                    >
                      <ProfileImage
                        border={true}
                        size={80}
                        user={winnerForSubmission(item)}
                        includeBlank={true}
                      />
                      <BoldMonoText
                        style={{
                          marginTop: 4,
                          width: 120,
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        {winnerForSubmission(item).username}
                      </BoldMonoText>
                      <BodyText
                        style={{
                          marginTop: 4,
                          width: 120,
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        {item.uploadTitle}
                      </BodyText>
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingRight: 20,
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      key={item.id}
                    >
                      <BodyText>Loading...</BodyText>
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    width: SCREEN_WIDTH - 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator />
                </View>
              )}
            </ScrollView>
          </View>

          <View style={{ paddingBottom: 30, paddingHorizontal: 10 }}>
            <LightButton
              disabled={!loaded}
              submit={submit}
              title={"CONFIRM"}
              loading={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
