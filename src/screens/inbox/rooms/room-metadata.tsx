import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ScrollView } from "react-native";
import { BackButton } from "../../../components/buttons/buttons";
import { BoldMonoText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { IS_ANDROID } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import {
  useRoomAudioMessages,
  useRoomLinkMessages,
  useRoomOtherMessages,
} from "../../../hooks/useRooms";
import AudioMetadataList from "../../cloud/metadata-list.tsx/audio-metadata-list";
import ImageMetadataList from "../../cloud/metadata-list.tsx/image-metadata-list";
import LinkMetadataList from "../../cloud/metadata-list.tsx/link-metadata-list";

export default function RoomMetadataScreen() {
  const route = useRoute();
  const params = route.params as any;

  const me = useMe();
  const roomId = params.roomId;
  const kind = params.kind; // Files, Links, Audio

  const [room, setRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const audioPosts = useRoomAudioMessages(roomId);
  const filePosts = useRoomOtherMessages(roomId);
  const linkPosts = useRoomLinkMessages(roomId);

  useEffect(() => {
    if (params.room) {
      let collab = JSON.parse(params.room);
      setRoom(collab);
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      {room && (
        <View
          style={{
            marginHorizontal: 20,
            paddingBottom: 5,
            borderBottomColor: colors.transparentWhite8,
            borderBottomWidth: 1,
          }}
        >
          <BackButton style={{}} />
          <BoldText
            style={{
              marginLeft: 8,
              marginBottom: 4,
              fontSize: 12,
              marginTop: 6,
            }}
          >
            {`${room ? room.name : "Loading..."}`}
          </BoldText>
          <BoldMonoText style={{ marginLeft: 8, marginBottom: 4 }}>
            {kind}
          </BoldMonoText>
          <View />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {room && kind == "Files" && <ImageMetadataList filePosts={filePosts} />}

        {room && kind == "Audio" && (
          <AudioMetadataList audioPosts={audioPosts} />
        )}

        {room && kind == "Links" && <LinkMetadataList linkPosts={linkPosts} />}
      </ScrollView>
    </SafeAreaView>
  );
}
