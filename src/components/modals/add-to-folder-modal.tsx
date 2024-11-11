import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { Post } from "../../models/post";
import { PlaylistDropdown } from "../dropdowns/playlist-dropdown";
import { getFunctions, httpsCallable } from "firebase/functions";
import { bodyTextForKind } from "../../services/activity-service";
import { useMe } from "../../hooks/useMe";
import { XPKind } from "../../models/xp";
import { FolderDropdown } from "../dropdowns/folder-dropdown";

export const AddToFolderModal = ({
  post,
  showModal,
  setShowModal,
}: {
  post: Post;
  showModal: boolean;
  setShowModal: any;
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const me = useMe();

  const save = async () => {
    if (selectedFolder) {
      setLoading(true);
      await updateDoc(doc(getFirestore(), "posts", post.id), {
        parentFolderIds: arrayUnion(selectedFolder.id),
      });

      await updateDoc(doc(getFirestore(), "folders", selectedFolder.id), {
        fileCount: increment(1),
      });

      setLoading(false);
      Toast.show({
        type: "success",
        text1: `Successfully saved to ${selectedFolder.name}`,
      });
      setShowModal(false);
    }
  };

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            backgroundColor: colors.transparentBlack8,
          }}
          onPress={() => setShowModal(false)}
        >
          <KeyboardAvoidingView
            behavior={!IS_ANDROID ? "padding" : "height"}
            keyboardVerticalOffset={150}
          >
            <View
              style={{
                backgroundColor: "white",
                width: SCREEN_WIDTH - 40,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                  marginTop: 10,
                }}
              >
                <BoldMonoText style={{ color: "black" }}>
                  Add to Folder
                </BoldMonoText>
              </View>

              <FolderDropdown
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />

              <View
                style={{ opacity: selectedFolder ? 1 : 0.5, marginTop: 10 }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.purple,
                    borderRadius: 30,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={save}
                >
                  {loading ? (
                    <ActivityIndicator color={"black"} />
                  ) : (
                    <BoldMonoText style={{ fontSize: 16 }}>SAVE</BoldMonoText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};
