import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useState } from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { useFeaturedUsers } from "../../hooks/useUsers";
import { Follow } from "../../models/follow";
import { User } from "../../models/user";
import { bodyTextForKind } from "../../services/activity-service";
import {
  addFollowToStore,
  removeFollowFromStore,
} from "../../store/follows-collabs-store";
import ProfileImage from "../images/profile-image";

export const SuggestedFollowsModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const me = useMe();
  const insets = useSafeAreaInsets();

  const featuredUsers = useFeaturedUsers();

  const [follows, setFollows] = useState([]);

  const createFollow = async (user: User) => {
    if (follows.map((item) => item.toUserId).includes(user.id)) {
      let follow = follows.find((item) => item.toUserId == user.id);
      if (follow) {
        let ref = doc(getFirestore(), "follows", follow.id);
        await deleteDoc(ref);
        setFollows(follows.filter((item) => item.toUserId != user.id));
        removeFollowFromStore(user.id);
      }
    } else {
      let follow: Follow = {
        fromUserId: me.id,
        fromUserImage: me.profilePicture || null,
        fromUserName: me.username,
        toUserId: user.id,
        toUserImage: user.profilePicture || null,
        toUserName: user.username,
        createdate: new Date(),
      };
      let res = await addDoc(collection(getFirestore(), "follows"), {
        ...follow,
      });

      setFollows([...follows, { ...follow, id: res.id }]);
      addFollowToStore({ ...follow, id: res.id });
      createFollowActivity(user.id);
    }
  };

  const createFollowActivity = async (userId: String) => {
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

  return (
    <Modal visible={showModal} animationType="slide">
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          backgroundColor: colors.lightblack,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <BoldMonoText
            style={{
              fontSize: 20,
            }}
          >
            Select users to follow:
          </BoldMonoText>

          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
            }}
          >
            <Ionicons name="close" size={25} color={colors.blue} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={(featuredUsers || []).sort((a, b) => {
            if (a.username && b.username) {
              return a.username.length - b.username.length;
            } else {
              return -1;
            }
          })}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                width: (SCREEN_WIDTH - 24) / 3,
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: 14,
              }}
              onPress={() => {
                createFollow(item);
              }}
            >
              {follows.map((item) => item.toUserId).includes(item.id) ? (
                <View
                  style={{
                    width: 85,
                    height: 85,
                    borderRadius: 85,
                    backgroundColor: colors.blue,
                    borderColor: "white",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="checkmark" size={40} color={"white"} />
                </View>
              ) : (
                <ProfileImage
                  border={true}
                  size={85}
                  user={item}
                  includeBlank={true}
                />
              )}
              <BodyText
                style={{
                  marginTop: 4,
                  width: 80,
                  textAlign: "center",
                }}
                numLines={2}
              >
                {item.username}
              </BodyText>
            </TouchableOpacity>
          )}
        />

        {follows.length > 0 && (
          <View
            style={{
              position: "absolute",
              left: 20,
              bottom: 40,
              right: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: colors.purple,
                alignItems: "center",
                paddingVertical: 12,
                borderRadius: 14,
              }}
              onPress={() => setShowModal(false)}
            >
              <BoldMonoText style={{ fontSize: 20 }}>DONE</BoldMonoText>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
