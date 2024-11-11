import React, { useMemo } from "react";
import { FlatList, View } from "react-native";
import { BoldMonoText } from "../../../components/text";
import { useMe } from "../../../hooks/useMe";
import { useProfileColors } from "../../../hooks/useProfileColors";
import { Follow } from "../../../models/follow";
import { User } from "../../../models/user";
import { SocialStore } from "../../../store/follows-collabs-store";
import { FollowItem } from "./follow-item";

export default function MutualsList({
  userId,
  user,
  followers,
  following,
}: {
  userId: string;
  user: User;
  followers: Follow[];
  following: Follow[];
}) {
  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const me = useMe();

  const mutualFollows = SocialStore.useState((s) => s.mutualFollows);
  const myFollows = SocialStore.useState((s) => s.follows);

  const userMutuals = useMemo(() => {
    if (Object.keys(mutualFollows).includes(user.id)) {
      return mutualFollows[user.id];
    }
    return [];
  }, [mutualFollows]);

  const mutualsFromUserFollowers = useMemo(() => {
    let myFollowIds = myFollows
      .map((item) => item.toUserId)
      .filter((userId) => userId != me.id);

    let items = [];
    followers.forEach((follow) => {
      let userDoesFollowMe = follow.toUserId == me.id;
      let weBothFollowThisUser = myFollowIds.includes(follow.fromUserId);

      if (weBothFollowThisUser || userDoesFollowMe) {
        items.push(follow);
      }
    });

    return items;
  }, [followers, myFollows]);

  const mutualsFromUserFollowing = useMemo(() => {
    let myFollowIds = myFollows
      .map((item) => item.toUserId)
      .filter((userId) => userId != me.id);

    let items = [];
    following.forEach((follow) => {
      let userDoesFollowMe = follow.toUserId == me.id;
      let weBothFollowThisUser = myFollowIds.includes(follow.toUserId);

      if (weBothFollowThisUser || userDoesFollowMe) {
        items.push(follow);
      }
    });

    return items;
  }, [following, myFollows]);

  const processedMutuals = useMemo(() => {
    let userIds = userMutuals.map((item) =>
      item.toUserId != userId ? item.toUserId : item.fromUserId
    );
    let cleanedMutuals = [
      ...mutualsFromUserFollowers,
      ...mutualsFromUserFollowers,
    ].filter((item) => {
      let relevantUserId =
        item.toUserId != userId ? item.toUserId : item.fromUserId;
      if (userIds.includes(relevantUserId)) {
        return false;
      }
      return true;
    });

    return [...userMutuals, ...cleanedMutuals];
  }, [userMutuals, mutualsFromUserFollowing, mutualsFromUserFollowers]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <FlatList
        nestedScrollEnabled={true}
        data={processedMutuals}
        contentContainerStyle={{
          paddingBottom: 60,
          paddingHorizontal: 20,
        }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 14,
              opacity: 0.8,
              marginTop: 20,
            }}
          >
            <BoldMonoText style={{ color: textColor ? textColor : "white" }}>
              {"No results."}
            </BoldMonoText>
          </View>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FollowItem
            follow={item}
            showRecipient={item.toUserId != userId}
            profileColors={profileColors}
          />
        )}
      />
      {/* <Paginator
        baseCollection={collection(getFirestore(), "follows")}
        queryOptions={[where("fromUserId", "==", userId)]}
        orderByOption={orderBy("timeCreated", "desc")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setMutuals}
        results={mutuals}
        itemsPerPage={12}
        listEmptyText={"No results."}
        renderListItem={function (item: any, visible: boolean) {
          return (
            <FollowItem
              follow={item}
              showRecipient={true}
              profileColors={profileColors}
            />
          );
        }}
        trackVisible={false}
        setLastFetch={() => {}}
      /> */}
    </View>
  );
}
