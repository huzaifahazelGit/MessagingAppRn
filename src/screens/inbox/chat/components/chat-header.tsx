import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { BackButton } from "../../../../components/buttons/buttons";
import ProfileImage from "../../../../components/images/profile-image";
import RAIUserIcon from "../../../../components/images/rai-user-icon";
import { Headline } from "../../../../components/text";
import { useMe } from "../../../../hooks/useMe";
import { Feather, FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import Share from "react-native-share";
import * as Linking from "expo-linking";
import { createChatLink } from "../../../../services/link-service";

export default function ChatHeader({
  showModal,
  setShowModal,
  collaboration,
  otherUser,
}) {
  const navigation = useNavigation();
  const me = useMe();

  const isDev = useMemo(() => {
    if (me && me.username == "Tara Wilson") {
      return true;
    }
    return false;
  }, [me?.id]);

  const sendChatLink = async () => {
    let link = createChatLink(collaboration.id, me.id);

    try {
      await Share.open({ url: link });
    } catch (error) {
      console.log("error", error);
    }
  };

  if (otherUser) {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 5,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <BackButton style={{ width: 38 }} />
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              if (otherUser.id != "RAI") {
                (navigation as any).navigate("ProfileStack", {
                  screen: "ProfileScreen",
                  params: { userId: otherUser.id },
                });
              }
            }}
          >
            {otherUser && otherUser.id == "RAI" ? (
              <RAIUserIcon size={35} />
            ) : (
              <ProfileImage
                user={{ ...otherUser, id: otherUser.id }}
                size={35}
              />
            )}
            <Headline style={{ marginLeft: 5 }}>
              {`${otherUser ? otherUser.username : "Loading..."}`.toUpperCase()}
            </Headline>
          </TouchableOpacity>
        </View>
        {isDev ? (
          <TouchableOpacity
            style={{ paddingVertical: 8 }}
            onPress={sendChatLink}
          >
            <Feather name="send" size={22} color="white" />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }

  return <View />;
}
