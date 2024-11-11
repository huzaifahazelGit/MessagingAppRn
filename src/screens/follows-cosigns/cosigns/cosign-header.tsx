import moment from "moment";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { useMe } from "../../../hooks/useMe";
import { SCREEN_WIDTH } from "../../../constants/utils";
import BookmarkButton from "../../../components/buttons/bookmark-button";
import { User } from "../../../models/user";
import { Post } from "../../../models/post";
import { Cosign } from "../../../models/cosign";
import { ProfileColors } from "../../../hooks/useProfileColors";

export const CosignHeader = ({
  user,
  cosign,
  profileColors,
  toUser,
}: {
  user: User;
  toUser: User;
  cosign: Cosign;
  profileColors: ProfileColors;
}) => {
  const me = useMe();
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const timeago = useMemo(() => {
    if (cosign.createdate && cosign.createdate.seconds) {
      return moment(new Date(cosign.createdate.seconds * 1000)).fromNow();
    }
    return "";
  }, [cosign]);

  const fullWidth = SCREEN_WIDTH - 40;

  return (
    <View
      style={{
        flexDirection: "row",
        width: fullWidth,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: -6,
          width: fullWidth / 2,
        }}
      >
        <ProfileImage user={{ ...user, id: cosign.toUserId }} size={30} />
        <View style={{ marginLeft: 12 }}>
          <BodyText style={{ color: textColor }}>
            {`${toUser ? toUser.username : ""} is endorsed by `}
            <BoldText style={{ color: textColor }}>
              {user ? user.username : ""}
            </BoldText>
          </BodyText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          width: fullWidth / 2,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            opacity: 0.7,

            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <BodyText style={{ opacity: 0.7, color: textColor, marginRight: 5 }}>
            {timeago}
          </BodyText>
        </View>
      </View>
    </View>
  );
};
