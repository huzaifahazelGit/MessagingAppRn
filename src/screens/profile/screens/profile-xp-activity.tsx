import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../../components/buttons/buttons";
import ProfileImage from "../../../components/images/profile-image";
import RAIButton from "../../../components/rai/rai-button";
import {
  BoldMonoText,
  ExtraBoldMonoText,
  SimpleMonoText,
} from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { useUserForId } from "../../../hooks/useUsers";
import { User } from "../../../models/user";
import { MISSIONS, XPKind } from "../../../models/xp";
import { GeneralDataStore } from "../../../store/general-data-store";
import XPView, { XPBar } from "../components/xp-view";
import { ProfileMenu } from "../profile-menu";

export function MyProfileXPActivityScreen() {
  const me = useMe();

  return <ProfileXPView user={me} isMe={true} />;
}

export default function ProfileXPActivityScreen() {
  const route = useRoute();
  const params = route.params as any;
  const userId = params.userId;
  const user = useUserForId(userId);

  return <ProfileXPView user={user} isMe={false} />;
}

function ProfileXPView({ user, isMe }: { user: User; isMe: Boolean }) {
  const insets = useSafeAreaInsets();
  const me = useMe();
  const backgroundColor = colors.darkblack;

  const textColor = colors.white;

  const buttonColor = colors.blue;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <ProfileXPHeader user={user} />

          <View style={{ paddingHorizontal: 10 }}>
            {MISSIONS.map((item) => {
              return (
                <MissionsActivityRow
                  key={item.id}
                  mission={item as any}
                  textColor={textColor}
                  user={user}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {!isMe && (
        <View style={{ position: "absolute", top: insets.top, left: 20 }}>
          <BackButton buttonColor={buttonColor} />
        </View>
      )}

      <View style={{ position: "absolute", right: 0, bottom: 0 }}>
        <RAIButton stack="dashboard" />
      </View>

      {isMe ? (
        <View
          style={{
            position: "absolute",
            top: insets.top,
            right: 0,
          }}>
          <ProfileMenu />
        </View>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}

function ProfileXPHeader({ user }: { user: User }) {
  const navigation = useNavigation();
  const textColor = colors.white;
  const me = useMe();
  return (
    <View style={{ paddingBottom: 30 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",

          paddingTop: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: user.id },
            });
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}>
          <ProfileImage user={user} size={120} />
          <BoldMonoText
            style={{
              textDecorationColor: colors.white,
              textDecorationLine: "underline",
            }}>
            VIEW PROFILE
          </BoldMonoText>
        </TouchableOpacity>

        <ExtraBoldMonoText
          style={{
            fontSize: 22,
            marginTop: 12,
            color: textColor,
          }}>
          {user ? user.username : ""}
        </ExtraBoldMonoText>
        <XPView large={true} user={user} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 4,
          }}>
          <TouchableOpacity
            onPress={() => {
              (navigation as any).navigate("LeaderboardScreen");
            }}>
            <BoldMonoText style={{ color: textColor }}>
              {`RANK `}
              <BoldMonoText
                style={{
                  color: colors.blue,
                  fontSize: 24,
                }}>{`#${user.rank}`}</BoldMonoText>
            </BoldMonoText>
          </TouchableOpacity>
          <BoldMonoText style={{ fontSize: 24, color: colors.blue }}>
            {`${user.xp}`}{" "}
            <BoldMonoText style={{ color: textColor, fontSize: 14 }}>
              {`XP `}
            </BoldMonoText>
          </BoldMonoText>
        </View>
      </View>
      <View style={{ paddingHorizontal: 0, marginTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-evenly",
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.transparentWhite1,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 4,
              borderRadius: 12,
              paddingVertical: 8,
            }}
            onPress={() => {
              (navigation as any).navigate("Inbox");
            }}>
            <BoldMonoText
              style={{ color: textColor, fontSize: 14, paddingVertical: 16 }}>
              {`MESSAGES`}
            </BoldMonoText>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.transparentWhite1,

              marginHorizontal: 4,
              borderRadius: 12,
            }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",

                paddingVertical: 8,
              }}
              onPress={() => {
                (navigation as any).navigate("Arena");
              }}>
              <BoldMonoText
                style={{ color: textColor, fontSize: 14, paddingVertical: 16 }}>
                {`Notification`}
              </BoldMonoText>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-evenly",
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.transparentWhite1,
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 4,
              borderRadius: 12,
              paddingVertical: 8,
            }}
            onPress={() => {
              (navigation as any).navigate("EditProfileScreen");
            }}>
            <BoldMonoText
              style={{ color: textColor, fontSize: 14, paddingVertical: 16 }}>
              {`EDIT PROFILE`}
            </BoldMonoText>
          </TouchableOpacity>
         
          
        </View>
      </View>
    </View>
  );
}

const MissionsActivityRow = ({
  mission,
  textColor,
  user,
}: {
  mission: {
    id: string;
    title: string;
    points: number;
    kind: XPKind;
  };
  textColor: string;
  user: User;
}) => {
  const xpMax = GeneralDataStore.useState((s) => s.xpMax);
  const inviteMax = GeneralDataStore.useState((s) => s.inviteMax);
  const postMax = GeneralDataStore.useState((s) => s.postMax);
  const submissionMax = GeneralDataStore.useState((s) => s.submissionMax);
  const winMax = GeneralDataStore.useState((s) => s.winMax);
  const followMax = 200;

  const missionSubText = useMemo(() => {
    if (!user) {
      return false;
    }
    switch (mission.kind) {
      case XPKind.completeProfileShort:
        return (user as any).didFinishProfileLong
          ? "90%"
          : (user as any).didFinishProfileShort
          ? "70%"
          : "10%";

      case XPKind.addDayToPostStreak:
        return `${user.postCount} POSTS`;

      case XPKind.submitChallenge:
        return `${user.submissionCount}`;

      case XPKind.winChallenge:
        return `${user.winCount}`;

      case XPKind.receive25Follows:
        return `${user.followerCount}`;

      case XPKind.inviteUser:
        return `${user.inviteCount ? user.inviteCount : 0}`;
    }
  }, [user, mission]);

  const missionPercentFilled = useMemo(() => {
    if (!user) {
      return 0;
    }
    switch (mission.kind) {
      case XPKind.completeProfileShort:
        return (user as any).didFinishProfileLong
          ? 0.9
          : (user as any).didFinishProfileShort
          ? 0.7
          : 0.1;

      case XPKind.addDayToPostStreak:
        if (user.postCount == 0) {
          return 0;
        }
        let content = user.postCount / postMax;
        if (content < 0.1) {
          return 0.1;
        } else {
          return content;
        }

      case XPKind.submitChallenge:
        if (user.submissionCount == 0) {
          return 0;
        }
        let submissions = user.submissionCount / submissionMax;
        if (submissions < 0.1) {
          return 0.1;
        } else {
          return submissions;
        }

      case XPKind.winChallenge:
        if (user.winCount == 0) {
          return 0;
        }
        let wins = user.winCount / winMax;
        if (wins < 0.1) {
          return 0.1;
        } else {
          return wins;
        }

      case XPKind.receive25Follows:
        if (user.followerCount == 0) {
          return 0;
        }
        let followers = user.followerCount / followMax;
        if (followers < 0.1) {
          return 0.1;
        } else {
          return followers;
        }

      case XPKind.inviteUser:
        if (!user.inviteCount) {
          return 0;
        }
        if (user.inviteCount == 0) {
          return 0;
        }
        let invites = user.inviteCount / inviteMax;
        if (invites < 0.1) {
          return 0.1;
        } else {
          return invites;
        }
    }
    return 0;
  }, [user, mission]);

  return (
    <View
      style={{
        paddingVertical: 12,
      }}>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <SimpleMonoText
          style={{
            color: colors.white,
            fontSize: 18,
          }}>
          {`${mission.title}`.toUpperCase()}
        </SimpleMonoText>
        <SimpleMonoText
          style={{
            fontSize: 18,
            marginLeft: 6,
            color: colors.purple,
          }}>
          {missionSubText}
        </SimpleMonoText>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <XPBar
          borderColor={colors.white}
          borderWidth={1}
          height={27}
          width={SCREEN_WIDTH * 0.67}
          percentFilled={missionPercentFilled}
          longerColorOne={true}
          customColors={[colors.blue, colors.white]}
        />
        <BoldMonoText style={{ color: colors.purple }}>
          {`+ ${mission.points} XP`}
        </BoldMonoText>
      </View>
    </View>
  );
};

