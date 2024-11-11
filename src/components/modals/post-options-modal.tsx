import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Alert, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookmarkButton from "../buttons/bookmark-button";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { GeneralDataStore } from "../../store/general-data-store";
import { DEFAULT_PROFILE_COLORS } from "../../hooks/useProfileColors";

export const PostOptionsModal = ({
  users,
  post,
  userId,
  onDelete,
  showModal,
  setShowModal,
  setShowEdit,
  shareToStories,
  repostToFeed,
  setShowAddToJukebox,
}: {
  users: User[];
  post: Post;
  userId: string;
  onDelete: any;
  showModal: boolean;
  setShowModal: any;
  setShowEdit: any;
  shareToStories: any;
  repostToFeed: any;
  setShowAddToJukebox: any;
}) => {
  const navigation = useNavigation();
  const me = useMe();
  const [tempFeatured, setTempFeatured] = useState(post.featured);

  const companies = GeneralDataStore.useState((s) => s.companies);

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  const mainUser = useMemo(() => {
    return (users || []).find((u) => u && u.id === userId);
  }, [users, post]);

  if (!mainUser) {
    return <View />;
  }

  const toggleFeatured = () => {
    const ref = doc(
      getFirestore(),
      post.marketplace ? "marketplace" : "posts",
      post.id
    );

    if (post.featured) {
      updateDoc(ref, {
        featured: false,
      });
      setTempFeatured(false);
    } else {
      updateDoc(ref, {
        featured: true,
      });
      setTempFeatured(true);
    }
  };

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
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
            <View
              style={{
                paddingVertical: 8,
                borderBottomColor: colors.gray,
                borderBottomWidth: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 6,
              }}
            >
              <BookmarkButton
                post={post}
                profileColors={{
                  ...DEFAULT_PROFILE_COLORS,
                  textColor: "black",
                }}
              />
            </View>

            {post && post.kind == "audio" && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    setShowAddToJukebox(true);
                  }, 500);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Entypo
                    name="music"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>
                  Save to my Jukebox
                </BodyText>
              </TouchableOpacity>
            )}

            {post && (post.collaboratorIds || []).includes(me.id) && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    setShowEdit(true);
                  }, 500);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Entypo
                    name="pencil"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>Edit</BodyText>
              </TouchableOpacity>
            )}
            {post && post.marketplace && post.userId == me.id && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    setShowEdit(true);
                  }, 500);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Entypo
                    name="pencil"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>Edit</BodyText>
              </TouchableOpacity>
            )}
            {post && (post.collaboratorIds || []).includes(me.id) ? (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  Alert.alert(
                    "Delete Post",
                    "Are you sure you want to delete this post?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: async () => {
                          const ref = doc(
                            getFirestore(),
                            post.marketplace ? "marketplace" : "posts",
                            post.id
                          );

                          await updateDoc(ref, {
                            archived: true,
                            playlistIds: [],
                          });

                          onDelete(post);
                        },
                      },
                    ]
                  );
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Entypo
                    name="trash"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>Delete</BodyText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,

                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  (navigation as any).navigate("ProfileStack", {
                    screen: "ProfileScreen",
                    params: { userId: mainUser.id },
                  });
                  setShowModal(false);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <FontAwesome
                    name="user-circle-o"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>

                <BodyText style={{ color: colors.black }}>
                  View Profile
                </BodyText>
              </TouchableOpacity>
            )}

            {/* {post && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,

                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    shareToStories(post);
                  }, 500);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>
                  Share to story
                </BodyText>
              </TouchableOpacity>
            )} */}
            {post && post.userId != me.id && !post.reposted && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,

                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={() => {
                  setShowModal(false);
                  setTimeout(() => {
                    repostToFeed();
                  }, 500);
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name="redo-variant"
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>
                  Re-post to my feed
                </BodyText>
              </TouchableOpacity>
            )}

            {post &&
              post.userId != me.id &&
              !post.reposted &&
              (companies || []).length > 0 && (
                <View>
                  {companies.map((company) => (
                    <TouchableOpacity
                      key={company.id}
                      style={{
                        paddingVertical: 8,
                        borderBottomColor: colors.gray,
                        borderBottomWidth: 1,

                        alignItems: "center",
                        flexDirection: "row",
                        paddingHorizontal: 6,
                      }}
                      onPress={() => {
                        setShowModal(false);
                        setTimeout(() => {
                          repostToFeed(company);
                        }, 500);
                      }}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 24,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 8,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="redo-variant"
                          size={18}
                          style={{ opacity: 0.8 }}
                          color={colors.black}
                        />
                      </View>
                      <BodyText style={{ color: colors.black }}>
                        {`Re-post as ${company.name}`}
                      </BodyText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            {isAdmin && !(post.video && !post.videoThumbnail) && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  borderBottomColor: colors.gray,
                  borderBottomWidth: 1,

                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 6,
                }}
                onPress={toggleFeatured}
              >
                <View
                  style={{
                    height: 20,
                    width: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <FontAwesome
                    name={tempFeatured ? "star" : "star-o"}
                    size={18}
                    style={{ opacity: 0.8 }}
                    color={colors.black}
                  />
                </View>
                <BodyText style={{ color: colors.black }}>
                  {tempFeatured ? "Remove Feature" : "Feature"}
                </BodyText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
