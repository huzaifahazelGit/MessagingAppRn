import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import ProfileImage from "../../../../components/images/profile-image";
import RAIUserIcon from "../../../../components/images/rai-user-icon";
import { BodyText, BoldText } from "../../../../components/text";
import { colors } from "../../../../constants/colors";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../../constants/utils";
import { useMe } from "../../../../hooks/useMe";
import { useUserForId } from "../../../../hooks/useUsers";
import { Collaboration } from "../../../../models/collaboration";

export default function ChatItem({
  collaboration,
}: {
  collaboration: Collaboration;
}) {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const navigation = useNavigation();

  const otherUserId = useMemo(() => {
    let ids = collaboration.userIds.filter((item) => item != userId);
    if (ids.length > 0) {
      return ids[0];
    }
    return DEFAULT_ID;
  }, [userId, collaboration]);

  const otherUser = useUserForId(otherUserId);

  const timeago = useMemo(() => {
    return moment(new Date(collaboration.lastupdate.seconds * 1000)).fromNow();
  }, [collaboration]);

  const subtext = useMemo(() => {
    if (collaboration.accepted || collaboration.archived) {
      return collaboration.subheading;
    }
    if (collaboration.initiatorId == me.id) {
      return `collaboration invite sent`;
    }
    return `wants to start a collaboration with you.`;
  }, [collaboration, me.id]);

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          borderBottomColor: colors.transparentWhite3,
          borderBottomWidth: 0.6,
          paddingVertical: 14,
          paddingHorizontal: 14,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => {
          console.log("collaboration.id", collaboration.id);
          (navigation as any).navigate("ChatDetailScreen", {
            collaborationId: collaboration.id,
            collaboration: JSON.stringify(collaboration),
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
          }}
        >
          {otherUserId == "RAI" ? (
            <RAIUserIcon size={40} />
          ) : (
            <ProfileImage user={{ ...otherUser, id: otherUserId }} size={40} />
          )}
          <View style={{ marginLeft: 12 }}>
            <View
              style={{
                flexDirection: "row",
                width: SCREEN_WIDTH - 110,

                justifyContent: "space-between",
              }}
            >
              <BoldText style={{ marginBottom: 4 }}>
                {otherUser ? `${otherUser.username}` : ""}
              </BoldText>
              {collaboration.lastRecipientId == me.id &&
              collaboration.unreadCount > 0 ? (
                collaboration.marketplace ? (
                  <View>
                    <Entypo name="shop" size={18} color={colors.blue} />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 12 / 2,
                      backgroundColor: colors.blue,
                    }}
                  ></View>
                )
              ) : (
                <View style={{ opacity: 0.6 }}>
                  <BodyText>{timeago}</BodyText>
                </View>
              )}
            </View>

            <View
              style={{
                maxWidth: SCREEN_WIDTH - 160,
              }}
            >
              <BodyText style={{ opacity: 0.7 }}>{subtext}</BodyText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
