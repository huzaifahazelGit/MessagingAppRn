import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { Folder } from "../../models/folder";

export const CreateFolderModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const me = useMe();

  const save = async () => {
    let folder: Folder = {
      userId: me.id,

      createdate: new Date(),
      lastupdate: new Date(),

      name: name,

      tags: [],

      archived: false,

      parentFolderId: null,
      fileCount: 0,
    };
    await addDoc(collection(getFirestore(), "folders"), folder);
    setName("");
    setShowModal(false);
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
                  Create Folder
                </BoldMonoText>
              </View>

              <TextInput
                style={{
                  backgroundColor: colors.blue,
                  color: colors.white,
                  paddingLeft: 18,
                  fontSize: 16,
                  fontFamily: Fonts.MonoBold,
                  paddingVertical: 12,

                  borderRadius: 30,
                }}
                placeholder={"Folder Name"}
                placeholderTextColor={colors.transparentWhite6}
                selectionColor={colors.transparentWhite6}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
                keyboardAppearance={"dark"}
              />

              <View style={{ opacity: name ? 1 : 0.5, marginTop: 10 }}>
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
