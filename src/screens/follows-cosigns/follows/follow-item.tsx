import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldMonoText } from "../../../components/text";
import { ProfileColors } from "../../../hooks/useProfileColors";
import { Follow } from "../../../models/follow";

export function FollowItem({
  follow,
  showRecipient,
  profileColors,
}: {
  follow: Follow;
  showRecipient: boolean;
  profileColors: ProfileColors;
}) {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const navigation = useNavigation();

  const imageUrl = useMemo(() => {
    if (showRecipient) {
      if (follow.toUserImage) {
        return (follow.toUserImage as any).src
          ? (follow.toUserImage as any).src
          : follow.toUserImage;
      }
    } else {
      if (follow.fromUserImage) {
        return (follow.fromUserImage as any).src
          ? (follow.fromUserImage as any).src
          : follow.fromUserImage;
      }
    }
    return null;
  }, [follow, showRecipient]);

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("ProfileStack", {
          screen: "ProfileScreen",
          params: { userId: follow.fromUserId },
        });
      }}
      style={{
        flexDirection: "row",
        borderBottomColor: `${textColor}73`,
        borderBottomWidth: 0.5,
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <ProfileImage size={40} overrideURL={imageUrl} includeBlank={true} />
      <View>
        <BoldMonoText style={{ marginLeft: 20, color: textColor }}>
          {showRecipient ? follow.toUserName : follow.fromUserName}
        </BoldMonoText>
      </View>
    </TouchableOpacity>
  );
}
