import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CollaborateButton from "../../../components/buttons/collaborate-button";
import FollowButton from "../../../components/buttons/follow-button";
import NavBar from "../../../components/navbar";
import ProfileImage from "../../../components/images/profile-image";
import {
  BodyText,
  BoldMonoText,
  BoldText,
  Headline,
} from "../../../components/text";
import { colors } from "../../../constants/colors";
import {
  IS_ANDROID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";

import { Paginator } from "../../../components/lists/paginator";
import { collection, getFirestore, orderBy } from "firebase/firestore";
import { useXPLeader } from "../../../hooks/useUsers";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function XPLeaderboard({
  skipHeader,
}: {
  skipHeader?: boolean;
}) {
  const [feedItems, setFeedItems] = useState([]);
  const [needsReload, setNeedsReload] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  const unsortedLeaders = useXPLeader();
  const insets = useSafeAreaInsets();

  const leaders = useMemo(() => {
    return (unsortedLeaders || []).filter((item) => item.xp && item.xp > 0);
  }, [unsortedLeaders]);

  const mainLeader = leaders && leaders.length > 0 ? leaders[0] : null;

  return (
    <View style={{ flex: 1 }}>
      <Paginator
        baseCollection={collection(getFirestore(), "users")}
        queryOptions={[]}
        orderByOption={orderBy("xp", "desc")}
        needsReload={needsReload}
        setNeedsReload={setNeedsReload}
        setResults={setFeedItems}
        results={feedItems}
        contentContainerStyle={
          skipHeader ? { paddingTop: 20 } : { paddingHorizontal: 20 }
        }
        itemsPerPage={10}
        listEmptyText={""}
        header={
          mainLeader && !skipHeader ? (
            <View
              style={{
                marginVertical: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ProfileImage size={75} user={mainLeader} />
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
                {mainLeader.username}
              </BoldMonoText>
              <BoldText style={{ color: colors.white }}>
                {`${mainLeader.xp} XP`}
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
                  user={mainLeader}
                  color={"white"}
                  userId={mainLeader.id}
                  wide={true}
                  hideIfFollowing={false}
                  buttonStyle={{ backgroundColor: colors.purple }}
                />
                <View style={{ width: 8 }} />
                <CollaborateButton
                  wide={true}
                  userId={mainLeader.id}
                  color={"white"}
                  marketplaceItem={null}
                />
              </View>
            </View>
          ) : (
            <View />
          )
        }
        renderListItem={function (item: any, visible: boolean, index: number) {
          return (
            <XPLeaderboardRow user={item} index={index} minimal={skipHeader} />
          );
        }}
        trackVisible={false}
        setLastFetch={setLastFetch}
      />
    </View>
  );
}

const XPLeaderboardRow = ({ user, index, minimal }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 8,
        borderRadius: 30,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 12,
          paddingHorizontal: 20,
        }}
        onPress={() => {
          (navigation as any).navigate("ProfileStack", {
            screen: "ProfileScreen",
            params: { userId: user.id },
          });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BoldText style={{ marginRight: 20 }}>{`${index + 1}`}</BoldText>
          <ProfileImage size={minimal ? 30 : 48} user={user} />
          <View style={{ marginLeft: 12, maxWidth: 180 }}>
            <BoldMonoText style={{ fontSize: 19 }}>
              {user.username}
            </BoldMonoText>
            <BodyText>{user.location}</BodyText>
          </View>
        </View>
        {!minimal && (
          <View>
            <BoldText
              style={{ color: colors.white }}
            >{`${user.xp} XP`}</BoldText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
