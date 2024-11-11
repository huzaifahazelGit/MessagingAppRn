import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe, useMyPosts } from "../../hooks/useMe";
import MetadataPreviewList from "../cloud/metadata-list.tsx/metadata-preview-list";

export const ProfileMenu = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const me = useMe();
  const latestPosts = useMyPosts(me.id);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowModal(!showModal)}
        style={{
          width: 45,
          alignItems: "flex-end",
          paddingRight: 20,
        }}
      >
        <Feather name={showModal ? "x" : "menu"} size={22} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: colors.transparentBlack4,
          }}
        >
          <Pressable
            style={{
              width: SCREEN_WIDTH - 300,
              height: SCREEN_HEIGHT,
            }}
            onPress={() => setShowModal(false)}
          ></Pressable>
          <ScrollView
            style={{
              backgroundColor: colors.darkblack,
              borderRadius: 12,
              width: 300,
              paddingHorizontal: 14,
              paddingTop: 14,
              height: SCREEN_HEIGHT,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, paddingTop: insets.top + 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <BoldMonoText style={{ fontSize: 20 }}>MENU</BoldMonoText>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <AntDesign name="close" size={24} color={colors.blue} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: colors.lightblack,
                  width: "100%",
                  borderRadius: 12,

                  paddingHorizontal: 14,
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 0.4,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setShowModal(false);
                    (navigation as any).navigate("SettingsScreen");
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>Settings</BoldMonoText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 0.4,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setShowModal(false);
                    (navigation as any).navigate("SubscriptionsScreen");
                  }}
                >
                
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 0.4,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setShowModal(false);
                    (navigation as any).navigate("EditProfileScreen");
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>
                    Edit Profile
                  </BoldMonoText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 0.4,
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setShowModal(false);
                    Linking.openURL("https://discord.gg/JK3mCpuK");
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>Support</BoldMonoText>
                </TouchableOpacity>
                <View
                  style={{
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>
                    Always show App Rocket AI
                  </BoldMonoText>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Switch
                      trackColor={{
                        false: colors.lightblack,
                        true: colors.purple,
                      }}
                      thumbColor={colors.white}
                      onValueChange={(val) => {
                        updateDoc(doc(getFirestore(), "users", me.id), {
                          hideRAI: !val,
                        });
                      }}
                      value={me.hideRAI ? false : true}
                      style={{
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        marginTop: -4,
                      }}
                    />
                  </View>
                </View>
                {/* <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setShowModal(false);
                    (navigation as any).navigate("ProfileXPScreen", {
                      userId: me.id,
                    });
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>
                    Dashboard
                  </BoldMonoText>
                </TouchableOpacity> */}
              </View>

              <View style={{ marginTop: 20 }}>
                <MetadataPreviewList
                  itemWidth={67}
                  posts={latestPosts}
                  kind={"Files"}
                  customRenderTitle={
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Feather name="cloud" size={24} color="white" />
                        <BoldMonoText style={{ fontSize: 16, marginLeft: 8 }}>
                          App Rocket Cloud
                        </BoldMonoText>
                      </View>

                      <BodyText
                        style={{
                          color: colors.purple,
                          textDecorationColor: colors.purple,
                          textDecorationLine: "underline",
                          opacity: 0.8,
                        }}
                      >
                        {"see all"}
                      </BodyText>
                    </View>
                  }
                  onPressViewAll={() => {
                    setShowModal(false);
                    (navigation as any).navigate("CloudHomeScreen");
                  }}
                />
              </View>

              <View
                style={{
                  backgroundColor: colors.lightblack,
                  width: "100%",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                  onPress={() => {
                    setShowModal(false);
                    (navigation as any).navigate("BookmarksScreen");
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>Saved</BoldMonoText>
                  <Feather name="bookmark" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: colors.lightblack,
                  width: "100%",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    paddingVertical: 10,
                  }}
                >
                  <BoldMonoText style={{ fontSize: 16 }}>
                    Invite Friends
                  </BoldMonoText>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 12,
                      marginBottom: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                        (navigation as any).navigate("InviteFriendsScreen");
                      }}
                    >
                      <View
                        style={{ width: 45, height: 45, borderRadius: 45 / 2 }}
                      >
                        <LinearGradient
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          colors={[colors.blue, colors.purple]}
                        >
                          <Ionicons
                            name="attach-outline"
                            size={26}
                            color="black"
                          />
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                        (navigation as any).navigate("InviteFriendsScreen");
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      <View
                        style={{ width: 45, height: 45, borderRadius: 45 / 2 }}
                      >
                        <LinearGradient
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          colors={[colors.blue, colors.purple]}
                        >
                          <Ionicons
                            name="chatbubble-outline"
                            size={22}
                            color="black"
                          />
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                        (navigation as any).navigate("InviteFriendsScreen");
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      <View
                        style={{ width: 45, height: 45, borderRadius: 45 / 2 }}
                      >
                        <LinearGradient
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          colors={[colors.blue, colors.purple]}
                        >
                          <Ionicons
                            name="mail-outline"
                            size={24}
                            color="black"
                          />
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>

                    {me && me.isExecutive && (
                      <TouchableOpacity
                        onPress={() => {
                          setShowModal(false);
                          (navigation as any).navigate("InviteFriendsScreen", {
                            executive: true,
                          });
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <View
                          style={{
                            backgroundColor: colors.white,
                            height: 45,
                            borderRadius: 45 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: colors.white,
                            shadowOffset: {
                              width: 0.2,
                              height: 0.2,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 5,

                            elevation: 5,
                          }}
                        >
                          <BoldMonoText
                            style={{ color: "black", paddingHorizontal: 12 }}
                          >
                            EXECUTIVE
                          </BoldMonoText>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  borderColor: "red",
                  borderWidth: 1,
                  marginTop: 20,
                  marginHorizontal: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
                onPress={async () => {
                  await signOut(getAuth());
                  setShowModal(false);
                }}
              >
                <BoldMonoText style={{ fontSize: 16, color: "red" }}>
                  Sign Out
                </BoldMonoText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
