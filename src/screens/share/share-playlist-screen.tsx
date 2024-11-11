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
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import ProfileImage from "../../components/images/profile-image";
import NavBar from "../../components/navbar";
import { BodyText, BoldMonoText } from "../../components/text";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { XPKind } from "../../models/xp";
import { createPlaylistLink } from "../../services/link-service";

export default function SharePlaylistScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as any;
  const playlistId = params.playlistId;
  const [image, setImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    let didSetImage = false;
    if (params.currentTrack) {
      let currentTrack = JSON.parse(params.currentTrack);

      if (currentTrack.artwork) {
        setImage(currentTrack.artwork);
        didSetImage = true;
      }
    }
    let songs = JSON.parse(params.songs);
    songs.forEach((song) => {
      if (song.image) {
        if (!didSetImage) {
          setImage(song.image);
          didSetImage = true;
        } else {
          setSecondImage(song.image);
        }
      }
    });

    lockOrientation();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      startShare();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const startShare = async () => {
    let link = createPlaylistLink(playlistId, me.id);
    try {
      await Share.open({ url: link });
    } catch (error) {
      console.log("error 8");
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <NavBar includeBack={true} title="SHARE JUKEBOX" skipTitle={true} />
      <View style={{ flex: 1, alignItems: "center" }}>
        <BoldMonoText
          style={{
            textAlign: "center",
            fontSize: 22,
            marginBottom: 12,
            color: "white",
          }}
        >
          SHARE JUKEBOX
        </BoldMonoText>
        {secondImage ? (
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: image }}
              style={{
                width: 235,
                height: 235,
                zIndex: 2,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 6,
              }}
            />
            <Image
              source={{ uri: secondImage }}
              style={{
                width: 235,
                height: 235,
                marginLeft: -220,
                marginTop: 15,
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 6,
              }}
            />
          </View>
        ) : (
          <Image source={{ uri: image }} style={{ width: 235, height: 235 }} />
        )}
      </View>
    </SafeAreaView>
  );
}
