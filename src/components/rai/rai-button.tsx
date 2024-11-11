import { useMe, useMySearchSessions } from "../../hooks/useMe";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import {
  DEFAULT_ID,
  PREMIUM_IS_TURNED_ON,
  SCREEN_WIDTH,
} from "../../constants/utils";
import {
  checkDidViewPopup,
  setDidViewPopup,
} from "../../services/async-storage-service";

const POPUPS = [
  {
    stack: "dashboard",
    id: "dashboard-1",
    text: `Your Dashboard: a snapshot of your journey on realm. View your progress and portal into other areas of Realm like the Arena. `,
    buttons: ["GOT IT"],
  },
  {
    stack: "arena",
    id: "arena-1",
    text: `The Arena is where you showcase your skill. Discover Daily challenges to sharpen your craft, weekly guest challenges, and exclusive monthly challenges available to the most active members on Realm. `,
    buttons: ["GOT IT"],
  },
  {
    stack: "feed",
    id: "feed-1",
    text: `The Feed is where you’ll find Realm's pulse. Check out fresh tracks and content from the Realm network. It's your daily dose of music and community vibes.`,
    buttons: ["BROWSE FEED", "ADD POST"],
  },
  {
    stack: "market",
    id: "market-1",
    text: `Welcome to the Market! Here's where Realm's talent trades everything music. Whether you're here to buy, sell, or just browse, it's all about finding the people who have what you’re looking for or are looking for what you have to offer. `,
    buttons: ["GOT IT"],
  },
  {
    stack: "search",
    id: "search-1",
    text: `Need to find something or someone on Realm and want to search with filters? Use this screen to search members, challenges, and listings in the market. You’ll also see a new selection of featured content and members each time you visit this screen.`,
    buttons: ["GOT IT"],
  },
];

export default function RAIButton({
  stack,
}: {
  stack:
    | "feed"
    | "arena"
    | "search"
    | "my-profile"
    | "other-profile"
    | "marketplace"
    | "dashboard";
}) {
  const [showPopupText, setShowPopupText] = useState(true);
  const me = useMe();
  const navigation = useNavigation();
  const [didNavigate, setDidNavigate] = useState(false);
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const [closedPopupIds, setClosedPopupIds] = useState([]);

  useEffect(() => {
    checkPopups();
  }, []);

  const checkPopups = async () => {
    POPUPS.forEach(async (popup) => {
      if (popup.stack == stack) {
        const didViewPopup = await checkDidViewPopup(popup.id);
        if (didViewPopup) {
          setClosedPopupIds((prev) => [...prev, popup.id]);
        }
      }
    });
    if (stack == "my-profile") {
      let profilePopups = [
        "profilePicture",
        "bio",
        "location",
        "socialLinks",
        "daw",
        "pro",
        "studioDetails",
        "publisher",
        "manager",
        "label",
      ];
      profilePopups.forEach(async (popup) => {
        const didViewPopup = await checkDidViewPopup(`my-profile-${popup}`);
        if (didViewPopup) {
          setClosedPopupIds((prev) => [...prev, `my-profile-${popup}`]);
        }
      });
    }
  };

  const nextProfileFill = useMemo(() => {
    if (!me) {
      return "";
    }

    if (
      !me.profilePicture &&
      !closedPopupIds.includes(`my-profile-${"profilePicture"}`)
    ) {
      return "profilePicture";
    }
    if (!me.bio && !closedPopupIds.includes(`my-profile-${"bio"}`)) {
      return "bio";
    }

    if (!me.location && !closedPopupIds.includes(`my-profile-${"location"}`)) {
      return "location";
    }

    let hasSocialLinks =
      me?.website ||
      me?.instagram ||
      me?.twitter ||
      me?.spotify ||
      me?.youtube ||
      me?.soundcloud;

    if (
      !hasSocialLinks &&
      !closedPopupIds.includes(`my-profile-${"socialLinks"}`)
    ) {
      return "socialLinks";
    }

    let isMusician =
      (me.musicianType || []).filter((type) => type != "MANAGER").length > 0;
    let usesDAW =
      (me.musicianType || []).includes("PRODUCER") ||
      (me.musicianType || []).includes("ENGINEER") ||
      (me.musicianType || []).includes("DJ");

    if (usesDAW && !me.daw && !closedPopupIds.includes(`my-profile-${"daw"}`)) {
      return "daw";
    }

    if (
      isMusician &&
      !me.pro &&
      !closedPopupIds.includes(`my-profile-${"pro"}`)
    ) {
      return "pro";
    }

    if (
      isMusician &&
      !me.studioDetails &&
      !closedPopupIds.includes(`my-profile-${"studioDetails"}`)
    ) {
      return "studioDetails";
    }

    if (
      isMusician &&
      !me.publisher &&
      !closedPopupIds.includes(`my-profile-${"publisher"}`)
    ) {
      return "publisher";
    }

    if (
      isMusician &&
      !me.manager &&
      !closedPopupIds.includes(`my-profile-${"manager"}`)
    ) {
      return "manager";
    }

    if (
      isMusician &&
      !me.label &&
      !closedPopupIds.includes(`my-profile-${"label"}`)
    ) {
      return "label";
    }

    return "";
  }, [me, closedPopupIds]);

  const cleanedNextProfileFill = useMemo(() => {
    if (nextProfileFill == "profilePicture") {
      return "Noticed you haven't added a profile picture.";
    }

    if (nextProfileFill == "bio") {
      return "Noticed you haven't filled out your bio.";
    }

    if (nextProfileFill == "location") {
      return "Noticed you haven't added your location.";
    }

    if (nextProfileFill == "socialLinks") {
    }

    if (nextProfileFill == "daw") {
      return "Noticed you haven't filled out your DAW.";
    }

    if (nextProfileFill == "pro") {
      return "Noticed you haven't added your Performing Rights Org.";
    }

    if (nextProfileFill == "studioDetails") {
      return "Noticed you haven't filled out your studio details.";
    }

    if (nextProfileFill == "publisher") {
      return "Noticed you haven't added your publisher.";
    }

    if (nextProfileFill == "manager") {
      return "Noticed you haven't added your manager.";
    }

    if (nextProfileFill == "label") {
      return "Noticed you haven't added your label.";
    }

    return "";
  }, [nextProfileFill]);

  const sessions = useMySearchSessions(userId);

  const currentPopup = useMemo(() => {
    let filtered = POPUPS.filter((popup) => {
      return popup.stack == stack && !closedPopupIds.includes(popup.id);
    });
    if (stack == "my-profile" && nextProfileFill) {
      let popupId = `my-profile-${nextProfileFill}`;
      if (!closedPopupIds.includes(popupId)) {
        return {
          stack: "my-profile",
          id: popupId,
          text: `Hey! ${cleanedNextProfileFill} Complete your profile to earn more XP!`,
          buttons: ["EDIT PROFILE"],
        };
      }
    }
    if (filtered.length > 0) {
      return filtered[0];
    }
  }, [stack, closedPopupIds]);

  const messageForScreen = useMemo(() => {
    if (currentPopup) {
      return currentPopup.text;
    }
  }, [currentPopup]);

  const userIsPremium = useMemo(() => {
    if (!PREMIUM_IS_TURNED_ON) {
      return true;
    }

    return (
      me.accessLevel == "premium_monthly" || me.accessLevel == "premium_yearly"
    );
  }, [me.id, me.accessLevel, PREMIUM_IS_TURNED_ON]);

  const navToLatestChat = () => {
    let shouldUseOld = stack == "search" || didNavigate;
    setDidNavigate(true);
    if (shouldUseOld && sessions && sessions.length > 0) {
      (navigation as any).navigate("RAIChatScreen", {
        sessionId: sessions[0].id,
      });
    } else {
      (navigation as any).navigate("RAIChatScreen", {
        sessionId: "new",
        numSessions: sessions ? (sessions || []).length : 0,
      });
    }
  };

  const openRAI = () => {
    // if (userIsPremium) {
    navToLatestChat();
    // } else {
    //   (navigation as any).navigate("PremiumUpgradeScreen", {
    //     kind: "generic",
    //   });
    // }
  };

  const onPressButton = (buttonText) => {
    switch (buttonText) {
      case "BROWSE FEED":
        setShowPopupText(false);
        break;

      case "BROWSE CHALLENGES":
        setShowPopupText(false);
        break;

      case "CUSTOMIZE PROFILE":
        setShowPopupText(false);
        (navigation as any).navigate("EditProfileScreen");

        break;

      case "EDIT PROFILE":
        setShowPopupText(false);
        (navigation as any).navigate("EditProfileScreen");

        break;

      case "BROWSE MARKET":
        setShowPopupText(false);
        break;

      case "GOT IT":
        setShowPopupText(false);
        break;

      case "ADD POST":
        (navigation as any).navigate("CreateScreen");
        break;

      case "CREATE A POST":
        (navigation as any).navigate("CreateScreen");
        break;

      default:
        return;
    }

    if (currentPopup) {
      setClosedPopupIds((prev) => [...prev, currentPopup.id]);
      setDidViewPopup(currentPopup.id);
    }
  };

  if (me && me.hideRAI && stack != "search") {
    return <View />;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        openRAI();
      }}
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
      {showPopupText && messageForScreen && (
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 20,
            marginBottom: 8,
            maxWidth: SCREEN_WIDTH - 60,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <BodyText
              style={{
                color: "black",
                maxWidth: SCREEN_WIDTH - 100,
                fontSize: 15,
              }}
            >
              {messageForScreen}
            </BodyText>
            {currentPopup &&
              !(currentPopup.buttons || []).includes("GOT IT") && (
                <View style={{ marginTop: -4, marginRight: -4 }}>
                  <TouchableOpacity
                    onPress={() => {
                      onPressButton("GOT IT");
                    }}
                  >
                    <Ionicons name="close" size={20} color={colors.black} />
                  </TouchableOpacity>
                </View>
              )}
          </View>
          {currentPopup && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              {currentPopup.buttons.map((buttonText, index) => (
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={() => {
                    onPressButton(buttonText);
                  }}
                  key={index}
                >
                  <BoldMonoText style={{ color: colors.blue }}>
                    {buttonText}
                  </BoldMonoText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
      <Image
        source={
          showPopupText
            ? require("../../../assets/rai-button-notify.png")
            : require("../../../assets/rai-button.png")
        }
        style={
          showPopupText
            ? { width: 60, height: 60, marginRight: 8 + 8, marginBottom: 14 }
            : {
                width: 75,
                height: 75,
                marginRight: 8,
              }
        }
        contentFit="contain"
      />
    </TouchableOpacity>
  );
}
