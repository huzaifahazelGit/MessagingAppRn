import { Entypo, Feather } from "@expo/vector-icons";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { Folder } from "../../models/folder";
import { TextInputInnerModal } from "../upload-wrappers/text-input-modal";

export const EditFolderModal = ({
  folder,
  showModal,
  setShowModal,
  setFolder,
}: {
  folder: Folder;
  setFolder: any;
  showModal: boolean;
  setShowModal: any;
}) => {
  const [downloading, setDownloading] = useState(false);
  const me = useMe();

  const [newTitle, setNewTitle] = useState(folder ? folder.name || "" : "");
  const [showingEditTitle, setShowingEditTitle] = useState(false);

  const onClickItem = (title: string) => {
    if (title == "Delete Folder") {
      updateFolder({ archived: true });
      setShowModal(false);
    }

    if (title == "Star") {
      updateFolder({ starred: true });
      setShowModal(false);
    }

    if (title == "Remove Star") {
      updateFolder({ starred: false });
      setShowModal(false);
    }

    if (title == "Rename") {
      setShowingEditTitle(true);
    }
  };

  var options = useMemo(() => {
    if (!folder) {
      return [];
    }

    let items = [];

    if (folder.starred) {
      items.push({
        title: "Remove Star",
        icon: "star",
      });
    } else {
      items.push({
        title: "Star",
        icon: "star",
      });
    }

    items.push({
      title: "Rename",
      icon: "type",
    });

    items.push({
      title: "Delete Folder",
      icon: "trash",
    });

    return items;
  }, [folder]);

  const updateFolder = async (updates) => {
    let ref = doc(getFirestore(), "folders", folder.id);
    await updateDoc(ref, {
      ...updates,
    });
  };

  if (!folder) {
    return <View />;
  }

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      {showingEditTitle ? (
        <TextInputInnerModal
          setShowModal={setShowingEditTitle}
          confirm={() => {
            updateFolder({ name: newTitle });
            setFolder({ ...folder, name: newTitle });
            setShowingEditTitle(false);
          }}
          text={newTitle}
          setText={setNewTitle}
          modalTitle={"Edit"}
        />
      ) : (
        <SafeAreaView style={{ justifyContent: "flex-end", flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.transparentBlack7 }}
            onPress={() => setShowModal(false)}
          />
          <View
            style={{
              backgroundColor: colors.blueblack,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingBottom: 40,
              minHeight: SCREEN_HEIGHT * 0.75,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 12,
                paddingBottom: 12,

                marginHorizontal: 12,
                marginBottom: 30,
              }}
            >
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Entypo name="chevron-down" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  width: (SCREEN_WIDTH - 68) / 2,
                  height: 58,
                  backgroundColor: colors.transparentWhite2,
                  borderRadius: 8,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="folder" size={24} color="white" />
              </View>
              <BoldMonoText style={{ marginTop: 4 }}>
                {folder.name}
              </BoldMonoText>
            </View>
            <View style={{ paddingHorizontal: 12 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.title}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 6,
                  }}
                  onPress={() => {
                    onClickItem(option.title);
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                        width: 24,
                        marginRight: 8,
                      }}
                    >
                      {option.title == "Save File" && downloading ? (
                        <ActivityIndicator animating />
                      ) : (
                        <Feather
                          name={option.icon}
                          size={18}
                          color={
                            option.title == "Delete Post" ? "red" : colors.white
                          }
                        />
                      )}
                    </View>

                    <BoldMonoText
                      style={{
                        color:
                          option.title == "Delete Post" ? "red" : colors.white,
                        fontSize: 18,
                      }}
                    >
                      {`${option.title}`.toUpperCase()}
                    </BoldMonoText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
};
