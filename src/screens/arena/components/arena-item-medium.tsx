import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import moment from "moment";
import React, { useMemo } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import {
  ArenaHeadlineText,
  BodyText,
  BoldMonoText,
  BoldText,
} from "../../../components/text";
import {
  DEFAULT_ID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";
import { Challenge } from "../../../models/challenge";
import { Fonts } from "../../../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserForId } from "../../../hooks/useUsers";
import ProfileImage from "../../../components/images/profile-image";
import AvatarList from "../../../components/lists/avatar-list";

export function ArenaItemMedium({
  challenge,
  visible,
}: {
  challenge: Challenge;
  visible: boolean;
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const ITEM_HEIGHT = SCREEN_HEIGHT - insets.bottom - 35;

  const userId = useMemo(() => {
    if (challenge && challenge.ownerId) {
      return challenge.ownerId;
    }
    return DEFAULT_ID;
  }, [challenge]);

  const owner = useUserForId(userId);

  const challengeIsStarted = useMemo(() => {
    if (challenge && challenge.startDate) {
      return moment().isAfter(
        moment(new Date(challenge.startDate.seconds * 1000))
      );
    }
    return false;
  }, [challenge]);

  const challengeIsFinished = useMemo(() => {
    if (challenge && challenge.endDate) {
      return moment().isAfter(
        moment(new Date(challenge.endDate.seconds * 1000))
      );
    }
    return false;
  }, [challenge]);

  const userAvatars = useMemo(() => {
    if (challenge) {
      let items = challenge.submissionUserImages || [];
      return items.slice(0, 8);
    }
    return [];
  }, [challenge]);

  if (!challenge) {
    return <View></View>;
  }

  let imageWidth = SCREEN_WIDTH - 90;
  let imageHeight = 320;
  return (
    <View
      style={{
        width: SCREEN_WIDTH - 70,
        marginHorizontal: 10,
        opacity: visible ? 1 : 0.4,
      }}
    >
      <View
        style={{
          marginLeft: 10,
          marginTop: 20,
          marginBottom: 10,
          marginHorizontal: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {challenge.ownerId ? (
            <ProfileImage user={{ ...owner, id: userId } as any} size={30} />
          ) : (
            <View>
              <ImageBackground
                source={require("../../../../assets/rai.png")}
                style={{
                  width: 30,
                  height: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/icon-white.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </ImageBackground>
            </View>
          )}

          {challenge.ownerId ? (
            <View style={{ marginLeft: 12 }}>
              <BodyText style={{}}>{owner ? owner.username : ""}</BodyText>
            </View>
          ) : (
            <View style={{ marginLeft: 12 }}>
              {/* <BodyText style={{}}>{"RAI"}</BodyText> */}
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {(challengeIsStarted && !challengeIsFinished) || challenge.daily ? (
            <View
              style={{
                borderWidth: 1.5,
                borderColor: "red",
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderRadius: 15,
              }}
            >
              <BoldMonoText style={{ color: "red", fontSize: 15 }}>
                {challenge.daily ? "DAILY" : "LIVE"}
              </BoldMonoText>
            </View>
          ) : (
            <View style={{}}></View>
          )}
        </View>
      </View>
      <ImageBackground
        source={{ uri: challenge.coverImage }}
        style={{
          width: imageWidth,
          height: imageHeight,
          borderRadius: 20,
          overflow: "hidden",
          marginLeft: 10,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            (navigation as any).navigate("ArenaDetails", {
              screen: "ArenaDetailScreen",
              params: {
                challengeId: challenge.id,
              },
            })
          }
          style={{
            justifyContent: "flex-end",
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          {!challengeIsFinished && (
            <View style={{ alignItems: "flex-end" }}>
              <View
                style={{
                  backgroundColor: colors.purple,
                  paddingVertical: 8,
                  paddingHorizontal: 30,
                  borderRadius: 20,
                }}
              >
                <BoldMonoText style={{ color: "black" }}>SUBMIT</BoldMonoText>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </ImageBackground>
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <ArenaHeadlineText
          style={{ marginLeft: 0, width: imageWidth, fontSize: 30 }}
        >
          {`${challenge.title}`.toUpperCase()}
        </ArenaHeadlineText>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <BodyText
            numLines={5}
            style={{ fontFamily: Fonts.MonoSans, marginRight: 10 }}
          >
            {challenge.description}
          </BodyText>
          {(challenge.tags || []).length > 0 ? (
            <View
              style={{
                marginTop: 10,
              }}
            >
              <BodyText
                style={{
                  fontFamily: Fonts.MonoSans,
                  marginRight: 10,
                  color: colors.purple,
                }}
              >
                {`#${challenge.tags.join(" #")}`}
              </BodyText>
            </View>
          ) : (
            <View />
          )}
          {userAvatars.length > 0 ? (
            <View
              style={{
                marginTop: 30,
              }}
            >
              <AvatarList
                avatars={userAvatars.slice(0, 5)}
                totalCount={(challenge.memberIds || []).length}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
        <ChallengeStats challenge={challenge} />
      </View>
    </View>
  );
}

export const ChallengeStats = ({ challenge }: { challenge: Challenge }) => {
  const challengeIsFinished = useMemo(() => {
    if (challenge && challenge.endDate) {
      return moment().isAfter(
        moment(new Date(challenge.endDate.seconds * 1000))
      );
    }
    return false;
  }, [challenge]);

  const totalDays = useMemo(() => {
    if (challenge && challenge.startDate && challenge.endDate) {
      let diff = moment(new Date(challenge.endDate.seconds * 1000)).diff(
        moment(new Date(challenge.startDate.seconds * 1000)),
        "days"
      );
      if (diff < 1) {
        return 1;
      } else {
        return diff;
      }
    }
  }, [challenge]);

  const daysRemaining = useMemo(() => {
    if (challenge && challenge.startDate && challenge.endDate) {
      let days = moment(new Date(challenge.endDate.seconds * 1000)).diff(
        moment(),
        "days"
      );
      let hours = moment(new Date(challenge.endDate.seconds * 1000)).diff(
        moment(),
        "hours"
      );
      if (days == 0 && hours > 0) {
        days = 1;
      }
      if (days < 0) {
        days = 0;
      }

      return days;
    }
    return 0;
  }, [challenge]);

  return (
    <View style={{ width: 120 }}>
      <PercentBar
        title={"entries"}
        currentCount={challenge.memberIds.length}
        total={
          challengeIsFinished
            ? challenge.memberIds.length
            : Math.max(20, Math.round(challenge.memberIds.length * 1.4))
        }
      />
      {challenge.allowsVoting && (
        <PercentBar
          title={"votes"}
          currentCount={challenge.voteCount}
          total={
            challengeIsFinished
              ? challenge.voteCount
              : Math.max(20, Math.round(challenge.voteCount * 1.4))
          }
        />
      )}
      <PercentBar
        title={"days left"}
        currentCount={totalDays - daysRemaining}
        total={totalDays}
        countOverride={`${daysRemaining}`}
      />
    </View>
  );
};

export const PercentBar = ({
  title,
  total,
  currentCount,
  countOverride,
  left,
  width,
}: {
  title: string;
  total: number;
  currentCount: number;
  countOverride?: any;
  left?: boolean;
  width?: any;
}) => {
  const percentFilled = useMemo(() => {
    if (total < 1) {
      return 0;
    }
    let currentPerc = currentCount / total;

    if (isNaN(currentPerc)) {
      return 0;
    }
    if (currentPerc < 0.1) {
      return 0.1;
    }
    if (currentPerc < 0.7) {
      return currentPerc + 0.1;
    }
    return currentPerc;
  }, [currentCount, total]);

  return (
    <View
      style={{ alignItems: left ? "flex-start" : "flex-end", marginBottom: 14 }}
    >
      <View
        style={{
          width: width ? width : 105,
          height: 8,
          borderRadius: 8,
          borderColor: colors.blue,
          borderWidth: 1,
        }}
      >
        <LinearGradient
          style={{
            width: 105 * percentFilled,
            height: 8,

            borderRadius: 8,
          }}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.7, y: 1.0 }}
          colors={[colors.purple, colors.blue]}
        ></LinearGradient>
      </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <BoldMonoText style={{ fontSize: 20, marginRight: 4 }}>{`${
          countOverride ? countOverride : currentCount
        }`}</BoldMonoText>
        <BoldText style={{ fontSize: 12, paddingBottom: 1 }}>
          {`${title}`.toUpperCase()}
        </BoldText>
      </View>
    </View>
  );
};
