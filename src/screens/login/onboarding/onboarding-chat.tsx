import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { QuickReplies } from "react-native-gifted-chat/lib/QuickReplies";
import { TypingAnimation } from "react-native-typing-animation";
import ProfileImage from "../../../components/images/profile-image";
import RAIUserIcon from "../../../components/images/rai-user-icon";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { MAPS_KEY } from "../../../constants/env";
import { Fonts } from "../../../constants/fonts";
import { DEFAULT_ID, IS_IOS, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { Collaboration } from "../../../models/collaboration";
import { uploadFileAsync } from "../../../services/upload-service";
import {
  AFTER_INTERESTS_TEXT,
  BOT_MESSAGES,
  DONE_QUICK_REPLY,
  INSTRUMENTS_QUICK_REPLY,
  INTERESTS_QUICK_REPLY,
  LAST_INTRO_MESSAGE,
  MUSICIAN_TYPE_QUICK_REPLY,
  RAI_USER,
} from "./onboarding-constants";
import { SuggestedFollowsModal } from "../../../components/modals/suggested-follows-modal";

export default function OnboardingChatScreen() {
  const navigation = useNavigation();
  const me = useMe();

  const [initialized, setInitialized] = useState(false);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [musicianType, setMusicianType] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [interests, setInterests] = useState([]);
  const [bio, setBio] = useState("");
  const [whyRealm, setWhyRealm] = useState("");
  const [links, setLinks] = useState({
    instagram: "",
    twitter: "",
    spotify: "",
    soundcloud: "",
    youtube: "",
    website: "",
  });
  const [photo, setPhoto] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [botIndex, setBotIndex] = useState(8);
  const [showSuggestedFollowers, setShowSuggestedFollowers] = useState(false);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    addLocation();
  }, []);

  const addLocation = async () => {
    Location.setGoogleApiKey(MAPS_KEY);

    let { status } = await Location.requestForegroundPermissionsAsync();

    let loc = await Location.getCurrentPositionAsync({});
    let result = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    if (result.length > 0) {
      let locItem = result[0];
      if (locItem.city) {
        if (locItem.country != "United States") {
          setLocation(`${locItem.city}, ${locItem.country}`);
        } else {
          setLocation(`${locItem.city}, ${locItem.region}`);
        }
      }
    }
  };

  const [savedMessages, setSavedMessages] = useState([
    {
      _id: 1,
      text: BOT_MESSAGES[0],
      user: RAI_USER,
      userId: "RAI",
      createdAt: new Date(),
    },
  ]);
  const [step, setStep] = useState<
    | "name"
    | "profession-type"
    | "profession"
    | "interests"
    | "instruments"
    | "realm-experience"
    | "links"
    | "photo"
    | "bio"
    | "location"
    | "done"
  >("name");

  const nextMessageIndex = useMemo(() => {
    if (savedMessages.length > 0) {
      return savedMessages[savedMessages.length - 1]._id + 1;
    }
  }, [savedMessages]);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);

      addInitialMessages();
    }
  }, [me.id, initialized]);

  const addInitialMessages = async () => {
    setIsTyping(true);

    let fullNewMessages = [];
    for (var i = 0; i < BOT_MESSAGES.indexOf(LAST_INTRO_MESSAGE) + 1; i++) {
      fullNewMessages.push({
        _id: i + 1,
        text: BOT_MESSAGES[i],
        user: RAI_USER,
        userId: "RAI",
        createdAt: new Date(),
      });
    }

    for (var i = 1; i < fullNewMessages.length; i++) {
      let messages = [...fullNewMessages].splice(0, i + 1);

      delayedAddInitialMessages(
        messages,
        i * 3000,
        i == fullNewMessages.length - 1
      );
    }
  };

  const delayedAddInitialMessages = async (messages, delay, isFinal) => {
    setTimeout(() => {
      setSavedMessages(messages);

      if (isFinal) {
        setIsTyping(false);
      }
    }, delay);
  };

  const addBotMessage = (id, text, currentMessages, quickReplies) => {
    setIsTyping(true);
    setTimeout(() => {
      setSavedMessages([
        ...currentMessages,
        {
          _id: id,
          text: text,
          user: RAI_USER,
          userId: "RAI",
          createdAt: new Date(),
          quickReplies: quickReplies,
        },
      ]);
      setIsTyping(false);
      setBotIndex(botIndex + 1);
    }, 2000);
  };

  const createUserMessage = (text) => {
    return {
      _id: nextMessageIndex,
      text: text,
      userId: me.id,
      createdAt: new Date(),
      user: {
        _id: me.id,
        avatar: photo ? photo : "initial",
        name: name,
      },
    };
  };

  const onSend = (messages) => {
    if (!isTyping) {
      let text = messages[0].text;
      if (`${text}`.trim().toLowerCase() == "later") {
        navigation.goBack();
      } else if (step == "links") {
        onAnswerLinks(text);
      } else if (step == "bio") {
        onAnswerBio(text);
      } else if (step == "name") {
        onAnswerName(text);
      } else if (step == "realm-experience") {
        onAnswerRealmExperience(text);
      } else if (step == "location") {
        onAnswerLocation(text);
      } else if (step == "photo") {
        onSkipImage(text);
      }
    }
  };

  const onAnswerName = async (text) => {
    setName(text);
    const userRef = doc(getFirestore(), "users", me.id);
    await updateDoc(userRef, {
      username: text,
    });
    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    addBotMessage(
      nextMessageIndex + 1,
      `Nice to meet you ${text}. What kind of work do you do?`,
      newMessages,
      MUSICIAN_TYPE_QUICK_REPLY
    );
    setSavedMessages(newMessages);
    setStep("profession-type");
  };

  const onAnswerMusicianType = (quickReplyValues: string[]) => {
    setMusicianType(quickReplyValues);
    setIsTyping(true);
    let newMessages = [
      ...savedMessages,
      createUserMessage(`${quickReplyValues.join(", ")}`.toLowerCase()),
    ];
    setSavedMessages(newMessages);
    if (quickReplyValues.includes("MANAGER") && quickReplyValues.length == 1) {
      addBotMessage(
        nextMessageIndex + 1,
        BOT_MESSAGES[botIndex + 1],
        newMessages,
        INTERESTS_QUICK_REPLY
      );
      setStep("interests");
      setTimeout(() => {
        setBotIndex(BOT_MESSAGES.indexOf(AFTER_INTERESTS_TEXT));
      }, 3000);
    } else {
      addBotMessage(
        nextMessageIndex + 1,
        BOT_MESSAGES[botIndex],
        newMessages,
        INSTRUMENTS_QUICK_REPLY
      );
      setStep("instruments");
    }
  };

  const onAnswerInstruments = (quickReplyValues: string[]) => {
    setInstruments(quickReplyValues.filter((item) => item != "NONE"));
    setIsTyping(true);
    let newMessages = [
      ...savedMessages,
      createUserMessage(`${quickReplyValues.join(", ")}`.toLowerCase()),
    ];
    setSavedMessages(newMessages);
    addBotMessage(
      nextMessageIndex + 1,
      BOT_MESSAGES[botIndex],
      newMessages,
      INTERESTS_QUICK_REPLY
    );
    setStep("interests");
  };

  const onAnswerInterests = (quickReplyValues: string[]) => {
    setInterests(quickReplyValues.filter((item) => item != "NONE"));
    setIsTyping(true);
    let newMessages = [
      ...savedMessages,
      createUserMessage(`${quickReplyValues.join(", ")}`.toLowerCase()),
    ];
    setSavedMessages(newMessages);
    addBotMessage(
      nextMessageIndex + 1,
      BOT_MESSAGES[botIndex],
      newMessages,
      null
    );
    setStep("realm-experience");
  };

  const onAnswerRealmExperience = (text) => {
    setWhyRealm(text);
    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    addBotMessage(
      nextMessageIndex + 1,
      BOT_MESSAGES[botIndex],
      newMessages,
      null
    );
    setSavedMessages(newMessages);
    setStep("links");
  };

  const onAnswerLinks = (text) => {
    let links = urlify(text);
    let isDone = (links || []).length == 0;
    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    setSavedMessages(newMessages);

    (links || []).forEach((link) => {
      let currentLinks = links;
      if (link.includes("spotify")) {
        currentLinks.spotify = link.toLowerCase();
      } else if (link.includes("soundcloud")) {
        currentLinks.soundcloud = link.toLowerCase();
      } else if (link.includes("youtube")) {
        currentLinks.youtube = link.toLowerCase();
      } else if (link.includes("instagram")) {
        currentLinks.instagram = link.toLowerCase();
      } else if (link.includes("twitter")) {
        currentLinks.twitter = link.toLowerCase();
      } else {
        currentLinks.website = link.toLowerCase();
      }
    });

    if (isDone) {
      addBotMessage(
        nextMessageIndex + 1,
        BOT_MESSAGES[botIndex],
        newMessages,
        null
      );
      setStep("photo");
    } else {
      setTimeout(() => {
        setSavedMessages([
          ...newMessages,
          {
            _id: nextMessageIndex + 1,
            text: "Great! Any other links you want to share?",
            user: RAI_USER,
            userId: "RAI",
            createdAt: new Date(),
          },
        ]);
      }, 1000);

      setIsTyping(false);
    }
  };

  const onAnswerBio = async (text) => {
    if (text.trim().toLowerCase() != "skip") {
      setBio(text);
    }
    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    setSavedMessages(newMessages);

    addBotMessage(
      nextMessageIndex + 1,
      location
        ? `Lastly, are you located in ${location}? If not, where are you located?`
        : `Lastly, where are you located?`,
      newMessages,
      null
    );

    setStep("location");
  };

  const onAnswerLocation = async (text) => {
    let locationText = location;
    if (text.trim().toLowerCase() != "yes") {
      locationText = text;
    }

    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    setSavedMessages(newMessages);

    finish(newMessages, locationText);
  };

  const finish = async (newMessages, locationText) => {
    const userRef = doc(getFirestore(), "users", me.id);

    await updateDoc(userRef, {
      bio: bio ? bio : me.bio ? me.bio : "",
      location: locationText ? locationText : me.location ? me.location : "",
      lastProfileUpdate: new Date(),
      lastActive: new Date(),

      instagram: links.instagram ? links.instagram : null,
      twitter: links.twitter ? links.twitter : null,
      website: links.website ? links.website : null,
      spotify: links.spotify ? links.spotify : null,
      youtube: links.youtube ? links.youtube : null,
      soundcloud: links.soundcloud ? links.soundcloud : null,

      profilePicture: photo,
      musicianType: musicianType,
      interests: interests,
      instruments: instruments,
      whyRealm: whyRealm,
      username: name,
    });

    let collab: Collaboration = {
      userIds: [me.id, "RAI"],
      initiatorId: "RAI",
      initiatorName: "RAI",
      accepted: true,
      completed: false,
      createdate: new Date(),
      lastupdate: new Date(),
      archived: false,
      subheading: "Welcome to Realm!",
      onProfileIds: [],
      marketplace: false,
      lastRecipientId: me.id,
      unreadCount: 0,
    };

    const collabRef = await addDoc(
      collection(getFirestore(), "collaborations"),
      collab
    );

    let collabMessages = newMessages.map((item) => ({
      ...item,
      collaborationId: collabRef.id,
      user:
        item.user._id == "RAI"
          ? item.user
          : {
              _id: me.id,
              name: name,
              avatar: photo,
            },

      archived: false,
      unread: false,
      recipientId: item.user._id == "RAI" ? me.id : "RAI",
    }));

    collabMessages.forEach(async (item) => {
      await addDoc(collection(getFirestore(), "collaborationMessages"), item);
    });

    addBotMessage(
      nextMessageIndex + 1,
      BOT_MESSAGES[botIndex],
      newMessages,
      DONE_QUICK_REPLY
    );

    setStep("done");
  };

  function urlify(text) {
    let kLINK_DETECTION_REGEX = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.match(kLINK_DETECTION_REGEX);
  }

  const onSkipImage = async (text) => {
    setIsTyping(true);
    let newMessages = [...savedMessages, createUserMessage(text)];
    setSavedMessages(newMessages);

    addBotMessage(
      nextMessageIndex + 1,
      BOT_MESSAGES[botIndex],
      newMessages,
      null
    );

    setStep("bio");
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
        let newUserMessage = {
          ...createUserMessage(null),
          image: result.assets[0].uri,
        };
        let newMessages = [...savedMessages, newUserMessage];
        setSavedMessages(newMessages);

        setIsTyping(true);
        const uploadUrl = await uploadFileAsync(
          getStorage(),
          result.assets[0].uri,
          "users"
        );

        setPhoto(uploadUrl);

        addBotMessage(
          nextMessageIndex + 1,
          BOT_MESSAGES[botIndex],
          newMessages,
          null
        );

        setStep("bio");
      }
    } catch (E) {
      Alert.alert("Error", "There was an error uploading your photo.");
    }
  };

  const giveXPAndFinish = async () => {
    // tara here check if they've already done this xp
    let newXp = {
      points: 1,
      kind: "completeOnboard",
      userId: me.id,
      timeCreated: new Date(),
    };
    await addDoc(collection(getFirestore(), "users", me.id, "xp"), newXp);
    setShowSuggestedFollowers(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={savedMessages}
        onSend={(messages) => onSend(messages)}
        user={{
          ...me,
          _id: me && me.id ? me.id : DEFAULT_ID,
          name: me && me.username ? me.username : "User",
          avatar: me && me.profilePicture ? me.profilePicture : "",
        }}
        onQuickReply={(replies) => {
          let quickReplyValues = replies.map((item) => item.value);

          if (step == "profession-type") {
            onAnswerMusicianType(quickReplyValues);
          } else if (step == "instruments") {
            onAnswerInstruments(quickReplyValues);
          } else if (step == "interests") {
            onAnswerInterests(quickReplyValues);
          } else if (step == "done") {
            giveXPAndFinish();
          }
        }}
        onPressActionButton={() => {
          if (step == "photo") {
            addImage();
          }
        }}
        disableComposer={isTyping}
        wrapInSafeArea={false}
        inverted={false}
        renderDay={(props) => <View />}
        showUserAvatar={true}
        renderFooter={() => (
          <View
            style={{
              marginLeft: 65,
              marginTop: 12,
              marginBottom: 20,
              width: 60,
              borderRadius: 6,
              height: 20,
            }}
          >
            {isTyping ? (
              <TypingAnimation
                isTyping={isTyping}
                dotColor={colors.white}
                dotMargin={6}
                dotRadius={3.5}
                dotX={12}
                dotY={6}
              />
            ) : (
              <View />
            )}
          </View>
        )}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: colors.transparent,
                },
                left: {
                  backgroundColor: colors.transparent,
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
          );
        }}
        renderMessageText={(props) => (
          <View style={{ padding: 6 }}>
            <BodyText
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              {props.currentMessage.text}
            </BodyText>
          </View>
        )}
        showAvatarForEveryMessage={true}
        listViewProps={{ showsVerticalScrollIndicator: false }}
        isTyping={isTyping}
        renderAvatar={(props) =>
          props.currentMessage.user._id == "RAI" ? (
            <RAIUserIcon size={30} />
          ) : props.currentMessage.user.avatar &&
            props.currentMessage.user.avatar != "initial" ? (
            <ProfileImage
              size={30}
              overrideURL={props.currentMessage.user.avatar}
              // @ts-ignore
              user={{ id: props.currentMessage.user._id }}
            />
          ) : (
            <View
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30 / 2,
                backgroundColor: colors.blue,
              }}
            >
              <BoldMonoText>
                {name && name.length > 0 ? name[0] : ""}
              </BoldMonoText>
            </View>
          )
        }
        renderQuickReplies={(props) => (
          <QuickReplies color={colors.purple} {...props} />
        )}
        renderQuickReplySend={() => (
          <View
            style={{
              borderBottomColor: "white",
              borderBottomWidth: 1,
            }}
          >
            <BoldMonoText
              style={{
                color: colors.white,

                fontSize: 18,
              }}
            >
              SEND
            </BoldMonoText>
          </View>
        )}
        optionTintColor={colors.purple}
        quickReplyStyle={{
          borderTopColor: colors.purple,
          borderLeftColor: colors.purple,
          borderRightColor: colors.purple,
          borderBottomColor: colors.purple,
        }}
        quickReplyTextStyle={{
          fontFamily: Fonts.MonoBold,
        }}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              height: 28,
              width: 28,
              borderRadius: 28 / 2,
              backgroundColor: colors.blue,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
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
                fontFamily: Fonts.Regular,
                color: "white",
              }}
            />
          </View>
        )}
      />
      <SuggestedFollowsModal
        showModal={showSuggestedFollowers}
        setShowModal={() => {
          setShowSuggestedFollowers(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
