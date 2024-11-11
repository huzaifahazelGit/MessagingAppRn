import { collection, getFirestore, orderBy, where } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CollaborateButton from "../../../components/buttons/collaborate-button";
import FollowButton from "../../../components/buttons/follow-button";
import { Paginator } from "../../../components/lists/paginator";
import ProfileImage from "../../../components/images/profile-image";
import {
  BodyText,
  BoldMonoText,
  BoldText,
  Headline,
} from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useLeaderboard, useXPLeader } from "../../../hooks/useUsers";

export default function PointsLeaderboard() {
  const insets = useSafeAreaInsets();
  const [feedItems, setFeedItems] = useState([]);
  const [needsReload, setNeedsReload] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const unsortedLeaders = useLeaderboard();

  const leaders = useMemo(() => {
    return (unsortedLeaders || []).filter(
      (item) => item.points && item.points > 0
    );
  }, [unsortedLeaders]);

  const mainLeader = leaders && leaders.length > 0 ? leaders[0] : null;

  return (
    <View style={{ flex: 1 }}>
      {mainLeader && mainLeader.points > 0 ? (
        <Paginator
          baseCollection={collection(getFirestore(), "users")}
          queryOptions={[where("points", ">", 0)]}
          orderByOption={orderBy("points", "desc")}
          needsReload={needsReload}
          setNeedsReload={setNeedsReload}
          setResults={setFeedItems}
          results={feedItems}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          itemsPerPage={10}
          listEmptyText={""}
          header={
            mainLeader ? (
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
                  {`${mainLeader.points} vote${
                    mainLeader.points == 1 ? "" : "s"
                  }`}
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
          renderListItem={function (
            item: any,
            visible: boolean,
            index: number
          ) {
            return <LeaderboardRow user={item} index={index} />;
          }}
          trackVisible={false}
          setLastFetch={setLastFetch}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 60,
            }}
          >
            <View>
              <BoldMonoText>COMING SOON</BoldMonoText>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const LeaderboardRow = ({ user, index }) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 8,
        borderRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 12,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BoldText style={{ marginRight: 20 }}>{`${index + 1}`}</BoldText>
          <ProfileImage size={48} user={user} />
          <View
            style={{
              marginLeft: 12,
              maxWidth: SCREEN_WIDTH - 220,
            }}
          >
            <BoldMonoText style={{ fontSize: 19 }}>
              {user.username}
            </BoldMonoText>

            {user.location && <BodyText>{user.location}</BodyText>}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BoldText style={{ color: colors.white }}>
            {`${user.points} vote${user.points == 1 ? "" : "s"}`}
          </BoldText>
        </View>
      </View>
    </View>
  );
};
