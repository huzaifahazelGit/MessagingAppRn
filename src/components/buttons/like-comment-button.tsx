import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { replaceMentionValues } from "react-native-controlled-mentions";
import { useMe } from "../../hooks/useMe";
import { Activity } from "../../models/activity";
import { Comment } from "../../models/post";
import { bodyTextForKind } from "../../services/activity-service";
import { ProfileColors } from "../../hooks/useProfileColors";

export default function CommentLikeButton({
  comment,
  profileColors,
}: {
  comment: Comment;
  profileColors: ProfileColors;
}) {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const me = useMe();
  const [like, setLike] = useState<Activity>(null);
  const [loaded, setLoaded] = useState(false);

  const navigation = useNavigation();
  const [overrideNumLikes, setOverrideNumLikes] = useState<number>(0);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    if (me && me.id && comment && comment.id) {
      let items = [];

      let q = query(
        collection(getFirestore(), "activity"),
        where("kind", "==", "comment-like"),
        where("commentId", "==", comment.id),
        where("actorId", "==", me.id)
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

  if (!(me && me.id)) {
    return <View />;
  }

  const toggleLike = async () => {
    if (me && me.id) {
      if (loaded) {
        setLoaded(false);
        if (like && like.id) {
          setOverrideNumLikes(-1);
          let ref = doc(getFirestore(), "activity", like.id);
          await deleteDoc(ref);
          updateComment(true);
          setLike(null);
          setLoaded(true);
        } else {
          setOverrideNumLikes(1);

          var createActivity = httpsCallable(getFunctions(), "createActivity");
          let activityKind = "comment-like";

          createActivity({
            actor: {
              id: me.id,
              username: me.username,
              profilePicture: me.profilePicture,
            },
            recipientId: comment.userId,
            kind: activityKind,
            post: null,
            bodyText: bodyTextForKind(activityKind, me),
            extraVars: {
              commentId: comment.id,
              postId: comment.postId,
              commentText: replaceMentionValues(
                comment.text,
                ({ name }) => `@${name}`
              ),
            },
          })
            .then((result) => {
              if (result && result.data) {
                updateComment(false);
                setLike((result.data as any).activity);
                setLoaded(true);
              }

              setLoaded(true);
            })
            .catch((err) => {
              console.log("error", err);
            });
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

  const updateComment = async (didDelete: boolean) => {
    let ref = doc(
      getFirestore(),
      "posts",
      comment.postId,
      "comments",
      comment.id
    );

    let myAvatar = me.profilePicture ?? null;
    if (didDelete) {
      await updateDoc(ref, {
        likeCount: increment(-1),
        likedAvatars: arrayRemove(myAvatar),
      });
    } else {
      if ((comment.likedAvatars || []).length < 5) {
        await updateDoc(ref, {
          likeCount: increment(1),
          likedAvatars: arrayUnion(myAvatar),
          lastInteractor: me.id,
        });
      } else {
        await updateDoc(ref, {
          likeCount: increment(1),
          lastInteractor: me.id,
        });
      }
    }
  };

  const numLikes = useMemo(() => {
    let num = comment.likeCount || 0;

    return num + overrideNumLikes;
  }, [comment, overrideNumLikes]);

  return (
    <Pressable onPress={toggleLike}>
      <AntDesign
        style={loaded ? { opacity: didLike ? 1 : 0.6 } : { opacity: 0 }}
        name={didLike ? "heart" : "hearto"}
        size={14}
        color={didLike ? buttonColor : textColor}
      />
    </Pressable>
  );
}
