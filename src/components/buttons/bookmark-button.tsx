import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { DEFAULT_ID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Activity } from "../../models/activity";
import { Post } from "../../models/post";
import { bodyTextForKind } from "../../services/activity-service";
import { BodyText } from "../text";

export default function BookmarkButton({
  post,
  profileColors,
}: {
  post: Post;
  profileColors: ProfileColors;
}) {
  const { textColor, buttonColor } = profileColors;
  const me = useMe();
  const [like, setLike] = useState<Activity>(null);
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();
  const postId = post.id || DEFAULT_ID;

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    if (me && me.id) {
      let items = [];

      const q = query(
        collection(getFirestore(), "activity"),
        where(
          "kind",
          "==",
          post.marketplace ? "marketplace-save" : "post-save"
        ),
        where("postId", "==", postId ? postId : DEFAULT_ID),
        where("actorId", "==", me && me.id ? me.id : DEFAULT_ID)
      );

      const snapshot = await getDocs(q);

      snapshot.forEach((child) => {
        items.push({ ...child.data(), id: child.id });
      });
      if (items.length > 0) {
        setLike(items[0]);
      }
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  };

  const didLike = useMemo(() => {
    return like != null;
  }, [like]);

  const toggleLike = async () => {
    if (me && me.id) {
      if (loaded) {
        const userRef = doc(getFirestore(), "users", me.id);
        updateDoc(userRef, {
          lastBookmark: new Date(),
          lastActive: new Date(),
        });
        setLoaded(false);
        if (like && like.id) {
          const activityRef = doc(getFirestore(), "activity", like.id);
          await deleteDoc(activityRef);
          let postRef = doc(getFirestore(), "users", me.id, "saved", post.id);
          await deleteDoc(postRef);

          setLike(null);
          setLoaded(true);
        } else {
          if (post.userId != me.id) {
            var createActivity = httpsCallable(
              getFunctions(),
              "createActivity"
            );
            let activityKind = post.marketplace
              ? "marketplace-save"
              : "post-save";
            createActivity({
              actor: {
                id: me.id,
                username: me.username,
                profilePicture: me.profilePicture,
              },
              recipientId: post.userId,
              kind: activityKind,
              post: {
                id: post.id,
                kind: post.kind,
                image: post.image,
              },
              bodyText: bodyTextForKind(activityKind, me),
              extraVars: {},
            })
              .then((result) => {
                if (result && result.data) {
                  setLike((result.data as any).activity);
                }

                setLoaded(true);
              })
              .catch((err) => {
                console.log("error", err);
              });
          }

          let ref = doc(getFirestore(), "users", me.id, "saved", post.id);
          await setDoc(ref, {
            ...post,
          });
        }
      }
    } else {
      Alert.alert("Please sign in to save.", "", [
        {
          text: "OK",
          onPress: () => (navigation as any).navigate("Login"),
        },
      ]);
    }
  };

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={toggleLike}
    >
      <View
        style={{
          height: 20,
          width: 24,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <Ionicons
          name={didLike ? "bookmark" : "bookmark-outline"}
          size={18}
          style={{}}
          color={textColor}
        />
      </View>

      {didLike ? (
        <BodyText style={{ color: textColor }}>Remove from saved</BodyText>
      ) : (
        <BodyText style={{ color: textColor }}>Save</BodyText>
      )}
    </TouchableOpacity>
  );
}
