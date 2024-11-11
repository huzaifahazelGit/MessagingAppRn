import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useMemo } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import AvatarList from "../../../components/lists/avatar-list";
import ProfileImage from "../../../components/images/profile-image";
import {
  ArenaHeadlineText,
  BodyText,
  BoldMonoText,
} from "../../../components/text";
import {
  DEFAULT_ID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";

export const ArenaItemLarge = ({ featuredItem }) => {
  const insets = useSafeAreaInsets();
  const ITEM_HEIGHT = SCREEN_HEIGHT - insets.bottom - 35;
  const navigation = useNavigation();

  const userId = useMemo(() => {
    if (featuredItem && featuredItem.ownerId) {
      return featuredItem.ownerId;
    }
    return DEFAULT_ID;
  }, [featuredItem]);

  const owner = useUserForId(userId);

  const challengeIsStarted = useMemo(() => {
    if (featuredItem && featuredItem.startDate) {
      return moment().isAfter(
        moment(new Date(featuredItem.startDate.seconds * 1000))
      );
    }
    return false;
  }, [featuredItem]);

  const formattedStartDate = useMemo(() => {
    if (featuredItem && featuredItem.startDate) {
      return moment(new Date(featuredItem.startDate.seconds * 1000)).format(
        "MMM Do, YYYY"
      );
    }
    return "";
  }, [featuredItem]);

  const userAvatars = useMemo(() => {
    if (featuredItem) {
      let items = featuredItem.submissionUserImages || [];
      return items.slice(0, 8);
    }
    return [];
  }, [featuredItem]);

  if (!featuredItem) {
    return <View></View>;
  }

  return (
    <ImageBackground
      source={{ uri: featuredItem.coverImage }}
      style={{
        width: SCREEN_WIDTH,
        height: ITEM_HEIGHT,
      }}
    >
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.9)",
          "rgba(0, 0, 0, 0.8)",
          "rgba(0, 0, 0, 0.6)",
          "rgba(0, 0, 0, 0.4)",
          "transparent",
          "rgba(0, 0, 0, 0.4)",
        ]}
        style={{
          width: SCREEN_WIDTH,
          height: ITEM_HEIGHT,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            (navigation as any).navigate("ArenaDetails", {
              screen: "ArenaDetailScreen",
              params: {
                challengeId: featuredItem.id,
              },
            })
          }
          style={{ justifyContent: "space-between", flex: 1 }}
        >
          <View>
            <View
              style={{
                marginTop: 100,
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flex: 1,
                }}
              >
                <ProfileImage
                  user={{ ...owner, id: userId } as any}
                  size={40}
                />
                <View style={{ marginLeft: 12 }}>
                  <BodyText style={{}}>{owner ? owner.username : ""}</BodyText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={() => (navigation as any).navigate("ArenaDetails")}
                >
                  <BoldMonoText>VIEW ALL</BoldMonoText>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: 1,
                }}
              >
                {challengeIsStarted ? (
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
                      LIVE
                    </BoldMonoText>
                  </View>
                ) : (
                  <View style={{}}></View>
                )}
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <ArenaHeadlineText style={{ marginLeft: 0 }}>
                {`${featuredItem.title}`.toUpperCase()}
              </ArenaHeadlineText>
            </View>
            {/* <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <BoldMonoText>TIME REMAINING:</BoldMonoText>
                <ChallengeCountdown challenge={featuredItem} />
              </View> */}
          </View>

          <View>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 10,
              }}
            >
              <BodyText style={{ marginLeft: 0 }}>
                {formattedStartDate}
              </BodyText>
            </View>

            {/* <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: userAvatars.length == 0 ? 14 : 0,
                }}
              >
                <View>
                  <BoldMonoText style={{ fontSize: 26 }}>
                    {featuredItem.title}
                  </BoldMonoText>
                </View>
       
              </View> */}

            {userAvatars.length > 0 ? (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 30,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <AvatarList
                  avatars={userAvatars}
                  totalCount={(featuredItem.memberIds || []).length}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};
