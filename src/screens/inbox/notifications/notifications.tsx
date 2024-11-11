import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import {
  arrayUnion,
  collection,
  doc,
  getFirestore,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { OutlineButton } from "../../../components/buttons/buttons";
import FollowButton from "../../../components/buttons/follow-button";
import { Paginator } from "../../../components/lists/paginator";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, LightText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { useUserForId } from "../../../hooks/useUsers";
import { Activity } from "../../../models/activity";
import { bodyTextForKind } from "../../../services/activity-service";
import { getResizedImage } from "../../../services/utils";

export default function NotificationsList() {
  const me = useMe();

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (me.unreadActivityCount > 0) {
      if (activity.length > 12) {
        let userRef = doc(getFirestore(), "users", me.id);
        updateDoc(userRef, {
          unreadActivityCount: 0,
        });
      }
    }
  }, [activity.length, me.unreadActivityCount]);

  if (!me || !me.id) {
    return <View />;
  }

  return (
    <Paginator
      queryOptions={[where("recipientId", "==", me.id)]}
      orderByOption={orderBy("timeCreated", "desc")}
      baseCollection={collection(getFirestore(), "activity")}
      contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 10 }}
      needsReload={false}
      setNeedsReload={() => {}}
      setResults={setActivity}
      results={activity}
      itemsPerPage={12}
      listEmptyText={"No activity."}
      renderListItem={function (item: any, visible: boolean) {
        return <NotificationItem activity={item} />;
      }}
      trackVisible={false}
      setLastFetch={() => {}}
    />
  );
}

function NotificationItem({ activity }: { activity: Activity }) {
  const navigation = useNavigation();

  const me = useMe();
  const [cleared, setCleared] = useState(false);
  const user = useUserForId(activity.actorId);

  useEffect(() => {
    if (activity.unread) {
      const ref = doc(getFirestore(), "activity", activity.id);
      updateDoc(ref, {
        unread: false,
      });
    }
  }, []);

  const acceptCoauthor = async () => {
    let postId = activity.postId;
    const ref = doc(getFirestore(), "posts", postId);
    updateDoc(ref, {
      collaboratorIds: arrayUnion(me.id),
      coauthorsApproved: true,
    });

    const activityRef = doc(getFirestore(), "activity", activity.id);
    updateDoc(activityRef, {
      cleared: true,
    });

    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "confirm-coauthor";
    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: activity.actorId,
      kind: activityKind,
      post: activity.postId
        ? {
            id: activity.postId,
            kind: activity.postKind,
            image: activity.postImage,
          }
        : null,
      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {
        commentId: activity.commentId,
        postId: activity.postId,
      },
    });

    setCleared(true);
  };

  const cleanedBodyText = useMemo(() => {
    if (user && user.username) {
      if (user.username != activity.actorName) {
        return `${activity.bodyText}`.replace(
          activity.actorName,
          user.username
        );
      }
    }
    return `${activity.bodyText}`;
  }, [activity, user]);

  const onPressActivity = (activity) => {
    console.log("on press", activity.kind);
    switch (activity.kind) {
      case "challenge-win":
        (navigation as any).navigate("ArenaDetails", {
          screen: "ArenaDetailScreen",
          params: {
            challengeId: activity.challengeId,
          },
        });
        break;

      case "follow":
        (navigation as any).navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: { userId: activity.actorId },
        });
        break;

      case "executive-add-artist":
        (navigation as any).navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: { userId: activity.actorId },
        });
        break;

      case "add-to-jukebox":
        (navigation as any).navigate("PlaylistDetail", {
          playlistId: activity.playlistId,
        });
        break;

      case "post-like":
      case "post-mention":
      case "post-save":

      case "post-comment":
        (navigation as any).navigate("PostDetail", {
          postId: activity.postId,
        });
        break;
      case "room-add-member":
        (navigation as any).navigate("RoomDetailScreen", {
          roomId: activity.roomId,
        });

        break;
      case "marketplace-save":
        (navigation as any).navigate("PostDetail", {
          postId: activity.postId,
          marketplace: true,
        });
        break;
      default:
        if (activity.challengeId) {
          (navigation as any).navigate("ArenaDetails", {
            screen: "ArenaDetailScreen",
            params: {
              challengeId: activity.challengeId,
            },
          });
        } else if (activity.postId) {
          (navigation as any).navigate("PostDetail", {
            postId: activity.postId,
          });
        }
        break;
    }
  };

  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        borderBottomColor: "rgba(256, 256, 256, 0.4)",
        borderBottomWidth: 1,
      }}
      onPress={() => {
        onPressActivity(activity);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            paddingRight: 5,
            flexShrink: 1,
          }}
        >
          {activity.actorId == "admin" ? (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                borderColor: "white",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../assets/icon-white.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
                contentFit="contain"
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("ProfileStack", {
                  screen: "ProfileScreen",
                  params: { userId: activity.actorId },
                });
              }}
            >
              <ProfileImage
                size={40}
                // @ts-ignore
                user={{
                  id: activity.actorId,
                  profilePicture: activity.actorImage,
                  username: activity.actorName,
                  ...user,
                }}
              />
            </TouchableOpacity>
          )}

          <View style={{ flexShrink: 1 }}>
            <BodyText
              style={{ marginLeft: 12 }}
            >{`${cleanedBodyText}`}</BodyText>
          </View>
        </View>
        <View style={{}}>
          {activity.kind == "create-coauthor" &&
          !(activity.cleared || cleared) ? (
            <View>
              <OutlineButton
                submit={acceptCoauthor}
                title={"Accept"}
                loading={false}
              />
            </View>
          ) : activity.kind == "follow" ? (
            <FollowButton // @ts-ignore
              user={{
                id: activity.actorId,
                profilePicture: activity.actorImage,
                username:
                  user && user.username ? user.username : activity.actorName,
              }}
              color={colors.blue}
              hideIfFollowing={true}
              userId={activity.actorId}
            />
          ) : activity.postImage ? (
            <TouchableOpacity onPress={() => onPressActivity(activity)}>
              <Image
                style={{ width: 40, height: 40, borderRadius: 4 }}
                source={{
                  uri: getResizedImage(activity.postImage),
                }}
                transition={500}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.lightblack,
              }}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../../../assets/icon-white.png")}
                transition={500}
              />
            </View>
          )}
        </View>
      </View>

      {activity.commentText && (
        <View style={{ paddingHorizontal: 52, opacity: 0.8 }}>
          <LightText>{`"${activity.commentText}"`}</LightText>
        </View>
      )}
    </TouchableOpacity>
  );
}
