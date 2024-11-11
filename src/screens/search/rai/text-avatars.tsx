import { useEffect, useState } from "react";
import { View } from "react-native";
import { BoldMonoText } from "../../../components/text";

import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useMemo } from "react";
import {
  isMentionPartType,
  parseValue,
} from "react-native-controlled-mentions";
import { TouchableOpacity } from "react-native";
import FollowButton from "../../../components/buttons/follow-button";
import ProfileImage from "../../../components/images/profile-image";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";

export function TextAvatars({ text }: { text: string }) {
  const userIds = useMemo(() => {
    const { parts } = parseValue(text, [
      {
        trigger: "@",
      },
    ]);
    return parts
      .filter((part) => part.partType && isMentionPartType(part.partType))
      .map((part) => part.data?.id)
      .filter(onlyUnique);
  }, [text]);

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  if (userIds.length == 0) {
    return <View />;
  }

  return (
    <View style={{ marginTop: 12 }}>
      {userIds.map((userId) => (
        <SearchUserRow userId={userId} key={userId} />
      ))}
    </View>
  );
}

const SearchUserRow = ({ userId }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("loadUsers");
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const docRef = doc(getFirestore(), "users", userId);
    let userObj = await getDoc(docRef).then((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUser(userObj);
  };

  if (!user || !user.username) {
    return <View />;
  }
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 8,
        borderRadius: 40,
        width: SCREEN_WIDTH - 38,
        marginLeft: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 12,
          paddingHorizontal: 18,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",

            width: 230,
          }}
          onPress={() =>
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: userId },
            })
          }
        >
          <ProfileImage size={48} user={user} />
          <View style={{ marginLeft: 12 }}>
            <BoldMonoText
              style={{
                fontSize: 19,
                maxWidth: 230 - 48 - 12,
              }}
            >
              {user.username}
            </BoldMonoText>
            <BoldMonoText style={{ opacity: 0.6 }}>
              {user.location
                ? user.location
                : (user.musicianType || []).slice(0, 2).join(",")}
            </BoldMonoText>
          </View>
        </TouchableOpacity>
        <FollowButton
          user={user}
          userId={userId}
          color={colors.white}
          buttonStyle={{ backgroundColor: colors.purple }}
          checkMarkIfFollowing
        />
      </View>
    </View>
  );
};
