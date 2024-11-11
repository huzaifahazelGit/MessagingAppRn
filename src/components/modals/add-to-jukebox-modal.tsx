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

export const AddToJukeboxModal = ({
  post,
  showModal,
  setShowModal,
  onSaveToJukebox,
}: {
  post: Post;
  showModal: boolean;
  setShowModal: any;
  onSaveToJukebox: any;
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const me = useMe();

  const save = async () => {
    if (selectedPlaylist) {
      setLoading(true);
      await updateDoc(doc(getFirestore(), "posts", post.id), {
        playlistIds: arrayUnion(selectedPlaylist.id),
      });

      if (!selectedPlaylist.coverImage && post.image) {
        await updateDoc(doc(getFirestore(), "playlists", selectedPlaylist.id), {
          coverImage: post.image,
          songCount: increment(1),
        });
      } else {
        await updateDoc(doc(getFirestore(), "playlists", selectedPlaylist.id), {
          songCount: increment(1),
        });
      }

      var createActivity = httpsCallable(getFunctions(), "createActivity");

      if (me.id != post.userId) {
        let newXp = {
          points: 1,
          kind: XPKind.addSongToJukebox,
          userId: post.userId,
          timeCreated: new Date(),
        };
        await addDoc(
          collection(getFirestore(), "users", post.userId, "xp"),
          newXp
        );
      }

      if (me.id != post.userId) {
        let activityKind = "add-to-jukebox";
        createActivity({
          actor: {
            id: me.id,
            username: me.username,
            profilePicture: me.profilePicture,
          },
          recipientId: post.userId,
          kind: activityKind,
          post: {
            id: post.id,
            kind: post.kind,
            image: post.image,
          },
          bodyText: bodyTextForKind(activityKind, me),
          extraVars: {
            playlistId: selectedPlaylist.id,
          },
        })
          .then(async (result) => {
            if (result && result.data) {
              onSaveToJukebox((result.data as any).activity);
            }

            setLoading(false);
            Toast.show({
              type: "success",
              text1: `Successfully saved to ${selectedPlaylist.name}`,
            });
            setShowModal(false);
          })
          .catch((err) => {
            console.log("error", err);
          });
      } else {
        setLoading(false);
        Toast.show({
          type: "success",
          text1: `Successfully saved to ${selectedPlaylist.name}`,
        });
        setShowModal(false);
      }
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
                  Save to Jukebox
                </BoldMonoText>
              </View>

              <PlaylistDropdown
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
              />

              <View
                style={{ opacity: selectedPlaylist ? 1 : 0.5, marginTop: 10 }}
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
