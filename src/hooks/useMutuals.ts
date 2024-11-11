import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { useMe } from "./useMe";
import { SocialStore, addMutualsToStore } from "../store/follows-collabs-store";
import { fetchTypesenseFollows } from "../services/typesense-service";
import { Follow } from "../models/follow";

export const useMutuals = (
  userId: string
): { totalMutuals: number; mutualAvatars: string[] } => {
  const me = useMe();
  const mutualFollows = SocialStore.useState((s) => s.mutualFollows);
  const follows = SocialStore.useState((s) => s.follows);
  const [totalMutuals, setTotalMutuals] = useState(0);
  const [mutualAvatars, setMutualAvatars] = useState([]);
  const [mutualNames, setMutualNames] = useState([]);

  useEffect(() => {
    fetchMutualFollows();
  }, []);

  const fetchMutualFollows = async () => {
    let myFollowIds = follows
      .map((item) => item.toUserId)
      .filter((userId) => userId != me.id);
    if (me && me.id) {
      if (Object.keys(mutualFollows).includes(userId)) {
        let mfollows = mutualFollows[userId];
        setTotalMutuals(mfollows.length);
        setMutualAvatars(
          mfollows
            .map((item) => item.fromUserImage)
            .filter((item) => item != null)
            .slice(0, 5)
        );
        let slicedMutuals = mfollows.slice(0, 3);
        setMutualNames(slicedMutuals.map((item) => item.fromUserName));
      } else {
        fetchTypesenseFollows(myFollowIds, userId).then((res) => {
          let mfollows = [];
          let results = (res as any).mutuals as Follow[];
          results = results.filter((item) =>
            myFollowIds.includes(item.fromUserId)
          );
          results.forEach((item) => {
            if (!mfollows.find((m) => m.fromUserId == item.fromUserId)) {
              mfollows.push(item);
            }
          });
          setTotalMutuals(mfollows.length);
          setMutualAvatars(
            mfollows
              .map((item) => item.fromUserImage)
              .filter((item) => item != null)
              .slice(0, 5)
          );
          let slicedMutuals = mfollows.slice(0, 3);
          setMutualNames(slicedMutuals.map((item) => item.fromUserName));
          console.log("add mutuals to store");
          addMutualsToStore(mfollows, userId);
        });
      }
    }
  };

  return {
    totalMutuals,
    mutualAvatars,
  };
};
