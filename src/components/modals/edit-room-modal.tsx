import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Alert, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { Room } from "../../models/room";
import AvatarList from "../lists/avatar-list";
import { TextInputInnerModal } from "../upload-wrappers/text-input-modal";
import { UserPickerInnerModal } from "../upload-wrappers/userpicker-button";
import { useMe } from "../../hooks/useMe";
import { getFunctions, httpsCallable } from "firebase/functions";
import { bodyTextForKind } from "../../services/activity-service";
import { useNavigation } from "@react-navigation/native";

export const EditRoomModal = ({
  room,
  setRoom,
  members,
  setMembers,
  onDelete,
  showModal,
  setShowModal,
  addSystemMessage,
}: {
  room: Room;
  setRoom: any;
  members: any;
  setMembers: any;
  onDelete: any;
  showModal: boolean;
  setShowModal: any;
  addSystemMessage: any;
}) => {
  const me = useMe();
  const [tempMembers, setTempMembers] = useState(members);
  const [showingNewMembers, setShowingNewMembers] = useState(false);
  const [newTitle, setNewTitle] = useState(room.name || "");
  const [showingTitle, setShowingTitle] = useState(false);
  const navigation = useNavigation();

  const deleteRoom = async () => {
    if (room) {
      setShowModal(false);
      Alert.alert(
        "Archive Room",
        "Are you sure you want to archive this room?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await updateDoc(doc(getFirestore(), "rooms", room.id), {
                archived: true,
              });

              onDelete(room);
            },
          },
        ]
      );
    }
  };

  const onClickItem = (title: string) => {
    if (title == "Edit Members") {
      setShowingNewMembers(true);
    }

    if (title == "Edit Title") {
      setShowingTitle(true);
    }

    if (title == "Leave Room") {
      let unreadCounts = { ...room.unreadCounts };
      unreadCounts[me.id] = 0;
      setMembers(members.filter((item) => item.id != me.id));
      let newUserIds = room.userIds.filter((item) => item != me.id);
      updateRoom({ userIds: newUserIds, unreadCounts: unreadCounts });
      setRoom({
        ...room,
        userIds: newUserIds,
        unreadCounts: unreadCounts,
      });

      setShowModal(false);
      navigation.goBack();
    }

    if (title == "Archive Room") {
      deleteRoom();
      setShowModal(false);
    }
  };

  var options = useMemo(() => {
    if (!room) {
      return [];
    }

    let items = [
      {
        title: "Edit Title",
        icon: "edit",
        kind: "arrow",
      },
    ];

    items.push({
      title: "Edit Members",
      icon: "star",
      kind: "arrow",
    });

    if (me && me.id == room.initiatorId) {
      items.push({
        title: "Archive Room",
        icon: "close",
        kind: "arrow",
      });
    } else {
      items.push({
        title: "Leave Room",
        icon: "close",
        kind: "arrow",
      });
    }

    return items;
  }, [room]);

  const updateRoom = async (updates) => {
    await updateDoc(doc(getFirestore(), "rooms", room.id), {
      ...updates,
    });
  };

  const notifyMemberAdded = async (user) => {
    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "room-add-member";
    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: user.id,
      kind: activityKind,

      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {
        roomId: room.id,
      },
    });

    const ref = doc(getFirestore(), "users", user.id);
    updateDoc(ref, {
      unreadRoomChatCount: 1,
    });
    addSystemMessage(`${me.username} added ${user.username}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{}}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={{
                paddingVertical:
                  option.title == "Edit Members"
                    ? 10
                    : option.kind == "toggle"
                    ? 4
                    : 14,
                borderBottomColor: colors.transparentWhite3,
                borderBottomWidth: 0.4,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 6,
              }}
              onPress={() => {
                onClickItem(option.title);
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <BoldMonoText
                  style={{
                    color:
                      option.title == "Archive Room" ||
                      option.title == "Leave Room"
                        ? "red"
                        : "white",
                  }}
                >
                  {option.title}
                </BoldMonoText>
              </View>
              <View>
                {option.kind == "arrow" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {option.title == "Edit Title" && (
                      <View>
                        <BoldMonoText
                          style={{
                            color: "white",
                            maxWidth: SCREEN_WIDTH * 0.45,
                          }}
                          numLines={1}
                        >
                          {room.name}
                        </BoldMonoText>
                      </View>
                    )}

                    {room &&
                      members &&
                      members.length == room.userIds.length &&
                      option.title == "Edit Members" && (
                        <View>
                          <AvatarList
                            avatars={members.map((item) => item.profilePicture)}
                            includeBlank={true}
                            totalCount={members.length}
                            size={24}
                          />
                        </View>
                      )}
                    {option.title != "Archive Room" && (
                      <AntDesign
                        style={{ marginLeft: 4 }}
                        name="right"
                        size={14}
                        color={colors.transparentWhite3}
                      />
                    )}
                  </View>
                ) : (
                  <View />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      <Modal visible={showingTitle}>
        <TextInputInnerModal
          setShowModal={setShowingTitle}
          confirm={() => {
            updateRoom({ name: newTitle });
            setRoom({ ...room, name: newTitle });
            setShowingTitle(false);
            addSystemMessage(`${me.username} renamed the room`);
          }}
          modalTitle={"NAME ROOM"}
          text={newTitle}
          setText={setNewTitle}
        />
      </Modal>
      <Modal visible={showingNewMembers}>
        {room && members && members.length == room.userIds.length && (
          <UserPickerInnerModal
            setShowModal={setShowingNewMembers}
            confirm={(emptyval) => {
              let originalUserIds = room.userIds;
              let newUserIds = tempMembers.map((item) => item.id);
              newUserIds.forEach((id) => {
                if (!originalUserIds.includes(id)) {
                  notifyMemberAdded(tempMembers.find((item) => item.id == id));
                }
              });

              let unreadCounts = { ...room.unreadCounts };
              newUserIds.forEach((id) => {
                if (!Object.keys(unreadCounts).includes(id)) {
                  unreadCounts[id] = 1;
                }
              });
              setMembers(tempMembers);
              updateRoom({ userIds: newUserIds, unreadCounts: unreadCounts });
              setRoom({
                ...room,
                userIds: newUserIds,
                unreadCounts: unreadCounts,
              });
              setShowingNewMembers(false);
            }}
            users={tempMembers}
            setUsers={(newM) => {
              if (me.id == room.initiatorId) {
                if (!newM.map((item) => item.id).includes(me.id)) {
                  Alert.alert(
                    "You cannot remove yourself from a room that you own. Please archive the room instead."
                  );
                } else {
                  setTempMembers(newM);
                }
              } else {
                let originalUserIds = room.userIds;
                let didRemove = false;
                originalUserIds.forEach((userId) => {
                  if (!newM.map((item) => item.id).includes(userId)) {
                    didRemove = true;
                  }
                });
                if (didRemove) {
                  Alert.alert("You don't have permission to remove members.");
                } else {
                  setTempMembers(newM);
                }
              }
            }}
          />
        )}
      </Modal>
    </View>
  );
};
