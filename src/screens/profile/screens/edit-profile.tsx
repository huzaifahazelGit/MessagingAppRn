import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  doc,
  getDoc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import ColorPicker from "react-native-wheel-color-picker";
import { LightButton } from "../../../components/buttons/buttons";
import ProfileImage from "../../../components/images/profile-image";
import BackgroundInput from "../../../components/inputs/background-input";
import ImageInput from "../../../components/inputs/image-input";
import NavBar from "../../../components/navbar";
import { BodyText, BoldMonoText } from "../../../components/text";
import CompanyPickerButton from "../../../components/upload-wrappers/companypicker-button";
import { TagsPickerInnerModal } from "../../../components/upload-wrappers/tags-picker";
import { colors } from "../../../constants/colors";
import { MAPS_KEY } from "../../../constants/env";
import { Fonts } from "../../../constants/fonts";
import { IS_IOS, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { containsAll, sameMembers } from "../../../services/utils";
import { LabelDropdown } from "../../../components/inputs/label-input";
import { Feather } from "@expo/vector-icons";

export default function EditProfileScreen() {
  const me = useMe();
  const navigation = useNavigation();

  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [spotify, setSpotify] = useState("");
  const [instagram, setInsta] = useState("");
  const [youtube, setYoutube] = useState("");
  const [soundcloud, setSoundcloud] = useState("");
  const [website, setWebsite] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(colors.darkblack);
  const [textColor, setTextColor] = useState(colors.white);
  const [buttonColor, setButtonColor] = useState(colors.blue);
  const [roles, setRoles] = useState([]);
  const [pro, setPro] = useState("");
  const [publisher, setPublisher] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("");
  const [daw, setDaw] = useState("");
  const [studioDetails, setStudioDetails] = useState("");
  const [showRoles, setShowRoles] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [publisherIsNone, setPublisherIsNone] = useState(false);
  const [managerIsNone, setManagerIsNone] = useState(false);
  const [labelIsNone, setLabelIsNone] = useState(false);

  useEffect(() => {
    addLocation();
    loadCompanies();
  }, []);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  const loadCompanies = async () => {
    let promises = [];

    (me.companyIds || []).forEach((companyId) => {
      const docRef = doc(getFirestore(), "companies", companyId);
      promises.push(
        getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    const results = await Promise.all(promises);

    setCompanies(results);
  };

  const searchableDataHasChanged = useMemo(() => {
    if (me) {
      let companiesIds = (companies || []).map((item) => item.id);
      let meCompaniesIds = me.companyIds || [];
      if (!sameMembers(companiesIds, meCompaniesIds)) {
        return true;
      }
      if (
        me.bio != bio ||
        me.username != username ||
        me.pro != pro ||
        me.publisher != publisher ||
        me.manager != manager ||
        me.labelObj?.name != selectedLabel?.name ||
        me.location != location ||
        me.daw != daw ||
        me.studioDetails != studioDetails ||
        me.musicianType != roles
      ) {
        return true;
      }
    }
    return false;
  }, [
    me,
    bio,
    username,
    pro,
    publisher,
    manager,
    selectedLabel,
    location,
    daw,
    studioDetails,
    roles,
    companies,
  ]);

  const addLocation = async () => {
    console.log("addLocation");
    Location.setGoogleApiKey(MAPS_KEY);

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (me && !me.location) {
      let loc = await Location.getCurrentPositionAsync({});
      let result = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (result.length > 0) {
        let locItem = result[0];
        if (locItem.city) {
          if (locItem.country != "United States") {
            setLocation(`${locItem.city}, ${locItem.country}`);
          } else {
            setLocation(`${locItem.city}, ${locItem.region}`);
          }
        }
      }
    }
  };

  useEffect(() => {
    setUsername(me.username);
    setBio(me.bio ? `${me.bio}` : "");
    if (me.profilePicture) {
      setImageURL(me.profilePicture);
    }
    if (me.spotify) {
      setSpotify(me.spotify);
    }
    if (me.youtube) {
      setYoutube(me.youtube);
    }
    if (me.soundcloud) {
      setSoundcloud(me.soundcloud);
    }
    if (me.instagram) {
      setInsta(me.instagram);
    }
    if (me.website) {
      setWebsite(me.website);
    }

    if (me.pro) {
      setPro(me.pro);
    }
    if (me.publisher) {
      if (me.publisher == "none") {
        setPublisherIsNone(true);
      }
      setPublisher(me.publisher);
    }
    if (me.manager) {
      if (me.manager == "none") {
        setManagerIsNone(true);
      }
      setManager(me.manager);
    }
    if (me.label && me.label == "none") {
      setLabelIsNone(true);
    }
    if (me.labelObj) {
      setSelectedLabel(me.labelObj);
    }
    if (me.location) {
      setLocation(me.location);
    }
    if (me.daw) {
      setDaw(me.daw);
    }
    if (me.studioDetails) {
      setStudioDetails(me.studioDetails);
    }

    if (me.backgroundColor) {
      setBackgroundColor(me.backgroundColor);
    }
    if (me.textColor) {
      setTextColor(me.textColor);
    }
    if (me.buttonColor) {
      setButtonColor(me.buttonColor);
    }
    if (me.musicianType) {
      setRoles(me.musicianType);
    }
    setInitialLoadDone(true);
  }, []);

  const submit = async () => {
    let companiesIds = (companies || []).map((item) => item.id);
    setLoading(true);

    if (!sameMembers(companiesIds, me.companyIds || [])) {
      if (!containsAll(companiesIds, me.companyIds || [])) {
        // removed
        (me.companyIds || []).forEach((companyId) => {
          if (!companiesIds.includes(companyId)) {
            let ref = doc(getFirestore(), "companies", companyId);
            updateDoc(ref, {
              artistCount: increment(-1),
            });
          }
        });
      }
      if (!containsAll(me.companyIds || [], companiesIds)) {
        // added
        companiesIds.forEach((companyId) => {
          if (!(me.companyIds || []).includes(companyId)) {
            let ref = doc(getFirestore(), "companies", companyId);
            updateDoc(ref, {
              artistCount: increment(1),
            });
          }
        });
      }
    }
    let updates: any = {
      username: username,
      bio: bio,
      spotify: spotify ? spotify : me.spotify || "",
      youtube: youtube ? youtube : me.youtube || "",
      soundcloud: soundcloud ? soundcloud : me.soundcloud || "",
      instagram: instagram ? instagram : me.instagram || "",
      website: website ? website : me.website || "",
      profilePicture: imageURL,
      backgroundColor: backgroundColor,
      textColor: textColor,
      buttonColor: buttonColor,
      pro: pro ? pro : me.pro || "",
      publisher: publisher ? publisher : me.publisher || "",
      manager: manager ? manager : me.manager || "",
      label: selectedLabel ? selectedLabel.name : me.label || "",
      labelObj:
        selectedLabel && selectedLabel.name != "none" ? selectedLabel : null,
      location: location ? location : me.location || "",
      daw: daw ? daw : me.daw || "",
      studioDetails: studioDetails ? studioDetails : me.studioDetails || "",
      lastActive: new Date(),
      musicianType: roles,
      companyIds: companiesIds,
    };

    if (searchableDataHasChanged) {
      updates = {
        ...updates,
        lastProfileUpdate: new Date(),
      };
    }

    const userRef = doc(getFirestore(), "users", me.id);
    await updateDoc(userRef, {
      ...updates,
    });

    setLoading(false);
    navigation.goBack();
  };

  const ready = useMemo(() => {
    if (username.length < 4) {
      return false;
    }

    return true;
  }, [username]);

  console.log("selected label", selectedLabel);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <NavBar title={"Edit Profile"} includeBack={true} />

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
              base={"users"}
              customBackground={
                <ProfileImage size={80} user={me} overrideURL={imageURL} />
              }
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <BoldMonoText style={{ fontSize: 18 }}>
              CUSTOMIZE YOUR LOOK
            </BoldMonoText>
            <ColorPickerRow
              currentColor={backgroundColor}
              setCurrentColor={setBackgroundColor}
              title={"Background Color"}
            />
            <ColorPickerRow
              currentColor={textColor}
              setCurrentColor={setTextColor}
              title={"Text Color"}
            />
            <ColorPickerRow
              currentColor={buttonColor}
              setCurrentColor={setButtonColor}
              title={"Button Color"}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <BackgroundInput
              title={"USERNAME"}
              titleStyles={{
                fontSize: 18,
                fontFamily: Fonts.MonoBold,
              }}
              placeholder={"Your username"}
              value={username}
              setValue={setUsername}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <BackgroundInput
              multiline
              titleStyles={{
                fontSize: 18,
                fontFamily: Fonts.MonoBold,
              }}
              title={"BIO"}
              placeholder={"About you..."}
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
                  {"ORGANIZATIONS"}
                </BodyText>
              </View>
            </View>
            <CompanyPickerButton
              companies={companies}
              setCompanies={setCompanies}
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
                  {(companies || []).map((item) => item.name).join(", ")}
                </BodyText>
              </View>
            </CompanyPickerButton>
          </View>

          <View style={{ marginTop: 20 }}>
            <BodyText
              style={{
                fontSize: 18,
                fontFamily: Fonts.MonoBold,
                marginBottom: 10,
              }}
            >
              {"ROLES"}
            </BodyText>
            <TouchableOpacity
              style={{
                paddingVertical: 14,
                paddingHorizontal: 8,

                minWidth: SCREEN_WIDTH - 100,
                borderRadius: 6,
                backgroundColor: colors.lightblack,
              }}
              onPress={() => setShowRoles(true)}
            >
              <BodyText>{roles.join(", ")}</BodyText>
            </TouchableOpacity>
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

            <BackgroundInput
              titleStyles={{
                fontSize: 18,
                marginTop: 10,
                fontFamily: Fonts.MonoBold,
              }}
              value={pro}
              title={`P.R.O.`}
              setValue={setPro}
              placeholder="Your performing rights organization..."
            />
            {publisherIsNone ? (
              <BodyText
                style={{
                  marginBottom: 0,
                  fontSize: 18,
                  marginTop: 20,
                  fontFamily: Fonts.MonoBold,
                }}
              >
                {"Publisher"}
              </BodyText>
            ) : (
              <BackgroundInput
                titleStyles={{
                  fontSize: 18,
                  marginTop: 20,
                  fontFamily: Fonts.MonoBold,
                }}
                value={publisher}
                title={`Publisher`}
                placeholder="Your publisher..."
                setValue={setPublisher}
              />
            )}

            {(publisher == "none" || !publisher) && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={() => {
                  if (publisherIsNone) {
                    setPublisher("");
                    setPublisherIsNone(false);
                  } else {
                    setPublisher("none");
                    setPublisherIsNone(true);
                  }
                }}
              >
                {publisherIsNone ? (
                  <Feather name="check-square" size={24} color={colors.blue} />
                ) : (
                  <Feather name="square" size={24} color={colors.white} />
                )}
                <BoldMonoText style={{ marginLeft: 8 }}>NONE</BoldMonoText>
              </TouchableOpacity>
            )}

            {managerIsNone ? (
              <BodyText
                style={{
                  marginBottom: 0,
                  fontSize: 18,
                  marginTop: 20,
                  fontFamily: Fonts.MonoBold,
                }}
              >
                {"Manager"}
              </BodyText>
            ) : (
              <BackgroundInput
                titleStyles={{
                  fontSize: 18,
                  marginTop: 20,
                  fontFamily: Fonts.MonoBold,
                }}
                placeholder="Your manager..."
                value={manager}
                title={`Manager`}
                setValue={setManager}
              />
            )}

            {(manager == "none" || !manager) && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={() => {
                  if (managerIsNone) {
                    setManager("");
                    setManagerIsNone(false);
                  } else {
                    setManager("none");
                    setManagerIsNone(true);
                  }
                }}
              >
                {managerIsNone ? (
                  <Feather name="check-square" size={24} color={colors.blue} />
                ) : (
                  <Feather name="square" size={24} color={colors.white} />
                )}
                <BoldMonoText style={{ marginLeft: 8 }}>NONE</BoldMonoText>
              </TouchableOpacity>
            )}

            {labelIsNone ? (
              <BodyText
                style={{
                  marginBottom: 0,
                  fontSize: 18,
                  marginTop: 20,
                  fontFamily: Fonts.MonoBold,
                }}
              >
                {"Label"}
              </BodyText>
            ) : (
              <View style={{ zIndex: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BodyText
                    style={{
                      marginBottom: 10,
                      fontSize: 18,
                      marginTop: 20,
                      fontFamily: Fonts.MonoBold,
                    }}
                  >
                    {"Label"}
                  </BodyText>
                </View>

                {initialLoadDone && (
                  <LabelDropdown
                    selectedLabel={selectedLabel}
                    setSelectedLabel={setSelectedLabel}
                  />
                )}
              </View>
            )}
            {(!selectedLabel || selectedLabel?.name == "none") && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={() => {
                  if (labelIsNone) {
                    setSelectedLabel(null);
                    setLabelIsNone(false);
                  } else {
                    setSelectedLabel({ name: "none" });
                    setLabelIsNone(true);
                  }
                }}
              >
                {labelIsNone ? (
                  <Feather name="check-square" size={24} color={colors.blue} />
                ) : (
                  <Feather name="square" size={24} color={colors.white} />
                )}
                <BoldMonoText style={{ marginLeft: 8 }}>NONE</BoldMonoText>
              </TouchableOpacity>
            )}

            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BodyText
                  style={{
                    marginBottom: 10,
                    fontSize: 18,
                    marginTop: 20,
                    fontFamily: Fonts.MonoBold,
                  }}
                >
                  {"Location"}
                </BodyText>
              </View>

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
                <GooglePlacesAutocomplete
                  placeholder="Your primary location..."
                  onPress={(data, details = null) => {
                    setLocation(data.description);
                  }}
                  textInputProps={{
                    style: {
                      fontFamily: Fonts.Regular,

                      color: "white",
                      paddingVertical: 12,

                      minWidth: SCREEN_WIDTH - 100,
                      backgroundColor: colors.lightblack,
                      paddingHorizontal: 6,
                    },
                    onChangeText: (text) => {
                      setLocation(text);
                    },
                    value: location,
                  }}
                  query={{
                    key: MAPS_KEY,
                    language: "en",
                  }}
                />
              </View>
            </View>
            {/* <BackgroundInput
              titleStyles={{
                fontSize: 18,
                marginTop: 20,
                fontFamily: Fonts.MonoBold,
              }}
              placeholder="Your label..."
              value={label}
              title={`Label`}
              setValue={setLabel}
            /> */}

            <BackgroundInput
              titleStyles={{
                fontSize: 18,
                marginTop: 20,
                fontFamily: Fonts.MonoBold,
              }}
              value={daw}
              title={`D.A.W.`}
              placeholder="What DAW do you use?"
              setValue={setDaw}
            />
            <BackgroundInput
              titleStyles={{
                fontSize: 18,
                marginTop: 20,
                fontFamily: Fonts.MonoBold,
              }}
              placeholder={
                "Do you work from a Professional or Home Studio primarily or both?"
              }
              multiline
              value={studioDetails}
              setValue={setStudioDetails}
              title={`Studio Details`}
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
      <Modal visible={showRoles} animationType="slide">
        <TagsPickerInnerModal
          options={[
            "MUSICIAN",
            "PRODUCER",
            "ENGINEER",
            "SONGWRITER",
            "DJ",
            "VOCALIST",
            "MANAGER",
          ]}
          tags={roles}
          setTags={setRoles}
          setShowModal={setShowRoles}
          confirm={() => {
            setShowRoles(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

function ColorPickerRow({ currentColor, setCurrentColor, title }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 5,
        }}
        onPress={() => setOpen(!open)}
      >
        <BodyText>{title}</BodyText>
        <View
          style={{
            width: 30,
            height: 30,
            borderColor: "white",
            borderWidth: 2,
            borderRadius: 30 / 2,
            backgroundColor: currentColor,
          }}
        ></View>
      </TouchableOpacity>
      {open ? (
        <ColorPicker
          color={currentColor}
          swatchesOnly={false}
          onColorChangeComplete={(color) => {
            setCurrentColor(color);
          }}
          autoResetSlider={false}
          thumbSize={30}
          sliderSize={30}
          noSnap={true}
          row={false}
          gapSize={10}
          shadeWheelThumb={true}
          shadeSliderThumb={true}
          swatches={false}
          discrete={false}
        />
      ) : (
        <View />
      )}
    </View>
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
