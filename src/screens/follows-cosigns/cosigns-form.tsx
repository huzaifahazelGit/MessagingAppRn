import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { LightButton } from "../../components/buttons/buttons";
import ProfileImage from "../../components/images/profile-image";
import NavBar from "../../components/navbar";
import { BodyText } from "../../components/text";
import TagsWrapper, {
  TagsList,
} from "../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { useProfileColors } from "../../hooks/useProfileColors";
import { Cosign } from "../../models/cosign";
import { bodyTextForKind } from "../../services/activity-service";

export default function CosignFormScreen() {
  const me = useMe();
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  let params = route.params as any;
  let userId = params.userId;
  const [cosignText, setCosignText] = useState("");
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(params.user));
  }, []);

  const profileColors = useProfileColors(user, null, colors.white);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const submit = async () => {
    setLoading(true);
    let newCosign: Cosign = {
      fromUserIds: [me.id],
      toUserId: userId,
      fromUserName: me.username,
      fromUserImage: me.profilePicture,
      text: cosignText,
      tags: tags,
      accepted: true,
      createdate: new Date(),
      archived: false,
      likeCount: 0,
      likedAvatars: [],
    };

    let res = await addDoc(collection(getFirestore(), "cosigns"), {
      ...newCosign,
    });

    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "cosign-create";
    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: userId,
      kind: activityKind,
      post: null,
      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {
        cosignId: res.id,
      },
    });

    const userRef = doc(getFirestore(), "users", userId);
    await updateDoc(userRef, {
      cosignCount: increment(1),
      cosignedBy: arrayUnion(me.id),
    });

    const meRef = doc(getFirestore(), "users", me.id);
    await updateDoc(meRef, {
      cosignWrittenCount: increment(1),
    });

    setLoading(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <NavBar
        title={`Endorse ${user ? user.username : ""}`}
        buttonColor={buttonColor}
        includeBack={true}
        textColor={textColor}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <ScrollView
          style={{
            flex: 1,

            paddingHorizontal: 20,
          }}
          contentContainerStyle={{
            minHeight: SCREEN_HEIGHT - 180,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View
              style={{
                marginTop: 60,
                marginBottom: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ProfileImage size={80} user={me} />
            </View>

            <View
              style={{
                marginHorizontal: 15,
                borderRadius: 6,
                borderColor: textColor,
                borderWidth: 1,
                paddingVertical: 10,
                paddingHorizontal: 10,
                justifyContent: "space-between",
              }}
            >
              <View style={{}}>
                <TextInput
                  style={[
                    {
                      fontFamily: Fonts.Regular,

                      color: textColor,
                      minWidth: SCREEN_WIDTH - 80,
                      height: 140,
                    },
                  ]}
                  placeholderTextColor={textColor}
                  placeholder={"Your endorsement here..."}
                  cursorColor={textColor}
                  multiline={true}
                  value={cosignText}
                  onChangeText={(text) => setCosignText(text)}
                />
              </View>
              <View style={{}}>
                {tags.length > 0 ? (
                  <TagsList
                    tags={tags}
                    setTags={setTags}
                    backgroundColor={buttonColor}
                    textColor={backgroundColor}
                  />
                ) : (
                  <View />
                )}
              </View>
            </View>

            <View
              style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 12 }}
            >
              <TagsWrapper tags={tags} setTags={setTags}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    minWidth: 110,
                  }}
                >
                  <AntDesign name="pluscircleo" size={24} color={textColor} />
                  <BodyText
                    style={{ fontSize: 18, marginLeft: 4, color: textColor }}
                  >
                    TAGS
                  </BodyText>
                </View>
              </TagsWrapper>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 80,
            }}
          >
            <LightButton
              style={{ paddingHorizontal: 40, paddingVertical: 5 }}
              disabled={false}
              color={buttonColor}
              outline={false}
              submit={submit}
              title={"Submit"}
              loading={loading}
              textColor={backgroundColor}
            ></LightButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
