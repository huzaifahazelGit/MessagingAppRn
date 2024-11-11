import React, { useMemo } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { BoldMonoText } from "../../../components/text";
import { DEFAULT_ID } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { useMyRooms } from "../../../hooks/useRooms";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { colors } from "../../../constants/colors";
import { Room } from "../../../models/room";
import RoomItem from "./room-item";

export default function RoomsList() {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const collabs = useMyRooms(userId);
  const navigation = useNavigation();
  const chatData = useMemo(() => {
    let chats = (collabs || []).filter((item) => !item.archived);
    chats.sort(function (a, b) {
      return b.lastupdate.seconds - a.lastupdate.seconds;
    });

    return chats;
  }, [collabs]);

  const createRoom = async () => {
    let unreadCounts = {};
    unreadCounts[me.id] = 0;
    let room: Room = {
      name: `${me.username}'s Room`,
      userIds: [me.id],
      initiatorId: me.id,
      initiatorName: me.username,
      createdate: new Date(),
      lastupdate: new Date(),
      archived: false,
      subheading: "New Room",
      lastSenderId: me.id,
      unreadCounts: unreadCounts,
    };
    let created = await addDoc(collection(getFirestore(), "rooms"), {
      ...room,
    });

    (navigation as any).navigate("RoomDetailScreen", {
      roomId: created.id,
      room: JSON.stringify({ ...room, id: created.id }),
    });
  };

  return (
    <FlatList
      data={chatData as any[]}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      numColumns={2}
      renderItem={({ item }) => <RoomItem room={item} />}
      ListFooterComponent={
        <TouchableOpacity
          style={{
            marginHorizontal: 18,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
          onPress={createRoom}
        >
          <AntDesign
            name="pluscircle"
            size={24}
            color={colors.blue}
            style={{ marginRight: 12 }}
          />
          <BoldMonoText>{"Start a new room"}</BoldMonoText>
        </TouchableOpacity>
      }
    />
  );
}
