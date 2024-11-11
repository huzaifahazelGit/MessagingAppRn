import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Share from "react-native-share";
import { BackButton } from "../../components/buttons/buttons";
import CollaborateButton from "../../components/buttons/collaborate-button";
import FollowButton from "../../components/buttons/follow-button";
import ScrollingSelector from "../../components/buttons/scrolling-selector";
import { Spacer } from "../../components/navbar";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { createProfileLink } from "../../services/link-service";
import { ProfileMenu } from "./profile-menu";
import { FadePanel } from "../../components/fade-panel";

export const ProfileNav = ({
  showingMore,
  includeBack,
  flipToFront,
  flipToBack,
  user,
  userId,
  setShowModal,
  headerVisible,
  flipRotation,
  selectedTab,
  setSelectedTab,
}) => {
  const insets = useSafeAreaInsets();
  const me = useMe();
  const { clearCurrentAudio } = useTrackPlayerContext();
  const navigation = useNavigation();

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  const isMe = useMemo(() => {
    return user && me && userId && userId == me.id;
  }, [me.id, user]);

  const buttonColor = useMemo(() => {
    return user && user.buttonColor ? user.buttonColor : colors.blue;
  }, [user]);

  const textColor = useMemo(() => {
    return user && user.textColor ? user.textColor : colors.white;
  }, [user]);

  const toggleFeatured = async () => {
    const userRef = doc(getFirestore(), "users", userId);

    if (user && user.featured) {
      await updateDoc(userRef, {
        featured: false,
      });
    } else {
      await updateDoc(userRef, {
        featured: true,
      });
    }
  };

  const onShare = async () => {
    let link = createProfileLink(userId, me.id);

    try {
      await Share.open({ url: link });
    } catch (error) {
      console.log("error 8");
      console.log(error);
    }
  };

  const goBackAndStopAudio = () => {
    clearCurrentAudio();
    navigation.goBack();
  };

  return (
    <View style={{ position: "absolute", top: insets.top, left: 0, right: 0 }}>
      {headerVisible ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ paddingLeft: 20 }}>
            {showingMore || includeBack ? (
              <BackButton
                customBack={goBackAndStopAudio}
                buttonColor={"white"}
              />
            ) : (
              <Spacer />
            )}
          </View>
          {showingMore ? (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ paddingBottom: 8, marginRight: 14 }}
                onPress={() => {
                  flipToFront();
                }}
              >
                <Feather name="refresh-ccw" size={22} color="white" />
              </TouchableOpacity>
              {isAdmin ? (
                <TouchableOpacity
                  style={{ paddingBottom: 8, marginRight: 14 }}
                  onPress={toggleFeatured}
                >
                  <FontAwesome
                    name={user && user.featured ? "star" : "star-o"}
                    size={24}
                    color={"white"}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {isMe ? (
                <ProfileMenu />
              ) : (
                <TouchableOpacity
                  style={{ paddingBottom: 8, paddingRight: 20 }}
                  onPress={onShare}
                >
                  <Feather name="share" size={22} color={"white"} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
          
            <>
            </>
          )}
        </View>
      ) : (
        <FadePanel visible={true}>
          <View>
            {!isMe && (
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <FollowButton
                  user={user}
                  color={textColor}
                  userId={userId}
                  wide={true}
                />
                <View style={{ width: 8 }} />
                <CollaborateButton
                  wide={true}
                  userId={userId}
                  color={textColor}
                  marketplaceItem={null}
                />
              </View>
            )}
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
          </View>
        </FadePanel>
      )}
    </View>
  );
};
