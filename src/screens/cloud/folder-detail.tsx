import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { BackButton } from "../../components/buttons/buttons";
import { EditFolderModal } from "../../components/modals/edit-folder-modal";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_ANDROID } from "../../constants/utils";
import { PaginatedFolderMetadataList } from "./metadata-list.tsx/folder-metadata-list";

export default function FolderDetail() {
  const route = useRoute();
  const params = route.params as any;

  let folderId = params.folderId;
  const [folder, setFolder] = useState(null);

  const [showEditFolder, setShowEditFolder] = useState(false);

  useEffect(() => {
    if (params.folder) {
      setFolder(JSON.parse(params.folder));
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.blueblack,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          paddingBottom: 5,
          borderBottomColor: colors.transparentWhite8,
          borderBottomWidth: 1,
        }}
      >
        <BackButton style={{}} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BoldMonoText
            style={{ marginLeft: 8, marginBottom: 4, fontSize: 16 }}
          >
            {folder ? folder.name : ""}
          </BoldMonoText>
          {/* <TouchableOpacity
            style={{}}
            onPress={() => {
              setShowEditFolder(true);
            }}
          >
            <Feather name="more-horizontal" size={20} color="white" />
          </TouchableOpacity> */}
        </View>
        <View />
      </View>

      <PaginatedFolderMetadataList folderId={folderId} />

      <EditFolderModal
        folder={folder}
        setFolder={setFolder}
        showModal={showEditFolder}
        setShowModal={setShowEditFolder}
      />
    </SafeAreaView>
  );
}
