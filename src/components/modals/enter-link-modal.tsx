import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../buttons/buttons";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { IS_IOS, SCREEN_WIDTH } from "../../constants/utils";
import WebView from "react-native-webview";
import {
  EMPTY_LINKS_OBJ,
  TempLinksObject,
} from "../../screens/create/upload-constants";
import { getSpotifyGeneralToken } from "../../services/securestore-service";
import { getSpotifyTrack } from "../../services/spotify-service";

export const EnterLinksModal = ({
  linksObject,
  setLinksObject,
  showingLinks,
  setShowingLinks,
}: {
  linksObject?: TempLinksObject;
  setLinksObject?: any;
  showingLinks: boolean;
  setShowingLinks: any;
}) => {
  const [spotify, setSpotify] = useState("");
  const [spotifyOverride, setSpotifyOverride] = useState("");
  const [soundcloud, setSoundCloud] = useState("");
  const [youtube, setYoutube] = useState("");
  const [openOption, setOpenOption] = useState<
    "spotify" | "soundcloud" | "youtube" | "none"
  >("none");
  const [webViewURL, setWebViewURL] = useState<string | null>(null);
  const [spotifyGeneralToken, setSpotifyGeneralToken] = useState("");
  const [spotifyError, setSpotifyError] = useState(false);
  const [spotifyData, setSpotifyData] = useState(null);

  useEffect(() => {
    fetchSpotifyGeneralToken();
  }, []);

  const fetchSpotifyGeneralToken = async () => {
    let item: any = await getSpotifyGeneralToken();

    if (item) {
      setSpotifyGeneralToken(item);
    } else {
      setSpotifyError(true);
    }
  };

  useEffect(() => {
    if (spotifyGeneralToken && !spotifyError && spotify && !spotifyData) {
      let embedId = getEmbedIdFromSpotifyURL(spotify)
        ? getEmbedIdFromSpotifyURL(spotify)
        : getEmbedIdFromSpotifyURL(spotifyOverride);
      if (embedId) {
        fetchSpotifyTrack(embedId);
      }
    }
  }, [spotifyGeneralToken, spotify, spotifyOverride, spotifyError]);

  const fetchSpotifyTrack = async (spotifyId) => {
    let res: any = await getSpotifyTrack(spotifyId, spotifyGeneralToken);
    if (res && res.album) {
      let images = res.album.images;
      let artists = res.artists || [];
      setSpotifyData({
        image: images && images.length > 1 ? images[1].url : null,

        title: res.name,
        artist: artists.length > 0 ? artists[0].name : null,
        duration: res.duration_ms / 1000,
      });
    } else {
      setSpotifyError(true);
    }
  };

  const getEmbedIdFromYoutubeURL = (url: string) => {
    if (url.includes("v=")) {
      const splitURL = url.split("v=");
      if (splitURL.length > 1) {
        let secondSplit = splitURL[1].split("&");
        return secondSplit[0];
      }
    } else if (url.includes("youtu.be")) {
      const splitURL = url.split("/");
      if (splitURL.length > 1) {
        let secondSplit = splitURL[1].split("?");
        return secondSplit[0];
      }
    }

    return null;
  };

  useEffect(() => {
    if (spotify.includes("spotify.link/")) {
      setWebViewURL(spotify);
    }
  }, [spotify]);

  const getEmbedIdFromSpotifyURL = (url: string) => {
    if (url.includes("spotify.link/")) {
      return null;
    }
    const splitURL = url.split("/track/");
    if (splitURL.length > 1) {
      let secondSplit = splitURL[1].split("?");
      return secondSplit[0];
    }

    return null;
  };

  const valid = useMemo(() => {
    if (openOption == "spotify") {
      return spotifyError || spotifyData != null;
    } else if (openOption == "soundcloud") {
      return true;
    } else if (openOption == "youtube") {
      return getEmbedIdFromYoutubeURL(youtube) != null;
    }
  }, [
    openOption,
    spotify,
    spotifyOverride,
    soundcloud,
    youtube,
    spotifyError,
    spotifyData,
  ]);

  const handleResponse = (data) => {
    if (
      data.url &&
      data.url.includes("open.spotify.com") &&
      data.url.includes("?")
    ) {
      setWebViewURL(null);
      setSpotifyOverride(data.url);
    }
  };

  if (linksObject == undefined) {
    return <View />;
  }

  return (
    <Modal visible={showingLinks}>
      <View
        style={{ position: "absolute", top: 180, left: 0, right: 0, bottom: 0 }}
      >
        {webViewURL && (
          <WebView
            javaScriptEnabled={true}
            onNavigationStateChange={handleResponse}
            source={{ uri: webViewURL }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              backgroundColor: "white",
            }}
          />
        )}
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 40,
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
          <BackButton customBack={() => setShowingLinks(false)} />
          <BoldMonoText style={{}}>{`LINKS`.toUpperCase()}</BoldMonoText>
          <View style={{ width: 30 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={IS_IOS ? "padding" : "height"}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <LabelledPlusTextInput
              title={"SPOTIFY"}
              value={spotify}
              setValue={setSpotify}
              openOption={openOption}
              setOpenOption={setOpenOption}
            />
            <LabelledPlusTextInput
              title={"SOUNDCLOUD"}
              value={soundcloud}
              setValue={setSoundCloud}
              openOption={openOption}
              setOpenOption={setOpenOption}
            />
            <LabelledPlusTextInput
              title={"YOUTUBE"}
              value={youtube}
              setValue={setYoutube}
              openOption={openOption}
              setOpenOption={setOpenOption}
            />
          </View>
          <View>
            <View
              style={{
                zIndex: 1,
                paddingHorizontal: 20,
                paddingBottom: 10,
                opacity: valid ? 1 : 0.5,
              }}
            >
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
                disabled={!valid}
                onPress={() => {
                  switch (openOption) {
                    case "soundcloud":
                      setLinksObject({
                        ...EMPTY_LINKS_OBJ,
                        soundcloudLink: soundcloud,
                      });
                      setShowingLinks(false);
                      break;
                    case "youtube":
                      setLinksObject({
                        ...EMPTY_LINKS_OBJ,
                        youtubeId: getEmbedIdFromYoutubeURL(youtube),
                      });
                      setShowingLinks(false);
                      break;
                    case "spotify":
                      let spotifyId =
                        getEmbedIdFromSpotifyURL(spotify) ??
                        getEmbedIdFromSpotifyURL(spotifyOverride);

                      setLinksObject({
                        ...EMPTY_LINKS_OBJ,
                        spotifyId: spotifyId,
                        ...spotifyData,
                      });
                      setShowingLinks(false);
                      break;
                  }
                }}
              >
                <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

function LabelledPlusTextInput({
  title,
  value,
  setValue,
  openOption,
  setOpenOption,
}: {
  title: string;
  value: string;
  setValue: any;
  openOption: "spotify" | "soundcloud" | "youtube" | "other" | "none";
  setOpenOption: any;
}) {
  const placeholderText = useMemo(() => {
    return `www.${title.toLowerCase()}.com/song-link`;
  }, [title]);

  const isOpen = useMemo(() => {
    return openOption == title.toLowerCase();
  }, [title, openOption]);

  return (
    <View style={{ marginVertical: 12 }}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
        onPress={() =>
          isOpen ? setOpenOption("none") : setOpenOption(title.toLowerCase())
        }
      >
        {isOpen ? (
          <AntDesign name="minuscircleo" size={18} color="white" />
        ) : (
          <AntDesign name="pluscircleo" size={18} color="white" />
        )}
        <BodyText
          style={{ fontSize: 18, fontFamily: Fonts.MonoBold, marginLeft: 8 }}
        >
          {title}
        </BodyText>
      </TouchableOpacity>

      {isOpen ? (
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
      ) : (
        <View />
      )}
    </View>
  );
}
