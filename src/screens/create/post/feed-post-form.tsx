import { useNavigation } from "@react-navigation/native";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from "react-native";

import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText } from "../../../components/text";
import { IS_IOS, PREMIUM_IS_TURNED_ON } from "../../../constants/utils";
import { DataUploadSelectionPhase } from "../select-phase";
import {
  ALL_UPLOAD_KINDS,
  EMPTY_UPLOAD_SELECTION_OBJECT,
} from "../upload-constants";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useMe } from "../../../hooks/useMe";
import moment from "moment";

export default function FeedPostForm() {
  const navigation = useNavigation();
  const [didCheckPosts, setDidCheckPosts] = useState(false);
  const [dailyPostCount, setDailyPostCount] = useState(0);
  const [monthlyPostCount, setMonthlyPostCount] = useState(0);
  const [uploadData, setUploadData] = useState(EMPTY_UPLOAD_SELECTION_OBJECT);
  const me = useMe();

  const userIsPremium = useMemo(() => {
    // tara here premium
    if (!PREMIUM_IS_TURNED_ON) {
      return true;
    }
    return (
      me.accessLevel == "premium_monthly" || me.accessLevel == "premium_yearly"
    );
  }, [me.id, me.accessLevel, PREMIUM_IS_TURNED_ON]);

  useEffect(() => {
    if (userIsPremium) {
      setDidCheckPosts(true);
    } else {
      fetchTodayPosts();
    }
  }, []);

  const fetchTodayPosts = async () => {
    try {
      let startOfDay = moment().startOf("day").toDate();
      const q = query(
        collection(getFirestore(), "posts"),
        where("userId", "==", me.id),
        where("createdAt", ">=", startOfDay)
      );

      const snapshotOne = await getDocs(q);

      let posts = [];
      snapshotOne.forEach((doc) => {
        posts.push(doc.data());
      });

      posts = posts.filter((item) => !item.archived && !item.reposted);

      setDailyPostCount(posts.length);
      fetchThisMonthPosts();
    } catch (err) {
      setDailyPostCount(0);
      fetchThisMonthPosts();
    }
  };

  const fetchThisMonthPosts = async () => {
    try {
      let startOfDay = moment().subtract(30, "day").toDate();
      const q = query(
        collection(getFirestore(), "posts"),
        where("userId", "==", me.id),
        where("createdAt", ">=", startOfDay)
      );

      const snapshotOne = await getDocs(q);

      let posts = [];
      snapshotOne.forEach((doc) => {
        posts.push(doc.data());
      });

      posts = posts.filter((item) => !item.archived && !item.reposted);

      setMonthlyPostCount(posts.length);
      setDidCheckPosts(true);
    } catch (err) {
      setMonthlyPostCount(0);
      setDidCheckPosts(true);
    }
  };

  const onNext = async () => {
    if (didCheckPosts) {
      if (userIsPremium) {
        (navigation as any).navigate("FinishFeedPostForm", {
          uploadData: JSON.stringify(uploadData),
        });
      } else if (dailyPostCount >= 3) {
        Alert.alert(
          "Daily Post Limit",
          "You have reached your daily post limit. Upgrade to premium to post more.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Upgrade",
              onPress: () =>
                (navigation as any).navigate("PremiumUpgradeScreen", {
                  kind: "generic",
                }),
            },
          ],
          { cancelable: false }
        );
      } else if (monthlyPostCount >= 5) {
        Alert.alert(
          "Daily Post Limit",
          "You have reached your daily post limit. Upgrade to premium to post more.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Upgrade",
              onPress: () =>
                (navigation as any).navigate("PremiumUpgradeScreen", {
                  kind: "generic",
                }),
            },
          ],
          { cancelable: false }
        );
      } else {
        (navigation as any).navigate("FinishFeedPostForm", {
          uploadData: JSON.stringify(uploadData),
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={IS_IOS ? "padding" : "height"}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 14,
          alignItems: "center",
        }}
      >
        <View style={{ width: 70 }}>
          <BackButton
            customBack={() => {
              navigation.goBack();
            }}
          />
        </View>

        <BoldMonoText style={{}}>NEW POST</BoldMonoText>

        <View style={{ width: 70, opacity: didCheckPosts ? 1 : 0.5 }}>
          <TouchableOpacity
            style={{
              borderColor: "white",
              borderWidth: 1,
              paddingVertical: 4,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
              width: 70,
            }}
            onPress={onNext}
          >
            <BoldMonoText style={{ color: "white" }}>NEXT</BoldMonoText>
          </TouchableOpacity>
        </View>
      </View>

      <DataUploadSelectionPhase
        uploadKinds={ALL_UPLOAD_KINDS}
        uploadData={uploadData}
        setUploadData={setUploadData}
        onSkip={onNext}
      />
    </KeyboardAvoidingView>
  );
}
