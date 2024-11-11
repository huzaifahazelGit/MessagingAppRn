import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import AvatarList from "../../components/lists/avatar-list";
import { EditPostModal } from "../../components/modals/edit-post-modal";
import { PostOptionsModal } from "../../components/modals/post-options-modal";
import ProfileImage from "../../components/images/profile-image";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { useCompanyForId } from "../../hooks/useCompanies";

export const PostHeader = ({
  users,
  post,
  profile,
  chat,
  maxWidth,
  userId,
  onDelete,
  shareToStories,
  repostToFeed,
  setShowAddToJukebox,
}: {
  users: User[];
  post: Post;
  profile: boolean;
  chat: boolean;
  maxWidth?: number;
  userId: string;
  onDelete: any;
  shareToStories: any;
  repostToFeed: any;
  setShowAddToJukebox: any;
}) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const company = useCompanyForId(post.companyId);

  const mainUser = useMemo(() => {
    return (users || []).find((u) => u && u.id === userId);
  }, [users, userId, company]);

  const textColor = useMemo(() => {
    return profile && mainUser && mainUser.textColor
      ? mainUser.textColor
      : colors.softWhite;
  }, [mainUser]);

  const timeago = useMemo(() => {
    if (post.createdate && post.createdate.seconds) {
      return moment(new Date(post.createdate.seconds * 1000)).fromNow();
    }
    return "";
  }, [post]);

  const fullWidth =
    maxWidth && !isNaN(maxWidth)
      ? maxWidth
      : chat
      ? SCREEN_WIDTH - 80
      : SCREEN_WIDTH - 24;

  if (!mainUser) {
    return <View />;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          width: fullWidth,
          marginBottom: 8,
        }}
      >
        {company ? (
          <Pressable
            onPress={() => {
              (navigation as any).navigate("CompanyStack", {
                screen: "CompanyProfileScreen",
                params: { companyId: post.companyId },
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                width: fullWidth / 2,
              }}
            >
              <ProfileImage
                user={{ ...(company as any), id: post.companyId }}
                size={30}
              />
              <View style={{ marginLeft: 12 }}>
                <BodyText style={{ color: textColor }}>
                  {company ? company.name : ""}
                </BodyText>
              </View>
            </View>
          </Pressable>
        ) : users.length > 1 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",

              width: fullWidth / 2,
            }}
          >
            <AvatarList
              avatars={users.map((item) => item.profilePicture)}
              totalCount={users.length}
            />

            <View style={{ marginLeft: 12 }}>
              <View style={{ flexDirection: "row" }}>
                {users.map((item) => (
                  <Pressable
                    onPress={() => {
                      (navigation as any).navigate("ProfileStack", {
                        screen: "ProfileScreen",
                        params: { userId: item.id },
                      });
                    }}
                    key={item.id}
                  >
                    <BodyText style={{ color: textColor }}>{`${item.username}${
                      item.id == mainUser.id ? " & " : ""
                    }`}</BodyText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => {
              (navigation as any).navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: { userId: post.userId },
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                width: fullWidth / 2,
              }}
            >
              <ProfileImage user={{ ...mainUser, id: post.userId }} size={30} />
              <View style={{ marginLeft: 12 }}>
                <BodyText style={{ color: textColor }}>
                  {mainUser ? mainUser.username : ""}
                </BodyText>
              </View>
            </View>
          </Pressable>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            width: fullWidth / 2,
          }}
        >
          {post.location && (
            <BodyText
              style={{
                color: textColor,
                marginRight: 8,
              }}
            >
              {`${post.location}`}
            </BodyText>
          )}
          <View
            style={{
              overflow: "hidden",

              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <BodyText style={{ color: textColor, marginRight: 5 }}>
              {timeago}
            </BodyText>
          </View>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ marginTop: 0 }}
          >
            <Feather
              name="more-horizontal"
              size={24}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <PostOptionsModal
        users={users}
        post={post}
        userId={userId}
        onDelete={onDelete}
        showModal={showModal}
        setShowModal={setShowModal}
        setShowEdit={setShowEdit}
        shareToStories={shareToStories}
        repostToFeed={repostToFeed}
        setShowAddToJukebox={setShowAddToJukebox}
      />
      <EditPostModal
        post={post}
        onDelete={onDelete}
        showModal={showEdit}
        setShowModal={setShowEdit}
      />
    </View>
  );
};
