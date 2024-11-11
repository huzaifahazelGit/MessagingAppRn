import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/buttons/buttons";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import {
  useMe,
  useMyFolders,
  useMyLatestAudio,
  useMyLatestImages,
  useMyLatestVideos,
} from "../../hooks/useMe";
import MetadataPreviewList from "./metadata-list.tsx/metadata-preview-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CreateFolderModal } from "../../components/modals/create-folder-modal";
import { EditFolderModal } from "../../components/modals/edit-folder-modal";
import { FontAwesome } from "@expo/vector-icons";

export function CloudHomeScreen() {
  const me = useMe();
  const latestAudio = useMyLatestAudio(me.id);
  const latestImages = useMyLatestImages(me.id);
  const latestVIdeos = useMyLatestVideos(me.id);
  const folders = useMyFolders(me.id);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const navigation = useNavigation();
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.blueblack,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 14,
            alignItems: "center",
            borderBottomColor: colors.transparentWhite4,
            borderBottomWidth: 0.5,
            paddingBottom: 8,
          }}
        >
          <BackButton />
          <Feather name="cloud" size={24} color="white" />
          <BoldMonoText style={{ fontSize: 16, marginLeft: 8 }}>
            Realm Cloud
          </BoldMonoText>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          <View
            style={{
              borderBottomColor: colors.transparentWhite2,
              borderBottomWidth: 0.5,
              marginTop: 14,
              paddingHorizontal: 14,
            }}
          >
            <BoldMonoText>{"Folders"}</BoldMonoText>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 12,
                marginBottom: 30,
              }}
            >
              {(folders || []).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    (navigation as any).navigate("FolderDetail", {
                      folderId: item.id,
                      folder: JSON.stringify(item),
                    });
                  }}
                >
                  <View
                    style={{
                      width: (SCREEN_WIDTH - 68) / 2,
                      height: 58,
                      backgroundColor: colors.transparentWhite2,

                      alignItems: "center",
                      borderRadius: 10,
                      marginRight: index % 2 === 0 ? 10 : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: (SCREEN_WIDTH - 68) / 2,
                      }}
                    >
                      <TouchableOpacity
                        style={{ paddingRight: 6 }}
                        onPress={() => {
                          setEditingFolder(item);
                          setShowEditFolder(true);
                        }}
                      >
                        <Feather
                          name="more-horizontal"
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                    <Feather
                      name="folder"
                      size={24}
                      style={{ marginTop: -6 }}
                      color="white"
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <BodyText style={{ marginTop: 4, fontSize: 14 }}>
                      {item.name}
                    </BodyText>
                    {item.starred ? (
                      <FontAwesome name="star" size={14} color="white" />
                    ) : (
                      <View />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{ marginBottom: 10 }}
                onPress={() => setShowCreateFolder(true)}
              >
                <View
                  style={{
                    width: (SCREEN_WIDTH - 68) / 2,
                    height: 58,
                    backgroundColor: colors.transparentWhite2,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <Feather name="plus" size={24} color="white" />
                </View>
                <BodyText style={{ marginTop: 4, fontSize: 14 }} numLines={2}>
                  {"New Folder"}
                </BodyText>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: colors.transparentWhite2,
              borderBottomWidth: 0.5,
            }}
          >
            <MetadataPreviewList
              itemWidth={(SCREEN_WIDTH - 75) / 3}
              posts={latestAudio}
              kind={"Audio"}
              containerStyles={{ backgroundColor: colors.blueblack }}
              customRenderTitle={<BoldMonoText>{"Audio"}</BoldMonoText>}
              onPressViewAll={() => {
                (navigation as any).navigate("CloudListScreen", {
                  kind: "Audio",
                });
              }}
              includeAudioName={true}
              includeViewAllTile={true}
            />
          </View>

          <View
            style={{
              borderBottomColor: colors.transparentWhite2,
              borderBottomWidth: 0.5,
            }}
          >
            <MetadataPreviewList
              itemWidth={(SCREEN_WIDTH - 75) / 3}
              posts={latestImages}
              kind={"Files"}
              containerStyles={{ backgroundColor: colors.blueblack }}
              customRenderTitle={<BoldMonoText>{"Images"}</BoldMonoText>}
              onPressViewAll={() => {
                (navigation as any).navigate("CloudListScreen", {
                  kind: "Images",
                });
              }}
              includeViewAllTile={true}
            />
          </View>

          <View
            style={{
              borderBottomColor: colors.transparentWhite2,
              borderBottomWidth: 0.5,
            }}
          >
            <MetadataPreviewList
              itemWidth={(SCREEN_WIDTH - 75) / 3}
              posts={latestVIdeos}
              kind={"Files"}
              containerStyles={{ backgroundColor: colors.blueblack }}
              customRenderTitle={<BoldMonoText>{"Videos"}</BoldMonoText>}
              onPressViewAll={() => {
                (navigation as any).navigate("CloudListScreen", {
                  kind: "Videos",
                });
              }}
              includeViewAllTile={true}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <CreateFolderModal
        showModal={showCreateFolder}
        setShowModal={setShowCreateFolder}
      />
      <EditFolderModal
        folder={editingFolder}
        showModal={showEditFolder}
        setShowModal={setShowEditFolder}
        setFolder={() => {}}
      />
    </View>
  );
}
