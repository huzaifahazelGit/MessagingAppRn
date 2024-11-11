import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import NavBar from "../../../components/navbar";
import { colors } from "../../../constants/colors";
import { Paginator } from "../../../components/lists/paginator";
import { FollowItem } from "./follow-item";
import { useProfileColors } from "../../../hooks/useProfileColors";
import { Activity } from "../../../models/activity";
import { User } from "../../../models/user";

export default function FollowingList({
  userId,
  user,
  following,
  setFollowing,
}: {
  userId: string;
  user: User;
  following: Activity[];
  setFollowing: any;
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
        queryOptions={[where("fromUserId", "==", userId)]}
        orderByOption={orderBy("createdate", "desc")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setFollowing}
        results={following}
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
      />
    </View>
  );
}
