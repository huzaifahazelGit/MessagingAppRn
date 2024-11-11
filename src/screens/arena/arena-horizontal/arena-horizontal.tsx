import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { useLeaderboard } from "../../../hooks/useUsers";
import XPLeaderboard from "../leaderboard/xp-leaderboard";
import { PercentBar } from "../components/arena-item-medium";
import { useChallenges } from "../../../hooks/useChallenges";
import { userUserSubmissions } from "../../../hooks/useSubmissions";
import { DEFAULT_ID } from "../../../constants/utils";
import { SubmissionBackgroundSquare } from "../../../components/audio/submission-background-square";
import { Fonts } from "../../../constants/fonts";

export default function ArenaHorizontalScreen() {
  const orientationGoBack = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  return (
    <ImageBackground
      source={require("../../../../assets/arena-background-1.png")}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require("../../../../assets/arena-background-2.png")}
        style={{ flex: 1 }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
            opacity: 0.3,
          }}
        ></View>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 12,
            }}
          >
            <TouchableOpacity style={{}} onPress={orientationGoBack}>
              <Ionicons name="arrow-back" size={30} color={colors.white} />
            </TouchableOpacity>
            <Image
              source={require("../../../../assets/icon-title.png")}
              style={{ width: 180, height: 30 }}
              contentFit="contain"
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <View style={{ flex: 1.1 }}>
              <ChallengesColumn />
            </View>
            <View style={{ flex: 0.9 }}>
              <UserColumn />
            </View>
            <View style={{ flex: 1.2 }}>
              <LeaderboardColumn />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ImageBackground>
  );
}

const ChallengesColumn = () => {
  const me = useMe();
  const userId = me ? me.id : DEFAULT_ID;
  const submissions = userUserSubmissions(userId);
  const challenges = useChallenges();
  const [selected, setSelected] = useState(null);

  const selectedChallenge = useMemo(() => {
    if (selected) {
      return challenges.find((item) => item.id == selected.challengeId);
    }
    return null;
  }, [selected, challenges]);

  const submissionsList = useMemo(() => {
    let baseList: any[] = [...(submissions || [])];

    // if ((submissions || []).length > 0) {
    //   baseList = [
    //     { ...submissions[0], id: "1" },
    //     { ...submissions[0], id: "2" },
    //     { ...submissions[0], id: "3" },
    //     { ...submissions[0], id: "4" },
    //     { ...submissions[0], id: "5" },
    //   ];
    // }

    if (selected) {
      var selectedIndex = -1;
      console.log("selected", selected.id);
      selectedIndex = baseList.findIndex((item) => item.id == selected.id);

      console.log("selectedIndex", selectedIndex);
      if (selectedIndex > -1) {
        let row = Math.floor(selectedIndex / 3);

        baseList.splice((row + 1) * 3, 0, { id: "view-challenge" });
      }
    }

    return baseList;
  }, [submissions, selected]);

  return (
    <View style={{ marginTop: 10, flex: 1, marginLeft: -6 }}>
      <BoldMonoText
        style={{ fontSize: 18, marginBottom: 8 }}
      >{`MY  ENTRIES`}</BoldMonoText>
      {/* tara here now dropdown  */}
      {submissions.length == 0 && (
        <View style={{ marginTop: 8 }}>
          <BoldMonoText>No submissions.</BoldMonoText>
        </View>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {submissionsList.map((submission) =>
          submission.id == "view-challenge" ? (
            <View
              style={{
                backgroundColor: colors.transparentWhite2,
                borderRadius: 8,
                padding: 12,
                borderColor: "white",
                borderWidth: 1,
                width: 71 * 3 + 16,
                marginBottom: 6,
              }}
              key={submission.id}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <BoldMonoText
                    style={{
                      fontFamily: Fonts.MonoSansBold,
                      marginBottom: 12,
                    }}
                  >
                    {selectedChallenge ? selectedChallenge.title : ""}
                  </BoldMonoText>
                  <BoldMonoText style={{ marginBottom: 4 }}>{`ENTRIES: ${
                    selectedChallenge ? selectedChallenge.memberIds.length : 0
                  }`}</BoldMonoText>
                  <BoldMonoText>{`VOTES: ${
                    selectedChallenge ? selectedChallenge.voteCount : 0
                  }`}</BoldMonoText>
                </View>
                <Image
                  source={{
                    uri: selectedChallenge ? selectedChallenge.coverImage : "",
                  }}
                  style={{ width: 44, height: 44, borderRadius: 6 }}
                />
              </View>
            </View>
          ) : (
            <View key={submission.id}>
              <TouchableOpacity
                onPress={() => {
                  if (selected && selected.id == submission.id) {
                    setSelected(null);
                  } else {
                    setSelected(submission);
                  }
                }}
                style={{
                  marginBottom: 6,
                  width: 71,
                  height: 71,
                  borderRadius: 4,
                  borderColor:
                    selected && selected.id == submission.id
                      ? "white"
                      : colors.blue,
                  borderWidth: 1,
                  overflow: "hidden",
                  marginRight: 6,
                }}
              >
                <SubmissionBackgroundSquare
                  width={70}
                  submission={submission}
                  skipFakeBackground={false}
                />
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </View>
  );
};

const UserColumn = () => {
  const challenges = useChallenges();
  const me = useMe();

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View>
        <View
          style={{
            alignItems: "center",
            marginHorizontal: 8,
          }}
        >
          <ProfileImage size={120} user={me} />

          <BoldMonoText
            style={{
              marginTop: 12,
              fontSize: 30,
            }}
            numLines={1}
            adjustsFontSizeToFit={true}
          >
            {`${me ? me.username : ""}`.toUpperCase()}
          </BoldMonoText>
        </View>

        <View style={{ marginTop: 20, marginHorizontal: 8 }}>
          <PercentBar
            width={"100%"}
            left={true}
            title={"entries"}
            currentCount={me.submissionCount || 0}
            total={(challenges || []).length}
          />
        </View>
        <View style={{ marginTop: 8, marginHorizontal: 8 }}>
          <PercentBar
            width={"100%"}
            left={true}
            title={"wins"}
            currentCount={me.winCount || 0}
            total={me.submissionCount || 0}
          />
        </View>
      </View>
    </View>
  );
};

const LeaderboardColumn = () => {
  const [selection, setSelection] = useState<
    "leaderboard" | "battle" | "arcade"
  >("leaderboard");

  const unsortedLeaders = useLeaderboard();

  const leaders = useMemo(() => {
    return (unsortedLeaders || []).filter(
      (item) => item.points && item.points > 0
    );
  }, [unsortedLeaders]);

  return (
    <View style={{ flex: 1, marginRight: -14 }}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setSelection("leaderboard")}
          style={{
            backgroundColor:
              selection == "leaderboard" ? colors.purple : colors.transparent,
            borderColor: selection == "leaderboard" ? colors.purple : "white",
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 14,
            borderRadius: 12,
            marginRight: 8,
          }}
        >
          <BoldMonoText
            style={{
              color: "white",
              fontSize: 12,
            }}
          >
            LEADERBOARD
          </BoldMonoText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelection("battle")}
          style={{
            backgroundColor:
              selection == "battle" ? colors.purple : colors.transparent,
            borderColor: selection == "battle" ? colors.purple : "white",
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 14,
            borderRadius: 12,
            marginRight: 8,
          }}
        >
          <BoldMonoText
            style={{
              color: "white",
              fontSize: 12,
            }}
          >
            BATTLE
          </BoldMonoText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelection("arcade")}
          style={{
            backgroundColor:
              selection == "arcade" ? colors.purple : colors.transparent,
            borderColor: selection == "arcade" ? colors.purple : "white",
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 14,
            borderRadius: 12,
            marginRight: 8,
          }}
        >
          <BoldMonoText
            style={{
              color: "white",
              fontSize: 12,
            }}
          >
            ARCADE
          </BoldMonoText>
        </TouchableOpacity>
      </View>
      {selection == "leaderboard" ? (
        <View style={{ flex: 1, paddingHorizontal: 14 }}>
          <XPLeaderboard skipHeader={true} />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldMonoText style={{ marginTop: 15 }}>{`coming soon`}</BoldMonoText>
        </View>
      )}
    </View>
  );
};
