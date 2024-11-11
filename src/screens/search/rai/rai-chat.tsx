import { useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  SafeAreaView,
  View,
} from "react-native";
import Popover from "react-native-popover-view";
import { BodyText, BoldMonoText } from "../../../components/text";

import { AntDesign, Foundation } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import ProfileImage from "../../../components/images/profile-image";
import RAIUserIcon from "../../../components/images/rai-user-icon";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { DEFAULT_ID, IS_ANDROID, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe, useMySearches } from "../../../hooks/useMe";
import { SearchSession } from "../../../models/searchQuery";
import { XP_EXPLAINER_STRING } from "../../../models/xp";
import {
  createInfoStringFromUser,
  getTSHeaders,
  typesenseSearch,
  vectorSearch,
} from "../../../services/typesense-service";
import { shuffle } from "../../../services/utils";
import { PostText } from "../../post-item/post-text";
import RAINavBar from "./rai-nav-bar";
import { TextAvatars } from "./text-avatars";
import RAIChatListScreen from "./rai-list";

const ALL_EXAMPLES = [
  `Can you find me a producer who uses logic and can play guitar?`,
  `Can you find me producers without a manager?`,
  `What are 3 songs with the same chord progression as “My Love” by Justin Timberlake? `,
  `Can you help me learn how to mix with Atmos?`,
  `How can I use App Rocket to help me with my career?`,
  `Show me users on App Rocket who have won a challenge.`,
];

const SPECIALTY_PHRASES = [
  `how many users`,
  `how many realm users`,
  `who have won a challenge`,
];

export default function RAIChatScreen() {
  const me = useMe();
  const route = useRoute();
  const params = route.params as any;
  const numSessions = params.numSessions;
  const [sessionId, setSessionId] = useState(params.sessionId);
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const chatResults = useMySearches(userId, sessionId);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userSearchActive, setUserSearchActive] = useState(true);
  const [showExamplePopover, setShowExamplePopover] = useState(false);

  const navigation = useNavigation();

  const setNewSession = async (sessionId) => {
    setCurrentSearch(null);
    setRefreshing(true);
    setSessionId("TEMP");
    setTimeout(() => {
      setSessionId(sessionId);
    }, 1000);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const refresh = async () => {
    setRefreshing(true);
    let savedSessionId = sessionId;
    setSessionId("TEMP");
    setTimeout(() => {
      setSessionId(savedSessionId);
    }, 1000);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const initSession = async (searchQuery) => {
    let newSession: SearchSession = {
      timeCreated: new Date(),
      firstMessage: searchQuery,
    };
    let ref = await addDoc(
      collection(getFirestore(), "users", me.id, "searchSessions"),
      newSession
    );
    setSessionId(ref.id);

    if ((numSessions + 1) % 5 == 0) {
      let newXp = {
        points: 1,
        kind: "askRaiQuestion",
        userId: me.id,
        timeCreated: new Date(),
      };
      await addDoc(collection(getFirestore(), "users", me.id, "xp"), newXp);
    }
    return ref.id;
  };

  const send = async (searchQuery) => {
    let currentSessionId = sessionId;
    if (sessionId == "new") {
      currentSessionId = await initSession(searchQuery);
    }

    let shouldSkip = checkForSpecialtyPhrases(searchQuery, currentSessionId);
    if (!shouldSkip) {
      if (userSearchActive) {
        handleUserSearch(searchQuery, currentSessionId);
      } else {
        handleGeneralRAISearch(searchQuery, currentSessionId);
      }
    }
    Keyboard.dismiss();
  };

  const checkForSpecialtyPhrases = (searchQuery, currentSessionId) => {
    let shouldSkip = false;
    SPECIALTY_PHRASES.forEach((phrase) => {
      if (!shouldSkip && `${searchQuery}`.toLowerCase().includes(phrase)) {
        handleSpecialtyPhrase(searchQuery, phrase, currentSessionId);
        shouldSkip = true;
      }
    });
    return shouldSkip;
  };

  const handleSpecialtyPhrase = async (
    searchQuery,
    phrase,
    currentSessionId
  ) => {
    switch (phrase) {
      case `who have won a challenge`:
        let items = [];

        let q = query(
          collection(getFirestore(), "users"),
          where("winCount", ">", 0)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((child) => {
          items.push({ ...child.data(), id: child.id, userId: child.id });
        });

        let winnerSearch = {
          bios: JSON.stringify(items),
          message: searchQuery,
          timeCreated: new Date(),
          sessionId: currentSessionId,
          userSearch: true,
          additionalInfo: null,
          contextArr: [],
        };
        let winnerRef = await addDoc(
          collection(getFirestore(), "users", me.id, "search"),
          {
            ...winnerSearch,
            response: `The following users have won a challenge: ${items
              .map((item) => item.username)
              .join(", ")}`,
            bios: JSON.stringify(items),
            status: {
              completeTime: new Date(),
              error: null,
              startTime: new Date(),
              state: "COMPLETED",
              updateTime: new Date(),
            },
          }
        );

        setCurrentSearch({
          id: winnerRef.id,
          ...winnerSearch,
        });
        break;
      case "how many users":
      case "how many realm users":
        let newSearch = {
          bios: JSON.stringify([]),
          message: searchQuery,
          timeCreated: new Date(),
          sessionId: currentSessionId,
          userSearch: true,
          additionalInfo: null,
          contextArr: [],
        };
        let ref = await addDoc(
          collection(getFirestore(), "users", me.id, "search"),
          {
            ...newSearch,
            response: `I'm sorry, I cannot tell you how many users. Please try searching for a user instead.`,
            status: {
              completeTime: new Date(),
              error: null,
              startTime: new Date(),
              state: "COMPLETED",
              updateTime: new Date(),
            },
          }
        );

        setCurrentSearch({
          id: ref.id,
          ...newSearch,
        });

      default:
        break;
    }
  };

  const handleUserSearch = async (searchQuery, currentSessionId) => {
    setCurrentSearch({
      id: "-1",
      bios: JSON.stringify([]),
      message: searchQuery,
      timeCreated: new Date(),
      sessionId: currentSessionId,
    });

    let characterFilter =
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

    let tsqBios = await getTypesenseQuery(searchQuery);
    tsqBios = (tsqBios as any[]).map((item) => ({
      ...item,
      username: item.username.replaceAll(characterFilter, ""),
      bio: item.bio.replaceAll(characterFilter, ""),
    }));
    console.log(
      "tsqBios",
      (tsqBios as any[]).length,
      (tsqBios as any[]).map((item) => item.username)
    );
    let keyWordBios = await getKeyWordBios(searchQuery, tsqBios);
    keyWordBios = keyWordBios.map((item) => ({
      ...item,
      username: item.username.replaceAll(characterFilter, ""),
      bio: item.bio.replaceAll(characterFilter, ""),
    }));
    console.log(
      "keyWordBios",
      (keyWordBios as any[]).length,
      (keyWordBios as any[]).map((item) => item.username)
    );
    let vectorBios = await getVectorBios(searchQuery, keyWordBios);
    vectorBios = vectorBios.map((item) => ({
      ...item,
      username: item.username.replaceAll(characterFilter, ""),
      bio: item.bio.replaceAll(characterFilter, ""),
    }));

    console.log(
      "vectorBios",
      (vectorBios as any[]).length,
      (vectorBios as any[]).map((item) => item.username)
    );

    let bios = JSON.stringify([...vectorBios, ...keyWordBios]);

    if (
      searchQuery.toLowerCase().includes("which of those users") &&
      lastBios &&
      lastBios.length > 0
    ) {
      console.log("did use last bios");
      bios = JSON.stringify(lastBios);
    }

    let ref = await addDoc(
      collection(getFirestore(), "users", me.id, "search"),
      {
        bios: bios,
        message: searchQuery,
        timeCreated: new Date(),
        sessionId: currentSessionId,
        userSearch: true,
        // additionalInfo: null,
        // contextArr: [...(chatResults || [])]
        //   .map((item) => item.message)
        //   .slice(-3),
      }
    );
    setCurrentSearch({
      id: ref.id,
      bios: bios,
      message: searchQuery,
      timeCreated: new Date(),
      sessionId: currentSessionId,
    });
  };

  const getKeyWordBios = async (searchQuery, tagBios) => {
    let finalBios = [...tagBios];
    let keyWords: any = await getKeyWords(searchQuery);

    let skipArray = ["making", "music"];

    keyWords = [...keyWords].filter((item) => !skipArray.includes(item));
    console.log("keyWords", keyWords);
    if (keyWords && keyWords.length > 0) {
      console.log("before search");
      let userResults: any = await typesenseSearch(
        "users",
        keyWords.join(" "),
        [],
        null,
        null,
        null,
        true
      );
      console.log("after search");
      var count = 0;
      if (userResults && userResults.docs) {
        userResults.docs.forEach((doc) => {
          if (!finalBios.map((item) => item.userId).includes(doc.id)) {
            if (count < 10) {
              console.log("about to push");
              finalBios.push({
                bio: createInfoStringFromUser(doc),
                username: doc.username.trim(),
                userId: doc.id,
              });
              count++;
            }
          }
        });
      }
    }
    return finalBios;
  };

  const getKeyWords = async (searchQuery) => {
    let pr = new Promise((resolve, reject) => {
      var devGPTRequest = httpsCallable(getFunctions(), "devGPTRequest");
      devGPTRequest({
        prompt: `[no prose]
        [Output only JSON]
        Can you return the 3 key words in this phrase: "${searchQuery}" as an array of strings. Do not return any other text.`,
      })
        .then(async (result) => {
          if (result && result.data) {
            try {
              resolve(JSON.parse(`${(result.data as any).result.text}`));
            } catch (err) {
              resolve([]);
            }
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          console.log("error 9");
          console.log(error);
          resolve([]);
        });
    });
    return pr;
  };

  const getTypesenseQuery = async (searchQuery) => {
    console.log("start fetch");
    let pr = new Promise((resolve, reject) => {
      var devGPTRequest = httpsCallable(getFunctions(), "devGPTRequest");
      devGPTRequest({
        prompt: `[no prose]
[Output only a single URL]
This is my user model: 
export interface User {
  username: string;
  instruments: string[];
  publisher: string;
  manager: string;
  label: string;
  location: string;
  digitalAudioWorkstation: string;
  studioDetails: string;
  performingRightsOrg: string;
  bio: string;
  tags: string[];
  followerCount: number;
  followingCount: number;
  audioCount: number;
  winCount: number;
  postCount: number;
  points: number;
  xp: number;
  rank: number;
}
Here is an example typesense query URL: https://kuf2or3igehdsq6lp-1.a1.typesense.net:443/collections/users/documents/search?per_page=25&query_by=tags,bio,location&q=Los Angeles, CA, USA&filter_by=tags:[PRODUCER]

Can you give me a typesense query for the question: "${searchQuery}"? Respond with the URL only, do not return any other text.`,
      })
        .then(async (result) => {
          if (result && result.data) {
            try {
              console.log("res", (result.data as any).result.text);
              let url = `${(result.data as any).result.text}`;
              url = url.replaceAll("digitalAudioWorkstation", "daw");
              url = url.replaceAll("performingRightsOrg", "pro");

              return fetch(`${url}`, {
                method: "GET",
                headers: getTSHeaders(),
              })
                .then((response) => response.json())
                .then((json) => {
                  console.log("ts res");
                  if (json && json.hits) {
                    let docs = json.hits.map((item) => item.document);
                    let finalBios = [];
                    var count = 0;
                    docs.forEach((doc) => {
                      if (
                        !finalBios.map((item) => item.userId).includes(doc.id)
                      ) {
                        if (count < 5) {
                          finalBios.push({
                            bio: createInfoStringFromUser(doc),
                            username: doc.username.trim(),
                            userId: doc.id,
                          });
                          count++;
                        }
                      }
                    });

                    resolve(finalBios);
                  } else {
                    console.log("query err 4");
                    resolve([]);
                  }
                })
                .catch((err) => {
                  console.log("query err", err);
                  resolve([]);
                });
            } catch (err) {
              console.log("query err 2", err);
              resolve([]);
            }
          } else {
            console.log("query err 3");
            resolve([]);
          }
        })
        .catch((error) => {
          console.log("error 9");
          console.log(error);
          resolve([]);
        });
    });
    return pr;
  };

  const getVectorBios = async (searchQuery, keyWordBios) => {
    let keyWordBiosIds = keyWordBios.map((item) => item.userId);
    let queryVector = await getVectorForQuery(searchQuery);
    if (queryVector) {
      var vectorResults = await vectorSearch(queryVector as any);
      let userData = (vectorResults as any[]).map((item) => ({
        bio: item.infoString.trim(),
        username: item.username.trim(),
        userId: item.userId,
      }));
      return userData.filter((item) => !keyWordBiosIds.includes(item.userId));
    }
    return [];
  };

  const getVectorForQuery = async (searchQuery) => {
    let pr = new Promise((resolve, reject) => {
      var createVectorRequest = httpsCallable(getFunctions(), "createVector");
      createVectorRequest({ text: searchQuery })
        .then(async (result) => {
          if (result && result.data && (result.data as any).vector) {
            resolve((result.data as any).vector);
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.log("error 9");
          console.log(error);
          resolve(null);
        });
    });
    return pr;
  };

  const handleGeneralRAISearch = async (searchQuery, currentSessionId) => {
    let additionalInfo: string = null;
    if (`${searchQuery}`.toLowerCase().includes(" xp")) {
      additionalInfo = XP_EXPLAINER_STRING;
    }
    let ref = await addDoc(
      collection(getFirestore(), "users", me.id, "search"),
      {
        bios: JSON.stringify([]),

        message: searchQuery,
        timeCreated: new Date(),
        sessionId: currentSessionId,
        additionalInfo: additionalInfo,
        contextArr: [...(chatResults || [])]
          .map((item) => item.message)
          .slice(-3),
      }
    );
    setCurrentSearch({
      id: ref.id,
      bios: JSON.stringify([]),
      message: searchQuery,
      timeCreated: new Date(),
      sessionId: currentSessionId,
    });
  };

  const onSend = useCallback(
    async (messages = []) => {
      if (messages.length > 0) {
        let message = messages[0].text;
        if (message.length > 0) {
          send(message);
        }
      }
    },
    [me, userSearchActive]
  );

  const lastBios = useMemo(() => {
    let receivedItems = [];

    (chatResults || []).forEach((item) => {
      var translatedBios = [];
      if (item.bios) {
        try {
          translatedBios = JSON.parse(`${item.bios}`);
        } catch (err) {}
      }

      receivedItems.push({
        ...item,
        translatedBios: translatedBios,
        createdAt:
          item.status && item.status.updateTime
            ? new Date(item.status.updateTime.seconds * 1000)
            : item.timeCreated.seconds
            ? new Date(item.timeCreated.seconds * 1000)
            : item.timeCreated,
      });
    });

    if (receivedItems.length > 0) {
      receivedItems.sort(function (a, b) {
        return a.createdAt - b.createdAt;
      });

      let last = receivedItems[receivedItems.length - 1];
      return last.translatedBios;
    }

    return [];
  }, [chatResults, currentSearch, sessionId]);

  const filteredMessages = useMemo(() => {
    var newItems = [];
    if (
      currentSearch &&
      (chatResults || []).filter((item) => item.id == currentSearch?.id)
        .length == 0 &&
      (chatResults || []).filter(
        (item) => item.message == currentSearch?.message
      ).length == 0
    ) {
      newItems.push(currentSearch);
      console.log("push current search");
    }

    let sentItems = [...(chatResults || []), ...newItems].map((item) => ({
      ...item,
      _id: item.id,
      text: item.message,
      user: {
        _id: me.id,
        avatar: me.profilePicture,
        name: me.username,
      },
      userId: me.id,
      createdAt: item.timeCreated.seconds
        ? new Date(item.timeCreated.seconds * 1000)
        : item.timeCreated,
    }));

    let receivedItems = [];

    (chatResults || []).forEach((item) => {
      var responseText = item.response ? item.response : "Thinking...";
      if (responseText == "Thinking...") {
        console.log("should have thinking");
      }
      var translatedBios = [];

      if (item.bios) {
        try {
          translatedBios = JSON.parse(`${item.bios}`);
        } catch (err) {}
      }

      translatedBios.forEach((bio) => {
        responseText = responseText.replaceAll(
          bio.username,
          `@[${bio.username}](${bio.userId})`
        );
      });

      responseText = responseText.replaceAll("**", "");
      responseText = responseText.replaceAll("* ", "\n");
      receivedItems.push({
        ...item,
        _id: `rai-${item.id}`,
        text: responseText,
        user: {
          _id: "RAI",
          avatar: "RAI",
          name: "RAI",
        },
        userId: "RAI",
        createdAt:
          item.status && item.status.updateTime
            ? new Date(item.status.updateTime.seconds * 1000)
            : item.timeCreated.seconds
            ? new Date(item.timeCreated.seconds * 1000)
            : item.timeCreated,
      });
    });

    let items = [...sentItems, ...receivedItems];
    items.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });

    return items;
  }, [chatResults, currentSearch, sessionId]);

  const randomMessage = useMemo(() => {
    let messages = shuffle(ALL_EXAMPLES);
    return messages[0];
  }, []);

  const otherMessages = useMemo(() => {
    return ALL_EXAMPLES.filter((item) => item != randomMessage);
  }, [randomMessage]);

  return (
    <View style={{ flex: 1, paddingTop: IS_ANDROID ? 40 : 0 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <RAINavBar
          userSearchActive={userSearchActive}
          setUserSearchActive={setUserSearchActive}
          setNewSession={setNewSession}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />

        <GiftedChat
          messages={filteredMessages || []}
          onSend={(messages) => onSend(messages)}
          renderAvatar={() => <View></View>}
          wrapInSafeArea={false}
          inverted={false}
          renderDay={(props) => (
            <Day {...props} textStyle={{ fontFamily: Fonts.Bold }} />
          )}
          renderChatFooter={() => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 8,
                opacity: 0.5,
              }}
            >
              {refreshing ? (
                <ActivityIndicator animating />
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={refresh}
                >
                  <Foundation
                    name="refresh"
                    size={18}
                    style={{ marginRight: 4 }}
                    color="white"
                  />
                  <BoldMonoText>Refresh</BoldMonoText>
                </TouchableOpacity>
              )}
            </View>
          )}
          renderChatEmpty={() =>
            refreshing ? (
              <View />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 60,
                  transform: [{ scaleY: -1 }],
                }}
              >
                <BoldMonoText style={{}}>Example Message:</BoldMonoText>
                <BodyText
                  style={{
                    color: colors.blue,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {`"${randomMessage}"`}
                </BodyText>
                <Popover
                  isVisible={showExamplePopover}
                  onRequestClose={() => setShowExamplePopover(false)}
                  popoverStyle={{ backgroundColor: "white" }}
                  from={
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{ opacity: 0.7, marginTop: 4 }}
                        onPress={() => setShowExamplePopover(true)}
                      >
                        <BodyText
                          style={{
                            color: colors.blue,
                            textDecorationLine: "underline",
                            textDecorationColor: colors.blue,
                          }}
                        >
                          {"more examples"}
                        </BodyText>
                      </TouchableOpacity>
                    </View>
                  }
                >
                  <View
                    style={{
                      width: SCREEN_WIDTH * 0.8,
                      paddingHorizontal: 12,
                      paddingTop: 12,
                      paddingBottom: 8,
                    }}
                  >
                    {otherMessages.map((msg) => (
                      <View style={{ marginBottom: 4 }} key={msg}>
                        <BodyText
                          style={{ color: "black" }}
                        >{`"${msg}"`}</BodyText>
                      </View>
                    ))}
                  </View>
                </Popover>
              </View>
            )
          }
          renderBubble={(props) => {
            return (
              <View style={{ marginBottom: 18, width: "100%" }}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View style={{ marginRight: 8 }}>
                    {props.currentMessage.user._id == "RAI" ? (
                      <RAIUserIcon size={35} />
                    ) : (
                      <ProfileImage
                        size={35}
                        overrideURL={props.currentMessage.user.avatar}
                        // @ts-ignore
                        user={{ id: props.currentMessage.user._id }}
                      />
                    )}
                  </View>

                  <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor: colors.transparent,
                        width: "100%",
                      },
                      left: {
                        backgroundColor: colors.transparent,
                        width: "95%",
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
                    renderTime={(timeprops) => <View></View>}
                  />
                </View>

                <TextAvatars text={props.currentMessage.text} />
              </View>
            );
          }}
          renderMessageText={(props) => (
            <View style={{ padding: 6 }}>
              <PostText
                text={props.currentMessage.text}
                textColorOverride={"white"}
                fontsize={16}
                skipReadMore={true}
              />
            </View>
          )}
          listViewProps={{ showsVerticalScrollIndicator: false }}
          messagesContainerStyle={{ paddingBottom: 30 }}
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
                // marginBottom: 8,
              }}
              alwaysShowSend={true}
            >
              <AntDesign name="arrowup" size={24} color="white" />
            </Send>
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: colors.black,
                paddingTop: 12,
              }}
            />
          )}
          renderComposer={(props) => (
            <View
              style={{
                width: SCREEN_WIDTH - 40,
                paddingHorizontal: 12,
                backgroundColor: colors.black,
                minHeight: 40,
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
      </SafeAreaView>

      <Modal visible={showHistory} animationType="slide">
        <View style={{ flex: 1 }}>
          <RAIChatListScreen
            setNewSession={setNewSession}
            closeScreen={() => setShowHistory(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
