import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, View } from "react-native";

import ScrollingSelector from "../../components/buttons/scrolling-selector";
import { useMe } from "../../hooks/useMe";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { EmptyUser } from "./components/empty-user";
import UserHeader from "./components/user-header";
import { ProfileContent, ProfileMarketplace } from "./profile-paginators";

import { LinearGradient } from "expo-linear-gradient";
import { AnimatedCard } from "./animated-card";
import ProfileMore from "./profile-more";
import { ProfileNav } from "./profile-navbar";

import { FadePanel } from "../../components/fade-panel";
import { SCREEN_HEIGHT } from "../../constants/utils";
import { useProfileColors } from "../../hooks/useProfileColors";
import { ProfileJukeboxNew } from "../jukebox/jukebox-new";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Playlist } from "../../models/playlist";

export default function Profile({
  user,
  userId,
  includeBack,
}: {
  user?: User;
  userId: string;
  includeBack: boolean;
}) {
  const navigation = useNavigation();
  const me = useMe();

  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("CONTENT");
  const [deletedPostIds, setDeletedPostIds] = useState([]);
  const [removedFromJukePostIds, setRemovedFromJukePostIds] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [transitionActive, setTransitionActive] = useState(false);
  const [showingMore, setShowingMore] = useState(false);

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  useEffect(() => {
    checkPlaylistsCreated();
  }, []);

  const checkPlaylistsCreated = async () => {
    if (user && user.isExecutive) {
      const q = query(
        collection(getFirestore(), "playlists"),
        where("ownerId", "==", userId)
      );
      let hasLists = 0;
      let playlists = await getDocs(q);
      playlists.forEach((doc) => {
        let pl = doc.data();
        if ((pl as Playlist).name == "New Drops") {
          hasLists++;
        }
        if ((pl as Playlist).name == "Top Releases") {
          hasLists++;
        }
      });
      if (hasLists < 2) {
        let basePL: Playlist = {
          defaultPlaylist: true,
          executiveDefault: true,
          ownerId: me.id,
          ownerName: me.username,

          name: "",
          timeCreated: new Date(),
          lastUpdated: new Date(),
          archived: false,
          ownerIsCompany: false,

          songCount: 0,
          likeCount: 0,
          likedAvatars: [],
          shareCount: 0,

          coverImage: null,
          tags: [],
          featured: false,
        };
        await setDoc(doc(getFirestore(), "playlists", `${user.id}-new-drops`), {
          ...basePL,
          name: "New Drops",
        });
        await setDoc(
          doc(getFirestore(), "playlists", `${user.id}-top-releases`),
          {
            ...basePL,
            name: "Top Releases",
          }
        );
      }
    }
  };

  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => (flipRotation = value));
  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };
  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  const flipToBack = () => {
    setTransitionActive(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setShowingMore(true);
          setTransitionActive(false);
        });
      });
    });
  };
  const flipToFront = () => {
    setTransitionActive(true);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() =>
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setShowingMore(false);
          setTransitionActive(false);
        })
      );
    });
  };

  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const onDelete = (post: Post) => {
    setDeletedPostIds([...deletedPostIds, post.id]);
  };

  const header = useMemo(() => {
    return (
      <View
        style={{
          marginTop: 6,
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <UserHeader user={user} userId={userId} />
        {/* <View style={{ marginTop: 5 }}>
          <ScrollingSelector
            options={["CONTENT", "JUKEBOX", "MY STORE"]}
            selected={selectedTab}
            setSelected={(tab) => {
              switch (tab) {
                case "CONTENT":
                  setSelectedTab("CONTENT");
                  break;
                case "JUKEBOX":
                  setSelectedTab("JUKEBOX");
                  break;
                case "MY STORE":
                  setSelectedTab("MY STORE");
                  break;
              }
            }}
            equalSpacing={true}
            textColor={textColor}
            buttonColor={buttonColor}
          />
        </View> */}
      </View>
    );
  }, [user, userId, buttonColor, textColor, selectedTab]);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 14,
          }}
        >
          {me && userId == me.id ? (
            <EmptyUser />
          ) : (
            <ActivityIndicator color={"white"} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <AnimatedCard
        flipToBackStyle={flipToBackStyle}
        flipToFrontStyle={flipToFrontStyle}
        user={user}
        userId={userId}
        showingMore={showingMore}
        transitionActive={transitionActive}
        animatedStyles={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      />

      {!headerVisible && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          <FadePanel visible={!headerVisible}>
            <LinearGradient
              colors={
                selectedTab == "JUKEBOX"
                  ? [backgroundColor, backgroundColor, buttonColor]
                  : ["rgba(0, 0, 0, 0.7)", "transparent"]
              }
              style={{
                height: selectedTab == "JUKEBOX" ? SCREEN_HEIGHT : 180,
              }}
            ></LinearGradient>
          </FadePanel>
        </View>
      )}

      {transitionActive ? (
        <View
          style={{
            flex: 1,
          }}
        ></View>
      ) : showingMore ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <ProfileMore user={{ ...user, id: userId }} userId={userId} />
        </View>
      ) : selectedTab == "CONTENT" ? (
        <View
          style={{
            flex: 1,
          }}  
        >
          <ProfileContent
            header={header}
            onDelete={onDelete}
            profileColors={profileColors}
            userId={userId}
            deletedPostIds={deletedPostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      ) : selectedTab == "JUKEBOX" ? (
        <View style={{ flex: 1 }} key="2">
          <ProfileJukeboxNew
            userId={userId}
            profileColors={profileColors}
            header={header}
            onDelete={onDelete}
            deletedPostIds={removedFromJukePostIds}
            setDeletedPostIds={setRemovedFromJukePostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }} key="3">
          <ProfileMarketplace
            userId={userId}
            header={header}
            onDelete={onDelete}
            profileColors={profileColors}
            deletedPostIds={deletedPostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      )}

      <ProfileNav
        showingMore={showingMore}
        includeBack={includeBack}
        flipToFront={flipToFront}
        flipToBack={flipToBack}
        user={user}
        userId={userId}
        setShowModal={setShowModal}
        headerVisible={headerVisible}
        flipRotation={flipRotation}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </View>
  );
}
