import { AntDesign } from "@expo/vector-icons";
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
import React, { useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useMe } from "../../hooks/useMe";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Activity } from "../../models/activity";
import { Cosign } from "../../models/cosign";
import { Post } from "../../models/post";
import { bodyTextForKind } from "../../services/activity-service";

export interface LikeStatus {
  like: Activity | null;
  loaded: boolean;
  overrideNumLikes: number;
}

export default function LikeButton({
  post,
  cosign,
  likeStatus,
  setLikeStatus,
  profileColors,
  size,
}: {
  post?: Post;
  cosign?: Cosign;
  profileColors: ProfileColors;
  likeStatus: LikeStatus;
  setLikeStatus: any;
  size?: number;
}) {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const me = useMe();

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    if (me && me.id && post && post.id) {
      let activityKind = buttonKind == "cosign" ? "cosign-like" : "post-like";
      let items = [];

      let q = query(
        collection(getFirestore(), "activity"),
        where("kind", "==", activityKind),
        where("actorId", "==", me.id),
        where("postId", "==", post.id)
      );

      if (buttonKind == "cosign") {
        q = query(
          collection(getFirestore(), "activity"),
          where("kind", "==", activityKind),
          where("actorId", "==", me.id),
          where("cosignId", "==", cosign.id)
        );
      }
      const snapshot = await getDocs(q);

      snapshot.forEach((child) => {
        items.push({ ...child.data(), id: child.id });
      });

      if (items.length > 0) {
        setLikeStatus({
          like: items[0],
          loaded: true,
          overrideNumLikes: 0,
        });
      } else {
        setLikeStatus({
          ...likeStatus,
          loaded: true,
        });
      }
    } else {
      setLikeStatus({
        ...likeStatus,
        loaded: true,
      });
    }
  };

  const buttonKind = useMemo(() => {
    if (post) {
      return "post";
    } else if (cosign) {
      return "cosign";
    } else {
      return "";
    }
  }, [post, cosign]);

  const didLike = useMemo(() => {
    return likeStatus.like != null;
  }, [likeStatus]);

  const toggleLike = async () => {
    if (likeStatus.loaded) {
      setLikeStatus({ ...likeStatus, loaded: false });
      if (likeStatus.like && likeStatus.like.id) {
        setLikeStatus({
          like: null,
          overrideNumLikes: -1,
          loaded: true,
        });
        let ref = doc(getFirestore(), "activity", likeStatus.like.id);
        await deleteDoc(ref);
        updatePost(true);
      } else {
        let activityKind = "post-like";
        let newLike = {
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
        };
        setLikeStatus({
          like: { ...newLike, id: "-1" },
          overrideNumLikes: 1,
          loaded: false,
        });
        var createActivity = httpsCallable(getFunctions(), "createActivity");

        createActivity(newLike)
          .then((result) => {
            if (result && result.data) {
              updatePost(false);
              setLikeStatus({
                like: (result.data as any).activity,
                overrideNumLikes: 1,
                loaded: true,
              });
            }
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    }
  };

  const likedAvatars = useMemo(() => {
    return buttonKind == "cosign"
      ? cosign.likedAvatars || []
      : post.likedAvatars || [];
  }, [post, cosign, buttonKind]);

  const updatePost = async (didDelete: boolean) => {
    let ref =
      buttonKind == "cosign"
        ? doc(getFirestore(), "cosigns", cosign.id)
        : doc(getFirestore(), "posts", post.id);

    let myAvatar = me.profilePicture ?? null;
    if (didDelete) {
      await updateDoc(ref, {
        likeCount: increment(-1),
        likedAvatars: arrayRemove(myAvatar),
      });
    } else {
      if ((likedAvatars || []).length < 5) {
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

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable onPress={toggleLike} style={{ marginRight: 8 }}>
        <AntDesign
          style={likeStatus.loaded ? { opacity: 1 } : { opacity: 0 }}
          name={didLike ? "heart" : "hearto"}
          size={size ? size : 24}
          color={didLike ? buttonColor : textColor}
        />
      </Pressable>
    </View>
  );
}
