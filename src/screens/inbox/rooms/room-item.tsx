import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FetchableAvatarList } from "../../../components/lists/avatar-list";
import { BoldText, SimpleMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { Room } from "../../../models/room";

export default function RoomItem({ room }: { room: Room }) {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);

  let width = SCREEN_WIDTH / 2 - 60;

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: (SCREEN_WIDTH - 20) / 2,
        }}
        onPress={() => {
          (navigation as any).navigate("RoomDetailScreen", {
            roomId: room.id,
            room: JSON.stringify(room),
          });
        }}
      >
        <View
          style={{
            width: width,
            height: width,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.transparentWhite1,
            borderRadius: width / 2,
          }}
        >
          <FetchableAvatarList
            userIds={room.userIds}
            users={members}
            setUsers={setMembers}
            cloudLayout={true}
          />
        </View>

        <SimpleMonoText style={{ marginTop: 4, textAlign: "center" }}>
          {room.name}
        </SimpleMonoText>
      </TouchableOpacity>
    </View>
  );
}
