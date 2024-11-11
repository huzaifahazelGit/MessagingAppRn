import { AntDesign, Entypo, FontAwesome, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import {
  DEFAULT_ID,
  IS_IOS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { MarketplaceItem } from "../../models/marketplace";
import { Post } from "../../models/post";
import { BudgetPickerINnerModal } from "../upload-wrappers/budget-picker";
import { DatePickerInnerModal } from "../upload-wrappers/datepicker-button";
import { LocationPickerInnerModal } from "../upload-wrappers/location-upload";
import { TagPickerInnerModal } from "../upload-wrappers/tags-wrapper";
import { TextInputInnerModal } from "../upload-wrappers/text-input-modal";
import * as ImagePicker from "expo-image-picker";
import { uploadFileAsync } from "../../services/upload-service";
import { getStorage } from "firebase/storage";
import { GeneralDataStore } from "../../store/general-data-store";

export const EditPostModal = ({
  post,
  onDelete,
  showModal,
  setShowModal,
}: {
  post: Post;
  onDelete: any;
  showModal: boolean;
  setShowModal: any;
}) => {
  const [currentPost, setCurrentPost] = useState(post);
  const me = useMe();
  const companies = GeneralDataStore.useState((s) => s.companies);

  const [imageLoading, setImageLoading] = useState(false);
  const [newImage, setNewImage] = useState("");

  const [newLocation, setNewLocation] = useState(post.location);
  const [showingLocation, setShowingLocation] = useState(false);

  const [newDeadline, setNewDeadline] = useState(new Date());
  const [showingDeadline, setShowingDeadline] = useState(false);

  const [newBudget, setNewBudget] = useState((post as any).budget || 0);
  const [showingBudget, setShowingBudget] = useState(false);

  const [newTags, setNewTags] = useState(post.tags || []);
  const [showingTags, setShowingTags] = useState(false);

  const [newText, setNewText] = useState(post.description || "");
  const [showingText, setShowingText] = useState(false);

  const [newUploadTitle, setNewUploadTitle] = useState(post.uploadTitle || "");
  const [showingUploadTitle, setShowingUploadTitle] = useState(false);

  useEffect(() => {
    if (post && post.marketplace && (post as any).endDate) {
      setNewDeadline(new Date((post as any).endDate.seconds * 1000));
    }
  }, []);

  const deletePost = async () => {
    if (currentPost) {
      setShowModal(false);
      Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            if (currentPost.marketplace) {
              let ref = doc(getFirestore(), "marketplace", currentPost.id);
              await updateDoc(ref, {
                archived: true,
              });

              onDelete(currentPost);
            } else {
              let ref = doc(getFirestore(), "posts", currentPost.id);
              await updateDoc(ref, {
                archived: true,
                playlistIds: [],
              });

              onDelete(currentPost);
            }
          },
        },
      ]);
    }
  };

  const onClickItem = (title: string) => {
    if (title == "Change Deadline") {
      setShowingDeadline(true);
    }
    if (title == "Update Location") {
      setShowingLocation(true);
    }
    if (title == "Edit Budget") {
      setShowingBudget(true);
    }
    if (title == "Add/remove Tags") {
      setShowingTags(true);
    }
    if (title == "Edit Audio Image") {
      addImage();
    }

    if (title == "Edit Description") {
      setShowingText(true);
    }

    if (title == "Edit Audio Title") {
      setShowingUploadTitle(true);
    }

    if (title == "Delete Post") {
      deletePost();
      setShowModal(false);
    }
  };

  var options = useMemo(() => {
    if (!currentPost) {
      return [];
    }

    let items = [];
    if (currentPost.marketplace) {
      items.push({
        title: "Change Deadline",
        icon: "clock-o",
        kind: "arrow",
      });
    }

    items.push({
      title: "Edit Description",
      icon: "edit",
      kind: "arrow",
    });

    if (currentPost.audio) {
      items.push({
        title: "Edit Audio Title",
        icon: "music",
        kind: "arrow",
      });

      items.push({
        title: "Edit Audio Image",
        icon: "photo",
        kind: "arrow",
      });
    }

    items.push({
      title: "Update Location",
      icon: "map-o",
      kind: "arrow",
    });

    if (currentPost.marketplace) {
      items.push({
        title: "Edit Budget",
        icon: "sliders",
        kind: "arrow",
      });
    }

    items.push({
      title: "Add/remove Tags",
      icon: "tag",
      kind: "arrow",
    });

    if (currentPost.audio) {
      items.push({
        title: "Downloadable",
        icon: "arrow-circle-o-down",
        kind: "toggle",
      });
    }

    items.push({
      title: "Delete Post",
      icon: "close",
      kind: "arrow",
    });

    return items;
  }, [currentPost, companies]);

  const toggleDownloadable = async () => {
    updatePost({ downloadable: !currentPost.downloadable });
    setCurrentPost({ ...currentPost, downloadable: !currentPost.downloadable });
  };

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

  const budgetString = useMemo(() => {
    if ((currentPost as any).budget > 0) {
      return `$${(currentPost as any).budget > 1 ? "$" : ""}${
        (currentPost as any).budget > 2 ? "$" : ""
      }${(currentPost as any).budget > 3 ? "$" : ""}`;
    }
    return "";
  }, [currentPost]);

  const addImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: IS_IOS ? true : false,
        aspect: [3, 3] as [number, number],
        quality: 0.4,
        base64: false,
      });
      if (!result.canceled) {
        setImageLoading(true);

        const uploadUrl = await uploadFileAsync(
          getStorage(),
          result.assets[0].uri,
          "posts"
        );

        setNewImage(uploadUrl);
        updatePost({ image: uploadUrl });
        setCurrentPost({
          ...currentPost,
          audioThumbnail: uploadUrl,
          image: uploadUrl,
        });
        setImageLoading(false);
      }
    } catch (E) {
      Alert.alert("Error", "There was an error uploading your photo.");
    }
  };

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      {showingLocation ? (
        <LocationPickerInnerModal
          setShowModal={setShowingLocation}
          confirmLocation={() => {
            updatePost({ location: newLocation });
            setCurrentPost({ ...currentPost, location: newLocation });
            setShowingLocation(false);
          }}
          setLocation={(loc) => {
            setNewLocation(loc);
          }}
        />
      ) : showingTags ? (
        <TagPickerInnerModal
          setShowModal={setShowingTags}
          confirm={() => {
            updatePost({ tags: newTags });
            setCurrentPost({ ...currentPost, tags: newTags });
            setShowingTags(false);
          }}
          tags={newTags}
          setTags={setNewTags}
        />
      ) : showingText ? (
        <TextInputInnerModal
          setShowModal={setShowingText}
          confirm={() => {
            updatePost({ description: newText });
            setCurrentPost({ ...currentPost, description: newText });
            setShowingText(false);
          }}
          text={newText}
          modalTitle={"Edit"}
          setText={setNewText}
        />
      ) : showingUploadTitle ? (
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
      ) : showingBudget ? (
        <BudgetPickerINnerModal
          setShowModal={setShowingBudget}
          budget={newBudget}
          setBudget={setNewBudget}
          confirm={() => {
            updatePost({ budget: newBudget });
            // @ts-ignore
            setCurrentPost({ ...currentPost, budget: newBudget });
            setShowingBudget(false);
          }}
        />
      ) : showingDeadline ? (
        <DatePickerInnerModal
          setShowModal={(showing) => {
            if (!showing) {
              updatePost({ endDate: newDeadline });
              // @ts-ignore
              setCurrentPost({ ...currentPost, endDate: newDeadline });
              setShowingDeadline(false);
            }
          }}
          includeTime={true}
          date={newDeadline}
          setDate={setNewDeadline}
        />
      ) : (
        <SafeAreaView style={{ justifyContent: "flex-end", flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.transparentBlack7 }}
            onPress={() => setShowModal(false)}
          />
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingBottom: 40,
              minHeight: SCREEN_HEIGHT * 0.6,
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
            <View style={{ paddingHorizontal: 12 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.title}
                  style={{
                    paddingVertical: option.kind == "toggle" ? 4 : 12,
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 1,
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
                      <FontAwesome
                        name={option.icon}
                        size={18}
                        color={
                          option.title == "Delete Post" ? "red" : colors.black
                        }
                      />
                    </View>

                    <BodyText
                      style={{
                        color:
                          option.title == "Delete Post" ? "red" : colors.black,
                      }}
                    >
                      {option.title}
                    </BodyText>
                  </View>
                  <View>
                    {option.kind == "arrow" ? (
                      <View style={{ flexDirection: "row" }}>
                        {option.title == "Change Deadline" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {(currentPost as any as MarketplaceItem).endDate
                                ? moment(
                                    (currentPost as any as MarketplaceItem)
                                      .endDate.seconds
                                      ? new Date(
                                          (
                                            currentPost as any as MarketplaceItem
                                          ).endDate.seconds * 1000
                                        )
                                      : (currentPost as any as MarketplaceItem)
                                          .endDate
                                  ).format("MMM Do hh:mm A")
                                : ""}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Audio Image" &&
                          (newImage || imageLoading) && (
                            <View>
                              {imageLoading ? (
                                <ActivityIndicator animating />
                              ) : (
                                <Feather
                                  name="check-circle"
                                  size={18}
                                  color="green"
                                />
                              )}
                            </View>
                          )}
                        {option.title == "Update Location" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {currentPost.location}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Description" && (
                          <View>
                            <BodyText
                              style={{
                                color: colors.black,
                                maxWidth: SCREEN_WIDTH * 0.45,
                              }}
                              numLines={1}
                            >
                              {currentPost.description}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Audio Title" && (
                          <View>
                            <BodyText
                              style={{
                                color: colors.black,
                                maxWidth: SCREEN_WIDTH * 0.45,
                              }}
                              numLines={1}
                            >
                              {currentPost.uploadTitle}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Budget" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {budgetString}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Add/remove Tags" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {`${
                                (currentPost.tags || []).length > 0 ? "#" : ""
                              }${(currentPost.tags || []).join(" #")}`}
                            </BodyText>
                          </View>
                        )}
                        {option.title != "Delete Post" && (
                          <AntDesign
                            name="right"
                            size={14}
                            color={colors.gray}
                          />
                        )}
                      </View>
                    ) : (
                      <Switch
                        trackColor={{
                          false: colors.softWhite,
                          true: colors.blue,
                        }}
                        thumbColor={colors.white}
                        ios_backgroundColor={colors.softWhite}
                        onValueChange={() => {
                          if (option.title == "Downloadable") {
                            toggleDownloadable();
                          }
                        }}
                        value={
                          option.title == "Downloadable"
                            ? currentPost.downloadable
                            : false
                        }
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                      />
                    )}
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
