import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native";
import Popover from "react-native-popover-view";
import { BackButton } from "../../../components/buttons/buttons";
import { FetchableAvatarList } from "../../../components/lists/avatar-list";
import { EditRoomModal } from "../../../components/modals/edit-room-modal";
import {
  BodyText,
  BoldMonoText,
  SimpleMonoText,
} from "../../../components/text";
import { colors } from "../../../constants/colors";
import {
  DEFAULT_ID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../constants/utils";
import {
  useLimitedRoomAudioMessages,
  useLimitedRoomLinkMessages,
  useLimitedRoomOtherMessages,
} from "../../../hooks/useRooms";
import MetadataPreviewList from "../../cloud/metadata-list.tsx/metadata-preview-list";

export default function RoomHeader({
  room,
  setRoom,
  members,
  setMembers,
  onAddSystemMessage,
}) {
  const navigation = useNavigation();
  const [showUsers, setShowUsers] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const roomId = room && room.id ? room.id : DEFAULT_ID;
  const audioPosts = useLimitedRoomAudioMessages(roomId);
  const otherPosts = useLimitedRoomOtherMessages(roomId);
  const linkPosts = useLimitedRoomLinkMessages(roomId);

  const roomHasFiles = useMemo(() => {
    return (
      audioPosts.length > 0 || linkPosts.length > 0 || otherPosts.length > 0
    );
  }, [audioPosts, otherPosts, linkPosts]);

  if (room) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View style={{ width: 45 }}>
            <BackButton style={{ width: 38 }} />
          </View>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => setShowUsers(!showUsers)}
          >
            <SimpleMonoText style={{ fontSize: 20, marginRight: 4 }}>
              {`${room ? room.name : "Loading..."}`}
            </SimpleMonoText>
            <Entypo
              name={showUsers ? "chevron-up" : "chevron-down"}
              size={18}
              color="white"
              style={{ marginRight: -18 }}
            />
          </TouchableOpacity>

          <Popover
            isVisible={showModal}
            onRequestClose={() => setShowModal(false)}
            popoverStyle={{ backgroundColor: "black" }}
            from={
              <TouchableOpacity
                onPress={() => setShowModal(!showModal)}
                style={{ width: 45, alignItems: "flex-end" }}
              >
                <Feather
                  name={showModal ? "x" : "menu"}
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
            }
          >
            <ScrollView
              style={{
                backgroundColor: colors.darkblack,
                borderRadius: 12,
                width: SCREEN_WIDTH * 0.85,
                paddingHorizontal: 14,
                paddingTop: 14,
                height: SCREEN_HEIGHT - 200,
              }}
              showsVerticalScrollIndicator={false}
            >
              {!roomHasFiles && (
                <View>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 14,
                      borderBottomColor: colors.transparentWhite3,
                      borderBottomWidth: 0.4,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 6,
                    }}
                    onPress={() => {
                      (navigation as any).navigate("RoomMetadataScreen", {
                        roomId: room.id,
                        room: JSON.stringify(room),
                        members: JSON.stringify(members),
                        kind: "Files",
                      });
                      setShowModal(false);
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <BoldMonoText>{"View Files"}</BoldMonoText>
                    </View>
                    <AntDesign
                      style={{ marginLeft: 4 }}
                      name="right"
                      size={14}
                      color={colors.transparentWhite3}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {otherPosts.length > 0 && (
                <MetadataPreviewList
                  itemWidth={62}
                  posts={otherPosts}
                  kind={"Files"}
                  onPressViewAll={() => {
                    (navigation as any).navigate("RoomMetadataScreen", {
                      roomId: room.id,
                      room: JSON.stringify(room),
                      members: JSON.stringify(members),
                      kind: "Files",
                    });
                    setShowModal(false);
                  }}
                  customRenderTitle={null}
                />
              )}
              {audioPosts.length > 0 && (
                <MetadataPreviewList
                  itemWidth={62}
                  posts={audioPosts}
                  kind={"Audio"}
                  onPressViewAll={() => {
                    (navigation as any).navigate("RoomMetadataScreen", {
                      roomId: room.id,
                      room: JSON.stringify(room),
                      members: JSON.stringify(members),
                      kind: "Audio",
                    });
                    setShowModal(false);
                  }}
                  customRenderTitle={null}
                />
              )}
              {linkPosts.length > 0 && (
                <MetadataPreviewList
                  itemWidth={62}
                  posts={linkPosts}
                  kind={"Links"}
                  onPressViewAll={() => {
                    (navigation as any).navigate("RoomMetadataScreen", {
                      roomId: room.id,
                      room: JSON.stringify(room),
                      members: JSON.stringify(members),
                      kind: "Links",
                    });
                    setShowModal(false);
                  }}
                  customRenderTitle={null}
                />
              )}
              {room && (members || []).length == room.userIds.length && (
                <EditRoomModal
                  room={room}
                  setRoom={setRoom}
                  members={members}
                  setMembers={setMembers}
                  onDelete={() => {
                    navigation.goBack();
                  }}
                  addSystemMessage={(message) => {
                    onAddSystemMessage(message);
                  }}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              )}
            </ScrollView>
          </Popover>
        </View>

        <View
          style={
            showUsers
              ? { marginTop: 12, marginBottom: 12 }
              : { height: 0, width: 0, display: "none" }
          }
        >
          <FetchableAvatarList
            userIds={room.userIds}
            size={50}
            users={members}
            setUsers={setMembers}
          />
        </View>
      </View>
    );
  }
  return <View />;
}
