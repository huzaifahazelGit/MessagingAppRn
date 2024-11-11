import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";
import { onlyUnique } from "../../../services/utils";

export const UserItem = ({ user, tags, AS_CHAT, location }) => {
  const navigation = useNavigation();
  const fetchedUser = useUserForId(user.id);

  const selectedTags = useMemo(() => {
    var items = user.musicianType || [];
    tags.forEach((tag) => {
      if (
        user &&
        (user.tags || [])
          .map((item) => `${item}`.toLowerCase().trim())
          .includes(tag.toLowerCase().trim())
      ) {
        items.push(tag);
      }
    });
    if (location) {
      items.push(user.location);
    }

    return items.filter(onlyUnique);
  }, [user, tags]);

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: { userId: user.id },
        });
      }}
      style={{ paddingHorizontal: 14 }}
    >
      <View
        style={{
          borderBottomColor: colors.transparentWhite7,
          backgroundColor: colors.black,
          borderBottomWidth: AS_CHAT ? 0 : 1,
          borderRadius: 4,
          marginVertical: 8,
          paddingHorizontal: 12,
          paddingBottom: AS_CHAT ? 10 : 20,
          paddingTop: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            // width: SCREEN_WIDTH - 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: -6,
              flex: 1,
            }}
          >
            <ProfileImage
              user={fetchedUser ? { ...fetchedUser, id: user.id } : user}
              size={30}
            />
            <View style={{ marginLeft: 12 }}>
              <BoldText>{user ? user.username : ""}</BoldText>
              {selectedTags.length > 0 ? (
                <View
                  style={{
                    opacity: 0.7,
                    marginTop: 3,

                    maxWidth: SCREEN_WIDTH - 80,
                  }}
                >
                  <BodyText>
                    {selectedTags
                      .map((item) => `${item}`.toLowerCase())
                      .join(", ")}
                  </BodyText>
                </View>
              ) : user.bio ? (
                <View
                  style={{
                    opacity: 0.7,
                    marginTop: 3,
                  }}
                >
                  <BodyText>{user.bio}</BodyText>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
