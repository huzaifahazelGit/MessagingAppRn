import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { UserDropdown } from "../dropdowns/user-dropdown";
import AvatarList from "../lists/avatar-list";
import { BackButton } from "../buttons/buttons";
import { BodyText, BoldMonoText } from "../text";
import { IS_IOS } from "../../constants/utils";
import { User } from "../../models/user";
import ProfileImage from "../images/profile-image";

export default function UserPickerButton({
  users,
  setUsers,
  disableDelete,
  children,
}: {
  users: User[];
  setUsers: any;
  disableDelete?: boolean;
  children: any;
}) {
  const [showModal, setShowModal] = useState(false);

  const addLocation = async () => {
    setShowModal(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={addLocation}>{children}</TouchableOpacity>
      <Modal visible={showModal}>
        <UserPickerInnerModal
          setShowModal={setShowModal}
          confirm={() => {
            setShowModal(false);
          }}
          users={users}
          setUsers={setUsers}
          disableDelete={disableDelete}
        />
      </Modal>
    </View>
  );
}

export function UserPickerInnerModal({
  setShowModal,
  confirm,
  users,
  setUsers,
  disableDelete,
  title,
}: {
  setShowModal: any;
  confirm: any;
  users: User[];
  setUsers: any;
  disableDelete?: boolean;
  title?: string;
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <BackButton customBack={() => setShowModal(false)} />
        <BoldMonoText style={{}}>
          {title ? title : `Select User`.toUpperCase()}
        </BoldMonoText>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginTop: 40,
                marginHorizontal: 20,
                zIndex: 2,
                backgroundColor: colors.black,
              }}
            >
              <UserDropdown
                selectedUser={null}
                setSelectedUser={(user) => {
                  if (user) {
                    setUsers([
                      ...(users || []).filter((item) => item.id !== user.id),
                      user,
                    ]);
                  }
                }}
              />
            </View>
          </View>
          <View style={{}}>
            <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  zIndex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {(users || []).map((user) => (
                  <View
                    key={user.id}
                    style={{
                      flexDirection: "row",
                      backgroundColor: colors.white,
                      marginRight: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 20,
                      marginBottom: 8,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <ProfileImage user={user} includeBlank={true} size={34} />

                      <BoldMonoText style={{ marginLeft: 8, color: "black" }}>
                        {user.username}
                      </BoldMonoText>
                    </View>
                    {!disableDelete && (
                      <TouchableOpacity
                        style={{ marginLeft: 3 }}
                        onPress={() => {
                          setUsers(
                            (users || []).filter((item) => item.id !== user.id)
                          );
                        }}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={colors.transparentBlack6}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 25,
                marginHorizontal: 20,
                marginBottom: 8,
              }}
              onPress={() => {
                confirm();
              }}
            >
              <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
