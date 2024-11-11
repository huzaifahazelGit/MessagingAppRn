import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMe } from "../../../hooks/useMe";
import { User } from "../../../models/user";

import { LinearGradient } from "expo-linear-gradient";
import { useUserForId } from "../../../hooks/useUsers";

import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../constants/colors";
import {
  IMAGEKIT_FULL_REPLACE,
  IMAGEKIT_SMALL_REPLACE,
} from "../../../constants/env";
import { Session } from "../../../models/session";
import { SocialStore } from "../../../store/follows-collabs-store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const StoryPreviewWrapper = ({
  stories,
  userId,
  onSelectStory,
  index,
}: {
  stories: Session[];
  userId: string;
  index: number;
  onSelectStory?: any;
}) => {
  const otherUser = useUserForId(userId);

  if (otherUser) {
    return (
      <StoryPreviewItem
        storyList={stories}
        user={otherUser}
        index={index}
        onSelectStory={onSelectStory}
      />
    );
  } else {
    return <View />;
  }
};

const StoryPreviewItem = ({
  user,
  storyList,
  index,
  size,
  skipUsername,
  onSelectStory,
}: {
  user: User;
  storyList: Session[];
  index: number;
  size?: number;
  skipUsername?: boolean;
  onSelectStory?: any;
}) => {
  const navigation = useNavigation();
  const _loadingDeg = new Animated.Value(0);
  const [seen, setSeen] = useState<boolean>(false);
  const [preloadingImage, setPreloadingImage] = useState<boolean>(false);
  const [superImages, setSuperImages] = useState([]);
  const me = useMe();

  const watched = SocialStore.useState((s) => s.seenSessions);

  useEffect(() => {
    const isSeen: boolean = storyList.every(
      (story) =>
        (story.seenIds || []).indexOf(me.id) > -1 ||
        watched.indexOf(story.id) > -1
    );
    setSeen(isSeen);
  }, [storyList]);

  const _onShowStory = () => {
    if (seen) {
      return _onCompletedLoadingImage();
    }

    setPreloadingImage(true);
    let preFetchTasks: Promise<any>[] = [];
    storyList.forEach((story) => {
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
    const startAt: number = new Date().getTime();
    Promise.all(preFetchTasks).then((results) => {
      setSuperImages(results);
      let downloadedAll: boolean = true;
      results.forEach((result) => {
        if (!result) {
          downloadedAll = false;
        }
      });
      if (downloadedAll) {
        const endAt: number = new Date().getTime();
        if (endAt - startAt < 1000) {
          setTimeout(() => {
            _onCompletedLoadingImage();
          }, 1000 - (endAt - startAt));
        } else _onCompletedLoadingImage();
      }
    });
  };

  const _onAnimateDeg = () => {
    Animated.timing(_loadingDeg, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      if (preloadingImage) {
        _loadingDeg.setValue(0);
        _onAnimateDeg();
      }
    });
  };

  const _onCompletedLoadingImage = () => {
    setPreloadingImage(false);
    if (onSelectStory) {
      onSelectStory(storyList, user, superImages, index);
    } else {
      (navigation as any).navigate("Sessions", {
        screen: "SessionView",
        params: {
          stories: JSON.stringify(storyList),
          otherUser: JSON.stringify(user),
          groupIndex: index,
          upcomingSessions: JSON.stringify([]),
        },
      });
    }
  };

  const finalSize = size || 60;

  return (
    <View
      style={
        skipUsername
          ? styles.container
          : { ...styles.container, marginHorizontal: 7.5, paddingBottom: 20 }
      }
    >
      <View
        style={{
          ...styles.itemWrapper,
          height: finalSize + 4,
          width: finalSize + 4,
        }}
      >
        {!seen ? (
          <LinearGradient
            colors={[colors.blue, colors.purple]}
            start={{ x: 0.75, y: 0.25 }}
            end={{ x: 0.25, y: 0.75 }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ddd",
            }}
          />
        )}
        {preloadingImage && !seen && (
          <Animated.View
            onLayout={_onAnimateDeg}
            style={{
              ...styles.pointsWrapper,
              transform: [
                {
                  rotate: _loadingDeg.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <View style={styles.pointWrapper}>
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [
                  {
                    rotate: "30deg",
                  },
                ],
              }}
            >
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [
                  {
                    rotate: "60deg",
                  },
                ],
              }}
            >
              <View style={styles.triagle} />
            </View>
            <View
              style={{
                ...styles.pointWrapper,
                transform: [
                  {
                    rotate: "90deg",
                  },
                ],
              }}
            >
              <View style={styles.triagle} />
            </View>
          </Animated.View>
        )}
        <View
          style={{
            ...styles.imageContainer,
            width: finalSize,
            height: finalSize,
          }}
        >
          <TouchableOpacity
            onPress={_onShowStory}
            activeOpacity={0.8}
            style={styles.imageWrapper}
          >
            <Image
              style={styles.image}
              source={{
                uri: (user.profilePicture ?? "").replace(
                  "https://firebasestorage.googleapis.com/",
                  IMAGEKIT_SMALL_REPLACE
                ),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {!skipUsername && (
        <View style={styles.username}>
          <Text
            numberOfLines={1}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 12,
              color: seen ? "#666" : "#fff",
            }}
          >
            {user.username}
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(StoryPreviewItem);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemWrapper: {
    position: "relative",

    overflow: "hidden",
    borderRadius: 999,
  },
  username: {
    position: "absolute",
    bottom: 0,
    left: (64 - 74) / 2,
    width: 74,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 999,

    backgroundColor: "#fff",
    top: 2,
    left: 2,
    position: "absolute",
  },
  imageWrapper: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  image: {
    borderRadius: 999,
    width: "100%",
    height: "100%",
  },
  pointsWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  pointWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  circlePoint: {
    position: "absolute",
    height: 2,
    width: 5,
    backgroundColor: "#fff",
  },
  triagle: {
    position: "absolute",
    transform: [
      {
        rotate: "-180deg",
      },
    ],
    bottom: 27,
    left: (64 - 20) / 2,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 90,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
    borderLeftColor: "transparent",
  },
});
