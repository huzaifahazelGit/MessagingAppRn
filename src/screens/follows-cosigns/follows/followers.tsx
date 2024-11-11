import { useRoute } from "@react-navigation/native";
import { collection, getFirestore, orderBy, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Paginator } from "../../../components/lists/paginator";
import NavBar from "../../../components/navbar";
import { useProfileColors } from "../../../hooks/useProfileColors";
import { FollowItem } from "./follow-item";
import { Activity } from "../../../models/activity";
import { User } from "../../../models/user";

export default function FollowersList({
  userId,
  user,
  followers,
  setFollowers,
}: {
  userId: string;
  user: User;
  followers: Activity[];
  setFollowers: any;
}) {
  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <Paginator
        baseCollection={collection(getFirestore(), "follows")}
        queryOptions={[where("toUserId", "==", userId)]}
        orderByOption={orderBy("createdate", "desc")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setFollowers}
        results={followers}
        itemsPerPage={12}
        listEmptyText={"No followers."}
        renderListItem={function (item: any, visible: boolean) {
          return (
            <FollowItem
              follow={item}
              showRecipient={false}
              profileColors={profileColors}
            />
          );
        }}
        trackVisible={false}
        setLastFetch={() => {}}
      />
    </View>
  );
}
