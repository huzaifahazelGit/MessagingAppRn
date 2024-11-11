import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CollaborateButton from "../../../components/buttons/collaborate-button";
import FollowButton from "../../../components/buttons/follow-button";
import NavBar from "../../../components/navbar";
import ProfileImage from "../../../components/images/profile-image";
import { BoldMonoText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { useUserForId } from "../../../hooks/useUsers";
import {
  useChallenges,
  useWinnerChallenges,
} from "../../../hooks/useChallenges";
import { ArenaItemSmall } from "../components/arena-item-small";

export default function LeaderboardDetailScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const route = useRoute();
  const userId = (route.params as any).userId;
  const user = useUserForId(userId);
  const challenges = useWinnerChallenges(userId);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT,
        }}
        source={require("../../../../assets/leader-back.png")}
      ></Image>
      <NavBar title={""} includeBack={true} />
      <FlatList
        showsVerticalScrollIndicator={false}
        decelerationRate={"fast"}
        snapToInterval={200}
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        ListHeaderComponent={
          user ? (
            <View>
              <View
                style={{
                  marginVertical: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <ProfileImage size={75} user={user} />
                  <View
                    style={{
                      backgroundColor: "#D886FF",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 32 / 2,
                      marginTop: -24,
                      marginLeft: 50,
                    }}
                  >
                    <BoldMonoText style={{ fontSize: 19 }}>1</BoldMonoText>
                  </View>
                </View>
                <BoldMonoText style={{ fontSize: 19 }}>
                  {user.username}
                </BoldMonoText>
                <BoldText style={{ color: colors.white }}>
                  {`${user.points} vote${user.points == 1 ? "" : "s"}`}
                </BoldText>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 12,
                    marginBottom: 8,
                    width: SCREEN_WIDTH * 0.6,
                    height: 34,
                  }}
                >
                  <FollowButton
                    user={user}
                    color={"white"}
                    userId={user.id}
                    wide={true}
                    hideIfFollowing={false}
                    buttonStyle={{ backgroundColor: colors.purple }}
                  />
                  <View style={{ width: 8 }} />
                  <CollaborateButton
                    wide={true}
                    userId={user.id}
                    color={"white"}
                    marketplaceItem={null}
                  />
                </View>
              </View>
              <View style={{ paddingHorizontal: 12, paddingBottom: 4 }}>
                <BoldMonoText style={{ color: colors.black }}>{`${
                  user.winCount
                } win${user.winCount == 1 ? "" : "s"}`}</BoldMonoText>
              </View>
            </View>
          ) : (
            <View />
          )
        }
        data={challenges || []}
        ListEmptyComponent={
          <View>
            <BoldMonoText
              style={{ textAlign: "center", marginTop: 20, color: "black" }}
            >
              {`No wins.`.toUpperCase()}
            </BoldMonoText>
          </View>
        }
        numColumns={2}
        renderItem={({ item }) => <ArenaItemSmall challenge={item} />}
      />
    </SafeAreaView>
  );
}
