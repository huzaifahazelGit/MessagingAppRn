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
import { LightText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import {
  DEFAULT_ID,
  IS_ANDROID,
  IS_IOS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";
import { useCollabMessages } from "../../../hooks/useCollaborations";
import { useUserForId } from "../../../hooks/useUsers";
import { CollabMessage, Collaboration } from "../../../models/collaboration";
import { User } from "../../../models/user";
import { uploadFileAsync } from "../../../services/upload-service";
import { PostItem } from "../../post-item/post-item";
import ChatAudio from "./components/chat-audio";
import ChatHeader from "./components/chat-header";
import PendingCollab from "./components/pending-collab";

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
import RAIUserIcon from "../../../components/images/rai-user-icon";
import { useMe } from "../../../hooks/useMe";

export default function ChatDetailScreen() {
  const route = useRoute();
  const params = route.params as any;

  // for testing
  // const collabId = "GNgWQUbTePiG3weYvptJ";
  // const userId = "mNrDq7oLOJcn0DkYTiO6HXhxn143";
  // const me = useUserForId(userId);

  const me = useMe();
  const collabId = params.collaborationId;
  const userId = me && me.id ? me.id : DEFAULT_ID;

  const [collaboration, setCollaboration] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newMessages, setNewMessages] = useState([]);
  const [marketplaceItem, setMarketplaceItem] = useState(null);
  const [didSendMarketplace, setDidSendMarketplace] = useState(false);

  const finalCollabId = useMemo(() => {
    if (collabId == "new") {
      if (collaboration && collaboration.id) {
        return collaboration.id;
      }
    }
    return collabId;
  }, [collabId, collaboration]);

  const collabMessages = useCollabMessages(finalCollabId);

  const otherUserId = useMemo(() => {
    if (collaboration) {
      let ids = collaboration.userIds.filter((item) => item != userId);
      if (ids.length > 0) {
        return ids[0];
      }
    }

    return DEFAULT_ID;
  }, [userId, collaboration]);

  const otherUser = useUserForId(otherUserId);

  const collabIsWithAdmin = useMemo(() => {
    if (otherUser && otherUser.isAdmin) {
      return true;
    }
    return false;
  }, [otherUser]);

  useEffect(() => {
    if (params.collaboration) {
      let collab = JSON.parse(params.collaboration);
      setCollaboration(collab);
      updateReadCounts(collab);
      if (params.marketplaceItem) {
        setMarketplaceItem(JSON.parse(params.marketplaceItem));
      }
    } else {
      fetchCollab();
    }
  }, []);

  const fetchCollab = async () => {
    if (collabId != "new") {
      let snapshot = await getDoc(
        doc(getFirestore(), "collaborations", collabId)
      );
      let collab = { ...snapshot.data(), id: collabId };
      setCollaboration(collab);
      updateReadCounts(collab as any);
    }
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (messages.length > 0) {
        if (finalCollabId == "new") {
          if (collabIsWithAdmin) {
            initAdminCollaboration(messages);
          } else {
            initCollaboration(messages[0].text);
          }
        } else {
          messages.forEach((message) => {
            createMessage(message.text, finalCollabId);
          });
        }
      }
    },
    [finalCollabId, collaboration, userId, otherUser, collabIsWithAdmin]
  );

  const initCollaboration = async (text: string) => {
    let created = await addDoc(collection(getFirestore(), "collaborations"), {
      ...collaboration,
      subheading: text,
      createdate: new Date(),
      lastupdate: new Date(),
    });

    setCollaboration({
      ...collaboration,
      id: created.id,
    });
    sendPushNotification(
      otherUser,
      `${me.username} invited you to collaborate`
    );
    createMessage(text, created.id, null);
  };

  const initAdminCollaboration = async (messages) => {
    let created = await addDoc(collection(getFirestore(), "collaborations"), {
      ...collaboration,
      subheading: messages[0].text,
      accepted: true,
      createdate: new Date(),
      lastupdate: new Date(),
    });
    setCollaboration({
      ...collaboration,
      accepted: true,
      id: created.id,
    });

    messages.forEach((message) => {
      createMessage(message.text, created.id);
    });
  };

  const createMessage = async (
    text: string,
    collabId: string,
    image?: string,
    audio?: string,
    audioTitle?: string
  ) => {
    if (collabId != "new") {
      if (marketplaceItem && !didSendMarketplace) {
        let newMessage: CollabMessage = {
          collaborationId: collabId,
          userId: userId,
          user: {
            _id: userId,
            name: me.username,
            avatar: me.profilePicture ? me.profilePicture : null,
          },
          text: "",
          createdAt: new Date(),
          archived: false,
          image: image ? image : null,
          audio: audio ? audio : null,
          audioTitle: audioTitle ? audioTitle : null,
          marketplaceItem: marketplaceItem,
          recipientId: otherUserId,
          unread: true,
        };
        setDidSendMarketplace(true);
        let res = await addDoc(
          collection(getFirestore(), "collaborationMessages"),
          newMessage
        );

        setNewMessages([...newMessages, { ...newMessage, id: res.id }]);
      }
      let newMessage: CollabMessage = {
        collaborationId: collabId,
        userId: userId,
        user: {
          _id: userId,
          name: me.username,
          avatar: me.profilePicture ? me.profilePicture : null,
        },
        text: text,
        createdAt: new Date(),
        archived: false,
        image: image ? image : null,
        audio: audio ? audio : null,
        audioTitle: audioTitle ? audioTitle : null,
        recipientId: otherUserId,
        unread: true,
      };
      let res = await addDoc(
        collection(getFirestore(), "collaborationMessages"),
        newMessage
      );
      if (otherUserId == "RAI") {
        setTimeout(async () => {
          let raiMessage: CollabMessage = {
            collaborationId: collabId,
            userId: "RAI",
            user: {
              _id: "RAI",
              name: "RAI",
              avatar: "RAI",
            },
            text: "Thanks for using RAI to set up your profile! I'll let you know if I have any new profile setup questions for you. To chat with me about other topics, please find me in the Search tab.",
            createdAt: new Date(),
            archived: false,
            image: null,
            audio: null,
            recipientId: userId,
            unread: false,
          };
          let raiRes = await addDoc(
            collection(getFirestore(), "collaborationMessages"),
            raiMessage
          );

          setNewMessages([
            ...newMessages,
            { ...newMessage, id: res.id },
            { ...raiMessage, id: raiRes.id },
          ]);
        }, 1000);
      } else {
        setNewMessages([...newMessages, { ...newMessage, id: res.id }]);
        updateLatestChat(
          text
            ? text
            : image
            ? `Sent an image`
            : audio
            ? `Sent an audio file`
            : ""
        );
      }
    }
  };

  const updateReadCounts = async (collab: Collaboration) => {
    if (collabId != "new" && collab.id != "new") {
      if (collab.lastRecipientId == userId) {
        let unreadCount = collab.unreadCount;
        if (unreadCount > 0) {
          const userRef = doc(getFirestore(), "users", userId);
          if (me.unreadChatCount > unreadCount - 1) {
            await updateDoc(userRef, {
              unreadChatCount: increment(-unreadCount),
            });
          } else {
            updateDoc(userRef, {
              unreadChatCount: 0,
              lastActive: new Date(),
            });
          }

          await updateDoc(doc(getFirestore(), "collaborations", collabId), {
            unreadCount: 0,
          });
        }
      }
    }
  };

  const updateLatestChat = async (text: string) => {
    console.log("==marketplaceItem==",marketplaceItem);
    console.log("==collaboration.marketplace==",collaboration.marketplace);
    console.log("==collaboration==",collaboration);
    console.log("==collaborationAceepted==",collaboration.accepted);

    if (
      finalCollabId != "new" &&
      collaboration &&
      collaboration.accepted &&
      text
    ) {
      let updates: any = {
        lastupdate: new Date(),
        subheading: text,
        unreadCount: increment(1),
        lastRecipientId: otherUserId,
      };
      if (marketplaceItem && !collaboration.marketplace) {
        console.log("===updateMarket===");
        
        updates = {
          ...updates,
          marketplace: true,
          marketplaceId: marketplaceItem.id,
        };
      }

      const ref = doc(getFirestore(), "collaborations", finalCollabId);
      await updateDoc(ref, {
        ...updates,
      });

      const userRef = doc(getFirestore(), "users", otherUserId);
      await updateDoc(userRef, {
        unreadChatCount: increment(1),
      });

      sendPushNotification(otherUser, text);
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
          collabId: finalCollabId,
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
        createMessage("", finalCollabId, null, uri, doc.name);
        setImageLoading(false);
      }
    } catch (e) {
      console.log("error 2");
      console.log(e);
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
        createMessage("", finalCollabId, uploadUrl);
      }
    } catch (E) {
      setImageLoading(false);
    }
  };

  const filteredMessages = useMemo(() => {
    var newItems = newMessages.filter(
      (msg) => !(collabMessages || []).map((item) => item.id).includes(msg.id)
    );

    let items = [...(collabMessages || []), ...newItems]
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
  }, [collabMessages, newMessages]);

  const collabNotStarted = useMemo(() => {
    return (
      collaboration &&
      me &&
      collaboration.initiatorId == userId &&
      finalCollabId == "new"
    );
  }, [collaboration, userId, finalCollabId]);

  const collabAccepted = useMemo(() => {
    return (
      collaboration &&
      me &&
      (collaboration.accepted ||
        (collaboration.initiatorId == userId && finalCollabId == "new"))
    );
  }, [collaboration, userId, finalCollabId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <ChatHeader
        showModal={showModal}
        setShowModal={setShowModal}
        collaboration={collaboration}
        otherUser={otherUser}
      />

      {collabNotStarted && !collabIsWithAdmin ? (
        <View style={{ paddingHorizontal: 20, opacity: 0.8, marginTop: 12 }}>
          <LightText>{`Send a message to invite ${
            otherUser ? otherUser.username : ""
          } to collaborate`}</LightText>
        </View>
      ) : (
        <View />
      )}
      {collabAccepted ? (
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
                  options: ["Cancel", "Add Image", "Upload Audio"],
                  cancelButtonIndex: 0,
                  userInterfaceStyle: "dark",
                },
                (buttonIndex) => {
                  if (buttonIndex === 0) {
                    // cancel action
                  } else if (buttonIndex === 1) {
                    addImage();
                  } else if (buttonIndex === 2) {
                    addAudio();
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
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.darkPurple,
                  },
                }}
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
          renderActions={(props) => (
            <Actions
              {...props}
              containerStyle={{
                marginBottom: 30,
              }}
            />
          )}
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
                marginBottom: 20,
              }}
              alwaysShowSend={true}
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
                  marginTop: 12,
                  marginBottom: 20,

                  fontFamily: Fonts.Regular,
                  color: "white",
                }}
              />
            </View>
          )}
        />
      ) : collaboration ? (
        <PendingCollab
          otherUser={otherUser}
          collaboration={{ ...collaboration, id: collabId }}
          setCollaboration={setCollaboration}
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
