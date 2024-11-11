import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Popover from "react-native-popover-view";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { useUserForId } from "../../../hooks/useUsers";
import { Cosign } from "../../../models/cosign";
import { User } from "../../../models/user";
import { PostText } from "../../post-item/post-text";
import { CosignHeader } from "./cosign-header";
import {
  arrayRemove,
  deleteDoc,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useProfileColors } from "../../../hooks/useProfileColors";

export function CosignItem({
  cosign,
  toUser,
}: {
  cosign: Cosign;
  toUser: User;
}) {
  const fromUserId = cosign.fromUserIds[0];
  const fromUser = useUserForId(fromUserId);
  const navigation = useNavigation();
  const me = useMe();
  const [showPopover, setShowPopover] = useState(false);
  const profileColors = useProfileColors(toUser);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  if (!fromUser) {
    return <View></View>;
  }

  const onDelete = (cosign: Cosign) => {
    setShowPopover(false);
    Alert.alert(
      "Delete Cosign",
      "Are you sure you want to delete this endorsement?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const ref = doc(getFirestore(), "cosigns", cosign.id);
            deleteDoc(ref);

            const userRef = doc(getFirestore(), "users", cosign.toUserId);
            updateDoc(userRef, {
              cosignCount: increment(-1),
              cosignedBy: arrayRemove(me.id),
            });
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        borderBottomColor: `${textColor}33`,

        borderBottomWidth: 1,
        borderRadius: 4,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingBottom: 12,
        paddingTop: 12,
        marginHorizontal: 0,
      }}
    >
      <View style={{}}>
        <TouchableOpacity
          onPress={() => {
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: fromUserId },
            });
          }}
        >
          <CosignHeader
            user={fromUser}
            cosign={cosign}
            profileColors={profileColors}
            toUser={toUser}
          />
        </TouchableOpacity>
        <View style={{ marginTop: 18 }}>
          <PostText text={cosign.text} profile={true} user={toUser} />
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BodyText style={{ opacity: 0.6, color: textColor }}>
          {cosign.tags.join(", ")}
        </BodyText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {cosign.fromUserIds.includes(me.id) || cosign.toUserId == me.id ? (
            <Popover
              isVisible={showPopover}
              onRequestClose={() => setShowPopover(false)}
              popoverStyle={{ backgroundColor: backgroundColor }}
              from={
                <TouchableOpacity
                  onPress={() => setShowPopover(true)}
                  style={{ marginLeft: 4 }}
                >
                  <Feather
                    name="more-horizontal"
                    size={24}
                    color={buttonColor}
                    style={{ opacity: 0.5 }}
                  />
                </TouchableOpacity>
              }
            >
              <View style={{}}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    width: 140,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 12,
                  }}
                  onPress={() => {
                    onDelete(cosign);
                  }}
                >
                  <BodyText style={{ color: textColor }}>delete</BodyText>
                </TouchableOpacity>
              </View>
            </Popover>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
}
