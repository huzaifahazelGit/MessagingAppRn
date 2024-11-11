import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileImage from "../../../components/images/profile-image";
import NavBar from "../../../components/navbar";
import { BodyText, BoldMonoText } from "../../../components/text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";

import { LinearGradient } from "expo-linear-gradient";
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
import { colors } from "../../../constants/colors";
import { useChallengeContext } from "../../../hooks/useChallengeContext";
import { Activity } from "../../../models/activity";
import { Submission } from "../../../models/submission";
import { User } from "../../../models/user";

export default function ConfirmWinnerScreen() {
  const [loaded, setLoaded] = useState(false);
  const [winners, setWinners] = useState([]);

  const [winningSubmissions, setWinningSubmissions] = useState<Submission[]>(
    []
  );
  const { currentChallenge, submissions, onUpdateChallenge } =
    useChallengeContext();

  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    let promises = [];
    let winningItems = [];

    let sorted = submissions.sort((a, b) => {
      return (b.votes || []).length - (a.votes || []).length;
    });
    var index = 0;
    sorted.forEach((vote) => {
      if (index < currentChallenge.numWinners) {
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
    await updateDoc(doc(getFirestore(), "challenges", currentChallenge.id), {
      ...updates,
    });

    onUpdateChallenge({ ...currentChallenge, ...updates });

    winningSubmissions.forEach(async (submission) => {
      let winner = winners.find((winner) => winner.id === submission.userId);
      if (winner) {
        updateDoc(doc(getFirestore(), "users", winner.id), {
          winCount: increment(1),
        });

        let newXp = {
          points: currentChallenge.xpRewarded,
          kind: "winChallenge",
          userId: winner.id,
          challengeId: currentChallenge.id,
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
          challengeId: currentChallenge.id,
          cleared: false,
          bodyText: `You won the challenge “${currentChallenge.title}”!`,
          postKind: null,
          postImage: currentChallenge.coverImage,
          timeCreated: new Date(),
          unread: true,
        };
        await addDoc(collection(getFirestore(), "activity"), {
          ...act,
        });
      }
    });

    setLoaded(true);
  };

  if (!currentChallenge) {
    return <View />;
  }
  return (
    <View>
      <Image
        source={{ uri: currentChallenge.coverImage }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      >
        <LinearGradient
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,

            position: "absolute",
          }}
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        ></LinearGradient>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <NavBar includeBack={true} title="Invite Friends" skipTitle={true} />
          <View style={{ height: 200, marginTop: 120 }}>
            <ScrollView
              style={{ height: 200 }}
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ height: 200 }}>
                {loaded ? (
                  <View
                    style={{
                      minWidth: SCREEN_WIDTH,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {[...winningSubmissions].map((item) => {
                      return (
                        <WinnerView
                          submission={item}
                          users={winners}
                          key={item.id}
                        />
                      );
                    })}
                  </View>
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
              </View>
            </ScrollView>
          </View>
          <View style={{ alignItems: "center" }}>
            <BoldMonoText
              style={{
                fontSize: 18,
                textAlign: "center",
                paddingHorizontal: 20,
              }}
            >{`Are you sure you'd like to confirm these winners for “${currentChallenge.title}"?`}</BoldMonoText>
          </View>

          <View
            style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}
          >
            <View style={{ paddingBottom: 30, paddingHorizontal: 10 }}>
              <LightButton
                disabled={!loaded}
                submit={submit}
                title={"CONFIRM"}
                textColor="black"
                style={{
                  backgroundColor: colors.purple,
                  borderColor: colors.purple,
                }}
                loading={false}
              />
            </View>
          </View>
        </SafeAreaView>
      </Image>
    </View>
  );
}

const WinnerView = ({
  submission,
  users,
}: {
  submission: Submission;
  users: User[];
}) => {
  const selectedWinner = useMemo(() => {
    return users.find((winner) => winner.id === submission.userId);
  }, [submission, users]);

  if (!selectedWinner) {
    return (
      <View
        style={{
          paddingRight: 20,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <BodyText>Loading...</BodyText>
      </View>
    );
  }
  return (
    <View
      style={{
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <ProfileImage
        border={true}
        size={80}
        user={selectedWinner}
        includeBlank={true}
      />
      <BoldMonoText
        style={{
          marginTop: 4,
          width: 120,
          textAlign: "center",
          fontSize: 18,
        }}
      >
        {selectedWinner.username}
      </BoldMonoText>
      <BodyText
        style={{
          marginTop: 4,
          width: 120,
          textAlign: "center",
        }}
      >
        {submission.uploadTitle}
      </BodyText>
    </View>
  );
};
