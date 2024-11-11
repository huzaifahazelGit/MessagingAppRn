import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  SafeAreaView,
  View,
} from "react-native";
import {
  Actions,
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  Message,
  Send,
  Time,
} from "react-native-gifted-chat";
import ProfileImage from "../../../components/images/profile-image";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import {
  DEFAULT_ID,
  IS_ANDROID,
  IS_IOS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";

import { CollabMessage } from "../../../models/collaboration";
import { User } from "../../../models/user";
import { uploadFileAsync } from "../../../services/upload-service";
import { PostItem } from "../../post-item/post-item";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { EditRoomModal } from "../../../components/modals/edit-room-modal";
import RAIUserIcon from "../../../components/images/rai-user-icon";
import { useMe } from "../../../hooks/useMe";
import { useRoomMessages } from "../../../hooks/useRooms";
import { Room } from "../../../models/room";
import ChatAudio from "../chat/components/chat-audio";
import RoomHeader from "./room-header";
import { BodyText } from "../../../components/text";
import HeightAdjustedVideo, {
  SimpleHeightAdjustedVideo,
} from "../../../components/height-adjusted-video";
import { textHasLink } from "../../../services/utils";

export default function RoomDetailScreen() {
  const route = useRoute();
  const params = route.params as any;

  const me = useMe();
  const roomId = params.roomId;
  const userId = me && me.id ? me.id : DEFAULT_ID;

  const [room, setRoom] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [newMessages, setNewMessages] = useState([]);

  const roomMessages = useRoomMessages(roomId);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (params.room) {
      let collab = JSON.parse(params.room);
      setRoom(collab);

      updateReadCounts(collab);
    } else {
      fetchRoom();
    }
  }, []);

  const fetchRoom = async () => {
    let snapshot = await getDoc(doc(getFirestore(), "rooms", roomId));
    let collab = { ...snapshot.data(), id: roomId };
    setRoom(collab);

    updateReadCounts(collab as any);
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (messages.length > 0) {
        messages.forEach((message) => {
          createMessage(message.text, roomId);
        });
      }
    },
    [roomId, room, userId]
  );

  const onAddSystemMessage = async (message) => {
    let newMessage = {
      collaborationId: roomId,
      text: message,
      createdAt: new Date(),
      system: true,
    };
    let res = await addDoc(
      collection(getFirestore(), "rooms", roomId, "messages"),
      newMessage
    );
    setNewMessages([...newMessages, { ...newMessage, id: res.id }]);
  };

  const createMessage = async (
    text: string,
    roomId: string,
    image?: string,
    audio?: string,
    audioTitle?: string,
    video?: string
  ) => {
    let hasLink = textHasLink(text);
    let newMessage: CollabMessage = {
      collaborationId: roomId,
      userId: userId,
      user: {
        _id: userId,
        name: me.username,
        avatar: me.profilePicture ? me.profilePicture : null,
      },
      text: text,
      createdAt: new Date(),
      archived: false,
      video: video ? video : null,
      image: image ? image : null,
      audio: audio ? audio : null,
      audioTitle: audioTitle ? audioTitle : null,
      recipientId: null,
      unread: true,
      // @ts-ignore
      kind: audio
        ? "audio"
        : image
        ? "image"
        : video
        ? "video"
        : hasLink
        ? "link"
        : "text",
    };
    let res = await addDoc(
      collection(getFirestore(), "rooms", roomId, "messages"),
      newMessage
    );
    setNewMessages([...newMessages, { ...newMessage, id: res.id }]);
    updateLatestChat(
      text
        ? text
        : image
        ? `${me.username} sent an image`
        : video
        ? `${me.username} sent a video`
        : audio
        ? `${me.username} sent an audio file`
        : ""
    );
  };

  const updateReadCounts = async (room: Room) => {
    let unreadCounts = room.unreadCounts;
    let unreadCount = room.unreadCounts[userId];
    if (room.lastSenderId != userId) {
      if (unreadCount[userId] > 0) {
        const userRef = doc(getFirestore(), "users", userId);
        if (me.unreadRoomChatCount > unreadCount - 1) {
          await updateDoc(userRef, {
            unreadRoomChatCount: increment(-unreadCount),
          });
        } else {
          updateDoc(userRef, {
            unreadRoomChatCount: 0,
            lastActive: new Date(),
          });
        }
        await updateDoc(doc(getFirestore(), "rooms", roomId), {
          unreadCounts: {
            ...unreadCounts,
            [userId]: 0,
          },
        });
      }
    }
  };

  const updateLatestChat = async (text: string) => {
    if (text) {
      let unreadCounts = { ...room.unreadCounts };
      Object.keys(unreadCounts).forEach((key) => {
        if (key != userId) {
          unreadCounts[key] = unreadCounts[key] + 1;
        }
      });
      let updates: any = {
        lastupdate: new Date(),
        subheading: text,
        unreadCounts: unreadCounts,
        lastSenderId: userId,
      };
      const ref = doc(getFirestore(), "rooms", roomId);
      await updateDoc(ref, {
        ...updates,
      });
      members.forEach((member) => {
        if (member.id != userId) {
          const userRef = doc(getFirestore(), "users", member.id);
          updateDoc(userRef, {
            unreadRoomChatCount: increment(1),
          });
          sendPushNotification(member, text);
        }
      });
    }
  };

  const limitStringToNumCharacters = (str: string, num: number) => {
    if (str.length > num) {
      return str.substring(0, num) + "...";
    }
    return str;
  };

  const sendPushNotification = async (otherUser: User, text: string) => {
    if (otherUser.pushToken) {
      const message = {
        to: otherUser.pushToken,
        sound: "default",
        title: `New message from ${me.username}`,
        body: limitStringToNumCharacters(text, 174 - me.username.length - 17),
        data: {
          roomId: roomId,
        },
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    }
  };

  const addAudio = async () => {
    try {
      let doc = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "audio/*",
      });
      if (doc.type != "cancel") {
        setImageLoading(true);
        let uri = await uploadFileAsync(getStorage(), doc.uri, "tracks");
        createMessage("", roomId, null, uri, doc.name);
        setImageLoading(false);
      }
    } catch (e) {
      console.log("error 2");
      console.log(e);
    }
  };

  const addVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,

        quality: 0.4,
        base64: false,
      });
      if (!result.canceled) {
        setImageLoading(true);
        const uploadUrl = await uploadFileAsync(
          getStorage(),
          result.assets[0].uri,
          "chat"
        );
        setImageLoading(false);
        createMessage("", roomId, null, null, null, uploadUrl);
      }
    } catch (E) {
      setImageLoading(false);
    }
  };

  const addImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: IS_IOS ? true : false,
        aspect: [3, 3] as [number, number],
        quality: 0.4,
        base64: false,
      });
      if (!result.canceled) {
        setImageLoading(true);
        const uploadUrl = await uploadFileAsync(
          getStorage(),
          result.assets[0].uri,
          "chat"
        );
        setImageLoading(false);
        createMessage("", roomId, uploadUrl);
      }
    } catch (E) {
      setImageLoading(false);
    }
  };

  const filteredMessages = useMemo(() => {
    var newItems = newMessages.filter(
      (msg) => !(roomMessages || []).map((item) => item.id).includes(msg.id)
    );

    let items = [...(roomMessages || []), ...newItems]
      .filter((item) => item.createdAt)
      .map((item) => ({
        ...item,
        _id: item.id,
        createdAt: item.createdAt.seconds
          ? new Date(item.createdAt.seconds * 1000)
          : item.createdAt,
      }));

    items.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });

    return items;
  }, [roomMessages, newMessages]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <RoomHeader
        room={room}
        setRoom={setRoom}
        members={members}
        setMembers={setMembers}
        onAddSystemMessage={onAddSystemMessage}
      />

      {room && members.length > 0 ? (
        <GiftedChat
          messages={filteredMessages}
          onSend={(messages) => onSend(messages)}
          user={{
            ...me,
            _id: me && userId ? userId : DEFAULT_ID,

            name: me && me.username ? me.username : "User",
            avatar: me && me.profilePicture ? me.profilePicture : "",
          }}
          wrapInSafeArea={false}
          inverted={false}
          renderDay={(props) => (
            <Day {...props} textStyle={{ fontFamily: Fonts.Bold }} />
          )}
          onPressActionButton={() => {
            if (IS_IOS) {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel", "Audio", "Image", "Video"],
                  cancelButtonIndex: 0,
                  userInterfaceStyle: "dark",
                },
                (buttonIndex) => {
                  if (buttonIndex === 0) {
                    // cancel action
                  } else if (buttonIndex === 1) {
                    addAudio();
                  } else if (buttonIndex === 2) {
                    addImage();
                  } else if (buttonIndex === 3) {
                    addVideo();
                  }
                }
              );
            } else {
              // tara later android
            }
          }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={
                  props.currentMessage?.video
                    ? {
                        left: {
                          backgroundColor: "transparent",
                        },
                        right: {
                          backgroundColor: "transparent",
                        },
                      }
                    : {
                        right: {
                          backgroundColor: colors.darkPurple,
                        },
                      }
                }
                textStyle={{
                  left: {
                    fontFamily: Fonts.Regular,
                  },
                  right: {
                    fontFamily: Fonts.Regular,
                  },
                }}
                renderTime={(timeprops) =>
                  props.currentMessage.audio ? (
                    <View />
                  ) : (
                    <Time
                      {...timeprops}
                      timeTextStyle={{
                        left: {
                          fontFamily: Fonts.Regular,
                        },
                        right: {
                          fontFamily: Fonts.Regular,
                        },
                      }}
                    />
                  )
                }
              />
            );
          }}
          listViewProps={{ showsVerticalScrollIndicator: false }}
          messagesContainerStyle={{ paddingBottom: 30 }}
          // renderActions={(props) => (
          //   <Actions
          //     {...props}
          //     containerStyle={{
          //       marginBottom: 5,
          //     }}
          //   />
          // )}
          renderAvatar={(props) =>
            props.currentMessage.user._id == "RAI" ? (
              <RAIUserIcon size={30} />
            ) : (
              <ProfileImage
                size={35}
                overrideURL={props.currentMessage.user.avatar}
                // @ts-ignore
                user={{ id: props.currentMessage.user._id }}
              />
            )
          }
          alwaysShowSend={true}
          renderSend={(props) => (
            <Send
              {...props}
              containerStyle={{
                height: 32,
                width: 32,
                borderRadius: 32 / 2,
                backgroundColor: colors.blue,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="arrowup" size={24} color="white" />
            </Send>
          )}
          renderMessage={(props) =>
            props.currentMessage.marketplaceItem ? (
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 30,
                  paddingVertical: 30,
                }}
              >
                <View
                  style={{
                    borderColor: "white",
                    borderWidth: 2,
                    borderRadius: 4,
                  }}
                >
                  <PostItem
                    marketplace={true}
                    chat={true}
                    post={props.currentMessage.marketplaceItem}
                    onDelete={() => {}}
                    visible={true}
                    skipAutoPlay={true}
                  />
                </View>
              </View>
            ) : props.currentMessage.video ? (
              <View
                style={{
                  paddingVertical: 12,
                  flexDirection: "row",

                  justifyContent:
                    props.currentMessage.user._id == me.id
                      ? "flex-end"
                      : "flex-start",

                  paddingLeft: props.currentMessage.user._id == me.id ? 0 : 50,
                }}
              >
                <SimpleHeightAdjustedVideo
                  videoURL={props.currentMessage.video}
                  fullWidth={SCREEN_WIDTH * 0.8}
                />
              </View>
            ) : (
              <Message {...props} />
            )
          }
          renderMessageAudio={(props) => <ChatAudio props={props} />}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: colors.black,
              }}
            />
          )}
          renderComposer={(props) => (
            <View
              style={{
                width: SCREEN_WIDTH - 80,
                paddingHorizontal: 12,
                backgroundColor: colors.black,
              }}
            >
              <Composer
                {...props}
                textInputStyle={{
                  fontFamily: Fonts.Regular,
                  color: "white",
                }}
              />
            </View>
          )}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            paddingHorizontal: 30,
          }}
        >
          <ActivityIndicator />
        </View>
      )}

      {imageLoading ? (
        <View
          style={{
            height: SCREEN_HEIGHT - 200,
            width: SCREEN_WIDTH,
            position: "absolute",
            top: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}
