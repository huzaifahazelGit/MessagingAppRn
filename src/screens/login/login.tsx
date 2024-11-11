import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { LightButton } from "../../components/buttons/buttons";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_IOS } from "../../constants/utils";
import { User } from "../../models/user";
import IconInput from "./components/icon-input";
import SignIn from "./components/login-signin";
import Start from "./components/login-start";
import { firestore } from "../../store/firebase-configNew";
import 'react-native-get-random-values'; // Ensure this is imported first
import '@ethersproject/shims';
import { ethers } from 'ethers';

import CryptoJS from 'crypto-js';
const encryptionKey = 'your-strong-encryption-key'; // This should be stored securely

// Encrypt the private key
export const encryptPrivateKey = (privateKey) => {
  return CryptoJS.AES.encrypt(privateKey, encryptionKey).toString();
};

// Decrypt the private key
export const decryptPrivateKey = (encryptedPrivateKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [status, setStatus] = useState<"none" | "login" | "signup">("none");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const auth = getAuth();

         
  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  const submit = () => {
    if (status == "login") {
      login();
    } else {
      createUser();
    }
  };

  const login = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the wallet is already created for the current user
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.log("User document does not exist!");
          return;
        }

        const userData = userDoc.data();

        if (!userData.walletInfo || !userData.walletInfo.encryptedPrivateKey) {
          // Wallet info is missing, create a new wallet
          await createWalletForCurrentUser(user.uid);
        }

        setLoading(false);
      } catch (err) {
        console.log("error 4");
        console.log(err);
        setLoading(false);
        if (
          `${err.message}`.includes(
            "There is no user record corresponding to this identifier."
          )
        ) {
          createUser();
        } else {
          Alert.alert("Error", err.message);
        }
      }
    }
  };

  const createUser = async () => {
    if (!loading) {
      setLoading(true);
      let username = email.split("@")[0];
      let user: User = {
        companyIds: [],
        executiveIds: [],
        email: email.toLowerCase(),
        username: username,
        lastupdate: new Date(),
        lastActive: new Date(),
        createdate: new Date(),
        featured: false,
        musicianType: [],
        interests: [],
        instruments: [],
        pro: "",
        publisher: "",
        manager: "",
        label: "",
        location: "",
        daw: "",
        studioDetails: "",
        bio: "",
        tags: [],
        followerCount: 0,
        followingCount: 0,
        audioCount: 0,
        winCount: 0,
        postCount: 0,
        points: 0,
        postStreak: 0,
        loginStreak: 0,
        unreadActivityCount: 0,
        unreadRoomChatCount: 0,
        unreadChatCount: 0,
        skipNotifyFollow: false,
        skipNotifyLikeComment: false,
        skipNotifyTag: false,
        skipNotifyMarket: false,
        cosignCount: 0,
        cosignWrittenCount: 0,
        cosignedBy: [],
        accessLevel: "free",
        submissionCount: 0,
        inviteCount: 0,
        walletInfo: {
          walletAddress: "",
          walletBalance: 0,
          encryptedPrivateKey: "",
        },
      };
    
      try {
        let result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Create a new wallet
        const wallet = ethers.Wallet.createRandom();
        // Encrypt the private key
        const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);
        // Update walletInfo in the user object
        user.walletInfo.walletAddress = wallet.address;
        user.walletInfo.walletBalance = 0; // Initial balance
        user.walletInfo.encryptedPrivateKey = encryptedPrivateKey;

        // Save the user data to Firestore
        const userDoc = doc(firestore, "users", result?.user?.uid);
        console.log("::userDoc Login::", userDoc?.id);
        await setDoc(userDoc, user);

        let defaultPlaylist = {
          defaultPlaylist: true,
          ownerId: result.user.uid,
          name: "My Mixes",
          timeCreated: new Date(),
          lastUpdated: new Date(),
          archived: false,
          ownerIsCompany: false,
          likeCount: 0,
          likedAvatars: [],
          shareCount: 0,
          tags: [],
          featured: false,
        };
        // tara here today - if executive, make other playlists too
        await addDoc(collection(getFirestore(), "playlists"), defaultPlaylist);
        setLoading(false);
      } catch (err) {
        console.log("error 5");
        console.log(err);
        setLoading(false);
        Alert.alert("Error", err.message);
      }
    }
  };

  const createWalletForCurrentUser = async (userId) => {
    // Create a new wallet
    const wallet = ethers.Wallet.createRandom();

    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

    // Prepare the wallet info
    const walletInfo = {
      walletAddress: wallet.address,
      walletBalance: 0, // Initial balance
      encryptedPrivateKey: encryptedPrivateKey,
    };

    // Save the wallet info to Firestore
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      walletInfo: walletInfo,
    });

    console.log("Wallet created and saved for user:", userId);
  };



  if (status == "none") {
    return <Start status={status} setStatus={setStatus} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <ScrollView
          style={{
            backgroundColor: colors.black,
          }}
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              style={{
                width: 250,
                height: 80,
                tintColor:"purple"
              }}
              resizeMode={"contain"}
              source={require("../../../assets/appRocketLogo.png")}
            />
          </View>
          <View style={{ flex: 1, paddingBottom: 10 }}>
            {resetting ? (
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 20,
                  marginTop: 30,
                  flex: 1,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <BoldMonoText style={{}}>
                    {`RESET YOUR PASSWORD`}
                  </BoldMonoText>
                </View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: 14,
                    marginTop: -80,
                  }}
                >
                  <View style={{}}>
                    <IconInput
                      placeholder={"Email"}
                      value={email}
                      setValue={setEmail}
                      keyboardType={"email-address"}
                      leftAlign={true}
                    />
                  </View>
                </View>

                <LightButton
                  submit={async () => {
                    await sendPasswordResetEmail(auth, email);
                    Alert.alert(
                      "Password Reset",
                      `Reset instructions were sent to ${email}`,
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            setResetting(false);
                          },
                        },
                      ]
                    );
                  }}
                  title={"SUBMIT"}
                  loading={loading}
                  style={{
                    marginBottom: 20,
                    marginTop: 30,
                    marginHorizontal: 14,
                  }}
                />
              </View>
            ) : (
              <SignIn
                status={status}
                submit={submit}
                setStatus={setStatus}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                loading={loading}
              />
            )}
          </View>

          {!resetting ? (
            <TouchableOpacity
              style={{
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={() =>
                status == "signup" ? setStatus("login") : setStatus("signup")
              }
            >
              <BodyText style={{ opacity: 0.5 }}>
                {status == "login"
                  ? `Don't have an account? `
                  : `Already have an account? `}
                <BodyText
                  style={{
                    textDecorationColor: "white",
                    textDecorationLine: "underline",
                  }}
                >
                  {status == "login" ? "Sign up." : `Log In.`}
                </BodyText>
              </BodyText>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {resetting ? (
            <TouchableOpacity
              style={{ alignItems: "center", marginBottom: 20 }}
              onPress={() => {
                setResetting(false);
              }}
            >
              <BodyText
                style={{
                  opacity: 0.5,
                  textDecorationColor: "white",
                  textDecorationLine: "underline",
                }}
              >
                {"Cancel"}
              </BodyText>
            </TouchableOpacity>
          ) : (
            <View style={{ opacity: status == "login" ? 1 : 0 }}>
              <TouchableOpacity
                style={{ alignItems: "center", marginBottom: 20 }}
                onPress={() => {
                  setResetting(true);
                }}
                disabled={status != "login" || resetting}
              >
                <BodyText style={{ opacity: 0.5 }}>
                  {`Forgot your password? `}
                  <BodyText
                    style={{
                      textDecorationColor: "white",
                      textDecorationLine: "underline",
                    }}
                  >
                    {"Reset."}
                  </BodyText>
                </BodyText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
