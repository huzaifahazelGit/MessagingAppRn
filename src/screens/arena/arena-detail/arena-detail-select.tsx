import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getFirestore, orderBy, where } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { SubmissionBackgroundSquare } from "../../../components/audio/submission-background-square";
import { LightButton } from "../../../components/buttons/buttons";
import { Paginator } from "../../../components/lists/paginator";
import ProfileImage from "../../../components/images/profile-image";
import { BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { DEFAULT_ID, IS_ANDROID, SCREEN_WIDTH } from "../../../constants/utils";
import { useChallengeForId } from "../../../hooks/useChallenges";
import { useMe } from "../../../hooks/useMe";
import { Post } from "../../../models/post";
import { Submission } from "../../../models/submission";
import { ConfirmModal } from "../modals/confirm-submit-modal";
import { ThanksModal } from "../modals/thanks-modal";
import { onlyUnique } from "../../../services/utils";
import { useChallengeContext } from "../../../hooks/useChallengeContext";

export default function ArenaDetailSelect({}: {}) {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showingConfirm, setShowingConfirm] = useState(false);
  const [showingThanks, setShowingThanks] = useState(false);
  const navigation = useNavigation();
  const { currentChallenge } = useChallengeContext();

  const [results, setResults] = useState<Post[]>([]);

  const allowedKinds = useMemo(() => {
    let items = ["audio", "soundcloud", "spotify", "youtube"];
    if (currentChallenge && currentChallenge.allowsVideo) {
      items.push("video");
    }
    return items;
  }, [currentChallenge]);

  if (!currentChallenge) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      ></SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 30,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ProfileImage size={40} user={me} />
          <View style={{ paddingLeft: 30 }}>
            <BoldMonoText style={{ fontSize: 24 }}>
              Select your entry
            </BoldMonoText>
            <BoldMonoText style={{ marginTop: 4 }}>Make it good.</BoldMonoText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-close" size={20} color={"white"} />
        </TouchableOpacity>
      </View>
      <Paginator
        numColumns={2}
        baseCollection={collection(getFirestore(), "posts")}
        queryOptions={[
          where("userId", "==", userId),
          where("kind", "in", allowedKinds),
        ]}
        orderByOption={orderBy("createdate", "desc")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 15 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setResults}
        results={[...results].filter((item) => !item.reposted)}
        lastDataItem={{ kind: "add-new" }}
        itemsPerPage={8}
        listEmptyText={"No existing uploads."}
        renderListItem={function (item: any, visible: boolean) {
          if (item.kind == "add-new") {
            return <AddNewSquare challengeId={currentChallenge.id} />;
          } else {
            return (
              <SubmitSquare
                item={item}
                selectedSubmission={selectedSubmission}
                setSelectedSubmission={setSelectedSubmission}
                challengeId={currentChallenge.id}
                challenge={currentChallenge}
              />
            );
          }
        }}
        trackVisible={false}
        setLastFetch={() => {}}
      />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
        }}
      >
        <LightButton
          submit={() => {
            setShowingConfirm(true);
          }}
          title={"SUBMIT"}
          loading={false}
          disabled={selectedSubmission == null}
        />
      </View>

      <ConfirmModal
        showingConfirm={showingConfirm}
        setShowingConfirm={setShowingConfirm}
        selectedSubmission={selectedSubmission}
        challenge={currentChallenge}
        setShowingThanks={setShowingThanks}
        challengeId={currentChallenge.id}
      />

      <ThanksModal
        showingThanks={showingThanks}
        setShowingThanks={() => {
          setShowingThanks(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const AddNewSquare = ({ challengeId }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: (SCREEN_WIDTH - 30) / 2,
        height: (SCREEN_WIDTH - 30) / 2,
        marginLeft: 2,
        padding: 6,
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          borderColor: colors.transparentWhite4,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 8,
        }}
        onPress={() => {
          (navigation as any).navigate("ArenaDetailUploadSubmission", {
            challengeId: challengeId,
          });
        }}
      >
        <AntDesign name="pluscircleo" size={24} color="white" />
        <BoldMonoText style={{ marginTop: 7 }}>UPLOAD NEW</BoldMonoText>
      </TouchableOpacity>
    </View>
  );
};

const SubmitSquare = ({
  item,
  selectedSubmission,
  setSelectedSubmission,
  challenge,
  challengeId,
}) => {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;

  const thumbnailImage = useMemo(() => {
    if (!item) {
      return null;
    }
    let thumbnail = item.image ? item.image : null;
    return thumbnail;
  }, [item]);

  const selectItem = () => {
    var numberOptions = [...IMAGE_NUMBERS];
    if (challenge && challenge.usedImageNumbers) {
      numberOptions = numberOptions.filter(
        (item) => !challenge.usedImageNumbers.includes(item)
      );
    }
    if (numberOptions.length == 0) {
      numberOptions = [...IMAGE_NUMBERS];
    }
    var imageNumber =
      numberOptions[Math.floor(Math.random() * numberOptions.length)];

    let sub: Submission = {
      userId: userId,
      userImage: me && me.profilePicture ? me.profilePicture : null,
      username: me && me.username ? me.username : "",
      challengeId: challengeId,
      createdate: new Date(),
      lastupdate: new Date(),
      kind: item.kind,
      audio: item.audio ? item.audio : null,
      video: item.video ? item.video : null,
      soundcloudLink: item.soundcloudLink ? item.soundcloudLink : null,
      youtubeId: item.youtubeId ? item.youtubeId : null,
      spotifyId: item.spotifyId ? item.spotifyId : null,

      postId: item.id,

      isFinalist: false,
      isWinner: false,

      archived: false,
      votes: [],
      voterImages: [],
      image: thumbnailImage,
      uploadTitle: item.uploadTitle,
      imageNumber: thumbnailImage ? null : imageNumber,
    };

    setSelectedSubmission(sub);
  };

  if (!item) {
    return <View></View>;
  }

  let squareWidth = (SCREEN_WIDTH - 30) / 2;

  return (
    <View
      style={{
        width: squareWidth,
        height: squareWidth,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          selectItem();
        }}
      >
        <SubmissionBackgroundSquare
          submission={{ ...item, image: thumbnailImage }}
          skipFakeBackground={true}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={{
            width: squareWidth,
            height: squareWidth,
            marginTop: -1 * squareWidth,
            justifyContent: "flex-end",
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <BoldMonoText
              style={{
                paddingRight: 12,
                flexShrink: 1,
                fontSize: 12,
                opacity: 0.6,
              }}
            >
              {item.uploadTitle ?? item.kind ?? ""}
            </BoldMonoText>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 24 / 2,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
              }}
            >
              {selectedSubmission?.postId == item.id && (
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16 / 2,
                    backgroundColor: "white",
                  }}
                ></View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export const IMAGE_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];
