import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { IMAGEKIT_FULL_REPLACE } from "../../../constants/env";
import { Session } from "../../../models/session";
import { StoryData } from "../session-constants";
import UserSessionsView from "./user-sessions-view";

const SessionViewContainer = () => {
  const route = useRoute();
  const [groupIndex, setGroupIndex] = useState<number>(0);
  const [stories, setStories] = useState<StoryData[]>([]);

  const [loaded, setLoaded] = useState<boolean>(false);
  const _loadingAnim = React.useMemo(() => new Animated.Value(0), []);
  const navigation = useNavigation();

  useEffect(() => {
    const _stories = (route.params as any).stories;
    const _otherUser = (route.params as any).otherUser;
    const _upcomingSessions = JSON.parse(
      (route.params as any).upcomingSessions
    );

    let storyData = [
      {
        user: JSON.parse(_otherUser),
        sessions: JSON.parse(_stories),
      },
      ..._upcomingSessions.map((s: Session[]) => ({
        user: { id: s[0].userId },
        sessions: s,
      })),
    ];
    setStories(storyData);
    setLoaded(true);
    preloadNext(_upcomingSessions, storyData);
  }, []);

  const preloadNext = async (upcoming: Session[][], stories: StoryData[]) => {
    if (upcoming.length > 0) {
      const userSessions = upcoming[0];
      const nextUserId = userSessions[0].userId;

      const docRef = doc(getFirestore(), "users", nextUserId);

      const userSnapshot = await getDoc(docRef);
      const user: any = { ...userSnapshot.data(), id: nextUserId };
      let newStories = stories.map((item) => {
        if (item.user.id === nextUserId) {
          return {
            ...item,
            user,
          };
        } else {
          return item;
        }
      });
      setStories(newStories);
      let preFetchTasks: Promise<any>[] = [];
      (userSessions || []).forEach((story) => {
        preFetchTasks.push(
          (async () => {
            const docRef = doc(
              getFirestore(),
              "superimages",
              `${story.superImageId}`
            );
            const rq = await getDoc(docRef);
            const data = rq.data() || {};
            let uri = (data.uri || "").replace(
              "https://firebasestorage.googleapis.com/",
              IMAGEKIT_FULL_REPLACE
            );
            try {
              return await Image.prefetch(uri).then(() => {
                return { ...data, id: story.superImageId };
              });
            } catch (e) {
              return { ...data, id: story.superImageId };
            }
          })()
        );
      });
      preloadNext(upcoming.slice(1), newStories);
    }
  };

  const _onAnimation = () => {
    Animated.loop(
      Animated.timing(_loadingAnim, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1000,
      }),
      {
        iterations: 20,
      }
    ).start();
  };

  return (
    <View
      style={{
        backgroundColor: "#000",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loaded && <UserSessionsView groupIndex={groupIndex} data={stories} />}
      {!loaded && (
        <View
          style={{
            height: "100%",
            width: "100%",
            ...StyleSheet.absoluteFillObject,
            zIndex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            onLayout={_onAnimation}
            style={{
              height: 64,
              width: 64,
              borderRadius: 64,
              borderColor: "#fff",
              borderWidth: 4,
              borderStyle: "dashed",
              transform: [
                {
                  rotate: _loadingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SessionViewContainer;
