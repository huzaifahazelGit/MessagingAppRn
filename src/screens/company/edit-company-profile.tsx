import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { LightButton } from "../../components/buttons/buttons";
import ProfileImage from "../../components/images/profile-image";
import BackgroundInput from "../../components/inputs/background-input";
import ImageInput from "../../components/inputs/image-input";
import NavBar from "../../components/navbar";
import { BodyText } from "../../components/text";
import UserPickerButton from "../../components/upload-wrappers/userpicker-button";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { IS_IOS, SCREEN_WIDTH } from "../../constants/utils";
import { Company } from "../../models/company";
import { setCompany } from "../../store/general-data-store";

export default function EditCompanyProfileScreen() {
  const route = useRoute();
  const params = route.params as any;
  const companyId = params.companyId;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [bio, setBio] = useState("");
  const [name, setName] = useState("");

  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [spotify, setSpotify] = useState("");
  const [instagram, setInsta] = useState("");
  const [youtube, setYoutube] = useState("");
  const [soundcloud, setSoundcloud] = useState("");
  const [website, setWebsite] = useState("");
  //   const [backgroundColor, setBackgroundColor] = useState(colors.darkblack);
  //   const [textColor, setTextColor] = useState(colors.white);
  //   const [buttonColor, setButtonColor] = useState(colors.blue);
  //   const [location, setLocation] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loadedCompany, setLoadedCompany] = useState(null);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    const docRef = doc(getFirestore(), "companies", companyId);
    const docSnap = await getDoc(docRef);
    let c = { ...docSnap.data(), id: companyId } as any;

    setBio(c.bio || "");
    setName(c.name || "");
    setImageURL(c.profilePicture || "");
    setSpotify(c.spotify || "");
    setInsta(c.instagram || "");
    setYoutube(c.youtube || "");
    setSoundcloud(c.soundcloud || "");
    setWebsite(c.website || "");

    let promises = [];
    ((c as Company).adminIds || []).forEach((userId) => {
      const docRef = doc(getFirestore(), "users", userId);
      promises.push(
        getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    let users = await Promise.all(promises);
    setAdmins(users);
    setLoadedCompany(c);
  };

  const submit = async () => {
    setLoading(true);
    let updates: any = {
      name: name,
      bio: bio,
      spotify: spotify ? spotify : loadedCompany.spotify || "",
      youtube: youtube ? youtube : loadedCompany.youtube || "",
      soundcloud: soundcloud ? soundcloud : loadedCompany.soundcloud || "",
      instagram: instagram ? instagram : loadedCompany.instagram || "",
      website: website ? website : loadedCompany.website || "",
      profilePicture: imageURL,
      adminIds: (admins || []).map((item) => item.id),

      lastActive: new Date(),
    };

    const companyRef = doc(getFirestore(), "companies", companyId);
    await updateDoc(companyRef, {
      ...updates,
    });

    setLoading(false);

    setCompany({ ...loadedCompany, ...updates });
    navigation.goBack();
  };

  const ready = useMemo(() => {
    if (name.length < 4) {
      return false;
    }

    return true;
  }, [name]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <NavBar title={"Edit Organization"} includeBack={true} />

      {loadedCompany ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={IS_IOS ? "padding" : "height"}
        >
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: colors.black,
              paddingHorizontal: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageInput
                imageLoading={coverImageLoading}
                setImageLoading={setCoverImageLoading}
                imageURL={imageURL}
                setImageURL={setImageURL}
                width={80}
                height={80}
                base={"companies"}
                customBackground={
                  <ProfileImage
                    size={80}
                    user={loadedCompany}
                    overrideURL={imageURL}
                  />
                }
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <BackgroundInput
                title={"NAME"}
                titleStyles={{
                  fontSize: 18,
                  fontFamily: Fonts.MonoBold,
                }}
                placeholder={"Organization Name"}
                value={name}
                setValue={setName}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <BackgroundInput
                multiline
                titleStyles={{
                  fontSize: 18,
                  fontFamily: Fonts.MonoBold,
                }}
                title={"ABOUT"}
                placeholder={"About..."}
                value={bio}
                setValue={setBio}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BodyText
                    style={{
                      marginBottom: 10,
                      fontSize: 18,
                      fontFamily: Fonts.MonoBold,
                    }}
                  >
                    {"ADMINS"}
                  </BodyText>
                </View>
              </View>
              <UserPickerButton
                users={admins}
                setUsers={setAdmins}
                disableDelete={true}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 6,
                    backgroundColor: colors.lightblack,
                    borderWidth: 0,
                    paddingLeft: 4,
                  }}
                >
                  <BodyText
                    style={{
                      fontFamily: Fonts.Regular,

                      color: "white",
                      paddingVertical: 12,

                      minWidth: SCREEN_WIDTH - 100,
                      backgroundColor: colors.lightblack,
                      paddingHorizontal: 6,
                    }}
                  >
                    {(admins || []).map((item) => item.username).join(", ")}
                  </BodyText>
                </View>
              </UserPickerButton>
            </View>

            <View
              style={{
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <LabelledPlusTextInput
                title={"SPOTIFY"}
                value={spotify}
                setValue={setSpotify}
              />
              <LabelledPlusTextInput
                title={"INSTAGRAM"}
                value={instagram}
                setValue={setInsta}
              />
              <LabelledPlusTextInput
                title={"YOUTUBE"}
                value={youtube}
                setValue={setYoutube}
              />
              <LabelledPlusTextInput
                title={"SOUNDCLOUD"}
                value={soundcloud}
                setValue={setSoundcloud}
              />
              <LabelledPlusTextInput
                title={"WEBSITE"}
                value={website}
                setValue={setWebsite}
              />
            </View>
          </ScrollView>
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <LightButton
              disabled={!ready}
              submit={submit}
              title={"Update Profile"}
              loading={loading}
            ></LightButton>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
}

function LabelledPlusTextInput({
  title,
  value,
  setValue,
}: {
  title: string;
  value: string;
  setValue: any;
}) {
  const placeholderText = useMemo(() => {
    switch (title) {
      case "INSTAGRAM":
        return "@yourusername";
    }
    return `www.${title.toLowerCase()}.com/username`;
  }, [title]);

  return (
    <View style={{ marginVertical: 12 }}>
      <BodyText
        style={{ fontSize: 18, fontFamily: Fonts.MonoBold, marginBottom: 10 }}
      >
        {title}
      </BodyText>
      <View>
        <TextInput
          style={{
            fontFamily: Fonts.Regular,
            textAlign: "left",
            color: "white",
            paddingVertical: 12,
            paddingHorizontal: 8,

            minWidth: SCREEN_WIDTH - 100,
            borderRadius: 6,
            backgroundColor: colors.lightblack,
          }}
          autoCapitalize={"none"}
          placeholderTextColor={colors.transparentWhite6}
          placeholder={placeholderText}
          value={value}
          onChangeText={(text) => setValue(text)}
          keyboardType={"url"}
        />
      </View>
    </View>
  );
}
