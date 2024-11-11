import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { useMe } from "../../hooks/useMe";
import { Follow } from "../../models/follow";
import { User } from "../../models/user";
import { bodyTextForKind } from "../../services/activity-service";
import {
  SocialStore,
  addFollowToStore,
  addNotFollowingToStore,
  removeFollowFromStore,
} from "../../store/follows-collabs-store";
import { OutlineButton } from "./buttons";

export default function FollowButton({
  userId,
  user,
  color,
  hideIfFollowing,
  checkMarkIfFollowing,
  wide,
  buttonStyle,
}: {
  user: User;
  userId: string;
  color: string;
  hideIfFollowing?: boolean;
  checkMarkIfFollowing?: boolean;
  wide?: boolean;
  buttonStyle?: any;
}) {
  const me = useMe();
  const [follow, setFollow] = useState<Follow>(null);
  const [loaded, setLoaded] = useState(true);

  const navigation = useNavigation();
  const follows = SocialStore.useState((s) => s.follows);
  const notFollowing = SocialStore.useState((s) => s.notFollowing);

  useEffect(() => {
    loadFollows();
  }, []);

  const loadFollows = async () => {
    if (me && me.id && userId) {
      let existingFollow = follows.find(
        (item) => item.fromUserId == me.id && item.toUserId == userId
      );
      let existingNotFollow = notFollowing.find((item) => item == userId);
      if (existingFollow) {
        setFollow(existingFollow);
      } else if (!existingNotFollow) {
        setLoaded(false);
        let items = [];

        const q = query(
          collection(getFirestore(), "follows"),
          where("fromUserId", "==", me.id),
          where("toUserId", "==", userId)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((child) => {
          items.push({ ...child.data(), id: child.id });
        });
        if (items.length > 0) {
          let follow = items[0];
          setFollow(follow);
          addFollowToStore(follow);
        } else {
          addNotFollowingToStore(userId);
        }
        setLoaded(true);
      }
    }
  };

  const isFollowing = useMemo(() => {
    return follow != null;
  }, [follow]);

  if (me && me.id && me.id == userId) {
    return <View />;
  }

  const toggleFollow = async () => {
    if (me && me.id) {
      if (loaded) {
        setLoaded(false);
        if (follow && follow.id) {
          let ref = doc(getFirestore(), "follows", follow.id);
          await deleteDoc(ref);

          setFollow(null);
          removeFollowFromStore(userId);
          setLoaded(true);
        } else {
          let follow: Follow = {
            fromUserId: me.id,
            fromUserImage: me.profilePicture || null,
            fromUserName: me.username,
            toUserId: userId,
            toUserImage: user.profilePicture || null,
            toUserName: user.username,
            createdate: new Date(),
          };
          let res = await addDoc(collection(getFirestore(), "follows"), {
            ...follow,
          });

          setFollow({ ...follow, id: res.id });
          addFollowToStore({ ...follow, id: res.id });
          setLoaded(true);
          createFollowActivity();
        }
      }
    } else {
      Alert.alert("Please sign in to follow.", "", [
        {
          text: "OK",
          onPress: () => (navigation as any).navigate("Login"),
        },
      ]);
    }
  };

  const createFollowActivity = async () => {
    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "follow";
    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: userId,
      kind: activityKind,
      post: null,
      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {},
    });
  };

  if (hideIfFollowing && isFollowing) {
    return <View />;
  }

  if (checkMarkIfFollowing && isFollowing) {
    return (
      <View>
        <AntDesign name="checkcircleo" size={24} color={colors.purple} />
      </View>
    );
  }

  if (me && me.id && me.id == user.id) {
    return <View />;
  }

  return wide ? (
    <OutlineButton
      style={{ borderColor: color, flex: 1, ...buttonStyle }}
      textStyle={{ color: color, fontFamily: Fonts.MonoBold }}
      submit={toggleFollow}
      title={isFollowing ? "Following" : "Follow"}
      loading={!loaded}
    />
  ) : (
    <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
      <OutlineButton
        style={{ borderColor: color, ...buttonStyle }}
        textStyle={{ color: color, fontFamily: Fonts.MonoBold }}
        submit={toggleFollow}
        title={isFollowing ? "Following" : "Follow"}
        loading={!loaded}
      />
    </View>
  );
}
