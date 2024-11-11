import { Entypo, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_HEIGHT } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { Post } from "../../models/post";
import EmptyAudioBackground from "../images/empty-audio-background";
import { TextInputInnerModal } from "../upload-wrappers/text-input-modal";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";

export const FileOptionsModal = ({
  post,
  onSelectOption,
  showModal,
  setShowModal,
  inFolder,
}: {
  post: Post;
  onSelectOption: any;
  showModal: boolean;
  setShowModal: any;
  inFolder?: boolean;
}) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [downloading, setDownloading] = useState(false);
  const me = useMe();

  const [newUploadTitle, setNewUploadTitle] = useState(
    post ? post.uploadTitle || "" : ""
  );
  const [showingUploadTitle, setShowingUploadTitle] = useState(false);

  useEffect(() => {
    setCurrentPost(post);
  }, [showModal]);

  const name = useMemo(() => {
    if (post) {
      if (post.uploadTitle) {
        return post.uploadTitle;
      }
      let base = post.image;
      if (post.video) {
        base = post.video;
      }
      if (base.split("%2F").length > 1) {
        let newBase = base.split("%2F")[1];
        return newBase.split("?")[0];
      }
      return post.kind;
    }
    return "";
  }, [post]);

  const onDownload = () => {
    setDownloading(true);

    let source = post.audio ? post.audio : post.video ? post.video : post.image;
    let title = name;

    let ending = source.split("%2F").pop();
    let extOne = ending.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    if (title.includes(ext)) {
      ext = "";
    }
    const path = `${DocumentDirectoryPath}/${title || "audio"}${ext}`;

    let filesPath = `shareddocuments://${path}`;

    console.log("source", source);
    const response = downloadFile({
      fromUrl: source,
      toFile: path,
    });
    response.promise
      .then(async (res) => {
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          setDownloading(false);

          Linking.openURL(filesPath);
        } else {
          setDownloading(false);
          console.log("problem?", res);
        }
      })
      .catch((error) => {
        setDownloading(false);
        console.log("error 6");
        console.log(error);
      });
  };

  const onClickItem = (title: string) => {
    if (title == "Share") {
      setShowModal(false);
      onSelectOption("Share");
    }

    if (title == "Save File") {
      onDownload();
    }

    if (title == "Star") {
      updatePost({ starred: true });
      setShowModal(false);
    }

    if (title == "Remove Star") {
      updatePost({ starred: false });
      setShowModal(false);
    }

    if (title == "Remove from folder") {
      setShowModal(false);
      onSelectOption("Remove from folder");
    }

    if (title == "Add to folder") {
      setShowModal(false);
      onSelectOption("Add to folder");
    }

    if (title == "Rename") {
      setShowingUploadTitle(true);
    }
  };

  var options = useMemo(() => {
    if (!currentPost) {
      return [];
    }

    let items = [];

    items.push({
      title: "Share",
      icon: "share",
    });

    items.push({
      title: "Save File",
      icon: "download",
    });

    if (post.starred) {
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

    if (inFolder) {
      items.push({
        title: "Remove from folder",
        icon: "folder",
      });
    } else {
      items.push({
        title: "Add to folder",
        icon: "folder",
      });
    }

    items.push({
      title: "Rename",
      icon: "type",
    });

    return items;
  }, [currentPost]);

  const updatePost = async (updates) => {
    if (post.marketplace) {
      let ref = doc(getFirestore(), "marketplace", currentPost.id);
      await updateDoc(ref, {
        ...updates,
      });
    } else {
      let ref = doc(getFirestore(), "posts", currentPost.id);
      await updateDoc(ref, {
        ...updates,
      });
    }
  };

  if (!post) {
    return <View />;
  }

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      {showingUploadTitle ? (
        <TextInputInnerModal
          setShowModal={setShowingUploadTitle}
          confirm={() => {
            updatePost({ uploadTitle: newUploadTitle });
            setCurrentPost({ ...currentPost, uploadTitle: newUploadTitle });
            setShowingUploadTitle(false);
          }}
          text={newUploadTitle}
          setText={setNewUploadTitle}
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
                  width: 130,
                  height: 130,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {post.image ? (
                  <Image
                    source={post.image}
                    style={{ width: 130, height: 130 }}
                  />
                ) : (
                  <EmptyAudioBackground size={130} />
                )}
              </View>
              <BoldMonoText style={{ marginTop: 4 }}>{name}</BoldMonoText>
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
