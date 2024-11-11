import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Session } from "../../../models/session";

interface SeenPreviewListProps {
  session: Session;
  stopAnimation: () => void;
}

export const SeenPreviewList = ({
  stopAnimation,
  session,
}: SeenPreviewListProps) => {
  const navigation = useNavigation();

  const _onShowDetail = () => {
    stopAnimation();
    (navigation as any).navigate("StorySeenList", {
      session: JSON.stringify(session),
    });
  };

  return (
    <TouchableOpacity onPress={_onShowDetail}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
      >
        {(session.seenAvatars || []).map((usr, idx) => (
          <Image
            key={idx}
            style={{
              borderRadius: 30,
              height: 30,
              width: 30,
              borderColor: "#fff",
              borderWidth: 2,
              zIndex: idx,
              marginLeft: idx !== 0 ? -10 : 0,
            }}
            source={{
              uri: usr,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          color: "#fff",
          fontWeight: "500",
        }}
      >
        Seen by {session.seenCount}
      </Text>
    </TouchableOpacity>
  );
};
