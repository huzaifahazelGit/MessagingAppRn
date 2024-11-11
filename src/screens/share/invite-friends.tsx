import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import ProfileImage from "../../components/images/profile-image";
import NavBar from "../../components/navbar";
import { BodyText, BoldMonoText } from "../../components/text";
import { IS_IOS, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { XPKind } from "../../models/xp";
import { colors } from "../../constants/colors";
import { ScrollView, TextInput } from "react-native";
import { Fonts } from "../../constants/fonts";
import {
  createExecutiveInviteLink,
  createInviteLink,
} from "../../services/link-service";

export default function InviteFriendsScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as any;
  const isExecutive = params?.executive;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [relation, setRelation] = useState("");

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  useEffect(() => {
    if (!isExecutive) {
      const timer = setTimeout(() => {
        startShare();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startShare = async () => {
    let link = createInviteLink(me.id);

    try {
      await Share.open({ url: link, message: "Join me on Realm" });
      let newXp = {
        points: 1,
        kind: XPKind.inviteUser,
        userId: me.id,
        timeCreated: new Date(),
      };
      await addDoc(collection(getFirestore(), "users", me.id, "xp"), newXp);
      await updateDoc(doc(getFirestore(), "users", me.id), {
        inviteCount: increment(1),
      });
    } catch (error) {
      console.log("error 8");
      console.log(error);
      navigation.goBack();
    }
  };

  const shareExecutive = async () => {
    let newInvite = {
      name,
      email,
      role,
      relation,
      timeCreated: new Date(),
      inviterId: me.id,
    };
    let res = await addDoc(collection(getFirestore(), "invites"), newInvite);
    let link = createExecutiveInviteLink(me.id, res.id);

    try {
      await Share.open({ url: link, message: "Join me on Realm" });

      await updateDoc(doc(getFirestore(), "users", me.id), {
        inviteCount: increment(1),
      });
    } catch (error) {
      console.log("error 8");
      console.log(error);
      navigation.goBack();
    }
  };

  const enabled = useMemo(() => {
    return name && email && role && relation;
  }, [name, email, role, relation]);

  if (isExecutive) {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavBar
            buttonColor={colors.blue}
            includeBack={true}
            title="Invite Friends"
            skipTitle={true}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={IS_IOS ? "padding" : "height"}
          >
            <ScrollView>
              <View style={{ paddingHorizontal: 20 }}>
                <BoldMonoText style={{ fontSize: 32 }}>
                  Who do you want to invite?
                </BoldMonoText>

                <TextInput
                  placeholder="First Last"
                  style={{
                    marginTop: 20,
                    color: "white",
                    fontFamily: Fonts.MonoBold,
                    borderBottomColor: colors.white,
                    borderBottomWidth: 1,
                    fontSize: 20,
                    paddingBottom: 6,
                  }}
                  autoFocus={true}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
                <TextInput
                  placeholder="Company Email"
                  style={{
                    marginTop: 20,
                    color: "white",
                    fontFamily: Fonts.MonoBold,
                    borderBottomColor: colors.white,
                    borderBottomWidth: 1,
                    fontSize: 20,
                    paddingBottom: 6,
                  }}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                  placeholder="Role"
                  style={{
                    marginTop: 20,
                    color: "white",
                    fontFamily: Fonts.MonoBold,
                    borderBottomColor: colors.white,
                    borderBottomWidth: 1,
                    fontSize: 20,
                    paddingBottom: 6,
                  }}
                  value={role}
                  onChangeText={(text) => setRole(text)}
                />
                <TextInput
                  placeholder="Relationship"
                  style={{
                    marginTop: 20,
                    color: "white",
                    fontFamily: Fonts.MonoBold,
                    borderBottomColor: colors.white,
                    borderBottomWidth: 1,
                    fontSize: 20,
                    paddingBottom: 6,
                  }}
                  value={relation}
                  onChangeText={(text) => setRelation(text)}
                />
              </View>
              <View style={{ opacity: enabled ? 1 : 0.6 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.blue,
                    marginHorizontal: 20,
                    paddingVertical: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    marginTop: 20,
                  }}
                  onPress={shareExecutive}
                  disabled={!enabled}
                >
                  <BoldMonoText style={{ fontSize: 20 }}>
                    Send Invite
                  </BoldMonoText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View>
      <Image
        source={require("../../../assets/login-background.png")}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <NavBar includeBack={true} title="Invite Friends" skipTitle={true} />
          <View style={{ flex: 1, alignItems: "center", marginTop: 70 }}>
            <ProfileImage user={me} size={80} border={true} />
            <BoldMonoText
              style={{
                width: 250,
                textAlign: "center",
                fontSize: 25,
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Invite collaborators to join you on Realm
            </BoldMonoText>
            <BodyText>Somewhere within the noise.</BodyText>
          </View>
        </SafeAreaView>
      </Image>
    </View>
  );
}
