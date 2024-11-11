import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { IS_IOS, PREMIUM_IS_TURNED_ON } from "../../constants/utils";
import { Company } from "../../models/company";
import { CompanyDropdown } from "../dropdowns/company-dropdown";
import { BackButton } from "../buttons/buttons";
import ProfileImage from "../images/profile-image";
import { BodyText, BoldMonoText } from "../text";
import { AntDesign } from "@expo/vector-icons";
import { Fonts } from "../../constants/fonts";
import { useMe } from "../../hooks/useMe";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function CompanyPickerButton({
  companies,
  setCompanies,
  children,
}) {
  const me = useMe();
  const [showModal, setShowModal] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [text, setText] = useState("");
  const onOpen = async () => {
    setShowModal(true);
  };

  const createOrg = async () => {
    let org: Company = {
      createdate: new Date(),
      lastupdate: new Date(),
      lastActive: new Date(),

      name: text,
      adminIds: [me.id],

      featured: false,
      verified: false,

      instagram: null,
      twitter: null,
      website: null,
      spotify: null,
      youtube: null,
      soundcloud: null,

      location: "",
      bio: "",

      tags: ["organization"],

      profilePicture: null,

      followerCount: 0,
      followingCount: 0,
      artistCount: 0,
      postCount: 0,

      archived: false,
    };

    let res = await addDoc(collection(getFirestore(), "companies"), {
      ...org,
    });

    let defaultPlaylist = {
      defaultPlaylist: true,
      ownerId: res.id,
      name: "Favorites",
      timeCreated: new Date(),
      lastUpdated: new Date(),
      archived: false,
      ownerIsCompany: true,

      likeCount: 0,
      likedAvatars: [],
      shareCount: 0,

      tags: [],
      featured: false,
    };

    await addDoc(collection(getFirestore(), "playlists"), defaultPlaylist);

    setCompanies([...(companies || []), { ...org, id: res.id }]);
    setText("");
    setAddingNew(false);
  };
  return (
    <View>
      <TouchableOpacity onPress={onOpen}>{children}</TouchableOpacity>
      <Modal visible={showModal}>
        {addingNew ? (
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
                {`New Organization`.toUpperCase()}
              </BoldMonoText>
              <View style={{ width: 30 }} />
            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={IS_IOS ? "padding" : "height"}
            >
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderBottomColor: "white",
                      borderBottomWidth: 1,
                      paddingVertical: 9,
                    }}
                  >
                    <TextInput
                      style={[
                        {
                          fontFamily: Fonts.MonoBold,
                          width: "100%",
                          color: "white",
                          paddingLeft: 4,
                        },
                      ]}
                      placeholder="Organization Name"
                      placeholderTextColor={colors.transparentWhite5}
                      cursorColor={"white"}
                      multiline={true}
                      value={text}
                      onChangeText={(text) => setText(text)}
                    />
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
                    createOrg();
                  }}
                >
                  <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        ) : (
          <CompanyPickerInnerModal
            setShowModal={setShowModal}
            confirm={() => {
              setShowModal(false);
            }}
            companies={companies}
            setCompanies={setCompanies}
            setAddingNew={setAddingNew}
          />
        )}
      </Modal>
    </View>
  );
}

export function CompanyPickerInnerModal({
  setShowModal,
  confirm,
  companies,
  setCompanies,
  setAddingNew,
}: {
  setShowModal: any;
  confirm: any;
  companies: Company[];
  setCompanies: any;
  setAddingNew: any;
}) {
  const me = useMe();
  const navigation = useNavigation();

  const userIsPremium = useMemo(() => {
    if (!PREMIUM_IS_TURNED_ON) {
      return true;
    }
    return (
      me.accessLevel == "premium_monthly" || me.accessLevel == "premium_yearly"
    );
  }, [me.id, me.accessLevel, PREMIUM_IS_TURNED_ON]);

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
        <BoldMonoText style={{}}>{`Select`.toUpperCase()}</BoldMonoText>
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
              <CompanyDropdown
                selectedCompany={null}
                setSelectedCompany={(company) => {
                  if (company) {
                    setCompanies([
                      ...(companies || []).filter(
                        (item) => item.id !== company.id
                      ),
                      company,
                    ]);
                  }
                }}
              />
            </View>
          </View>

          <View>
            <View style={{ zIndex: 1 }}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 28,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => {
                  if (userIsPremium) {
                    setAddingNew(true);
                  } else {
                    setShowModal(false);
                    (navigation as any).navigate("PremiumUpgradeScreen", {
                      kind: "generic",
                    });
                  }
                }}
              >
                <AntDesign
                  name="pluscircle"
                  size={24}
                  color={colors.blue}
                  style={{ marginRight: 12 }}
                />
                <BoldMonoText>{"Add New Organization"}</BoldMonoText>
              </TouchableOpacity>
              {(companies || []).map((company) => (
                <View
                  key={company.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",

                    paddingHorizontal: 28,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ProfileImage
                      //    @ts-ignore
                      user={company}
                      includeBlank={true}
                      size={28}
                    />

                    <BodyText style={{ marginLeft: 8 }}>
                      {company.name}
                    </BodyText>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setCompanies(
                        (companies || []).filter(
                          (item) => item.id !== company.id
                        )
                      );
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ))}
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
