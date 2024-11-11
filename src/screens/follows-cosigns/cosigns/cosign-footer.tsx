import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Popover from "react-native-popover-view";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { Cosign } from "../../../models/cosign";
import LikeButton, {
  LikeStatus,
} from "../../../components/buttons/like-button";
import { BodyText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { User } from "../../../models/user";
import { useProfileColors } from "../../../hooks/useProfileColors";

export function CosignFooter({
  cosign,
  user,
  onDelete,
}: {
  cosign: Cosign;
  user?: User;
  onDelete: any;
}) {
  const me = useMe();
  const [showPopover, setShowPopover] = useState(false);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({
    like: null,
    loaded: false,
    overrideNumLikes: 0,
  });

  const profileColors = useProfileColors(user, colors.blue);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  return (
    <View
      style={{
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <LikeButton
        cosign={cosign}
        profileColors={profileColors}
        likeStatus={likeStatus}
        setLikeStatus={setLikeStatus}
      />

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
                          await deleteDoc(
                            doc(getFirestore(), "cosigns", cosign.id)
                          );

                          onDelete(cosign);
                        },
                      },
                    ]
                  );
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
  );
}
