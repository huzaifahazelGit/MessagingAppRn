import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { BodyText } from "../../../components/text";
import AudioUploadButton from "../../../components/upload-wrappers/audio-upload";
import ImageCaptureUploadButton from "../../../components/upload-wrappers/image-capture-upload";
import MicRecordUploadButton from "../../../components/upload-wrappers/mic-record-upload";
import { IS_IOS } from "../../../constants/utils";
import {
  EMPTY_LINKS_OBJ,
  EMPTY_UPLOAD_SELECTION_OBJECT,
  UploadKinds,
  UploadSelectionObject,
} from "../upload-constants";

export const UploadDataSelectorRow = ({
  uploadKinds,
  uploadData,
  setUploadData,
  loading,
  setLoading,
  setShowingLinks,
  onSkip,
}: {
  uploadData: UploadSelectionObject;
  setUploadData: any;
  uploadKinds: UploadKinds[];
  loading: boolean;
  setLoading: any;
  setShowingLinks: any;
  onSkip?: any;
}) => {
  const BUTTON_SIZE = 30;
  const ICON_SIZE = 18;

  const imageUploadsOnly = useMemo(() => {
    if (uploadKinds.length == 1 && uploadKinds[0] == UploadKinds.Image) {
      return true;
    }
    return false;
  }, [uploadKinds]);

  const linksObject = useMemo(() => {
    return uploadData.linksObject;
  }, [uploadData]);

  const isYoutubeLink = useMemo(() => {
    return linksObject && linksObject.youtubeId && linksObject.youtubeId != "";
  }, [linksObject]);

  const isSpotifyLink = useMemo(() => {
    return linksObject && linksObject.spotifyId && linksObject.spotifyId != "";
  }, [linksObject]);

  const isSoundcloudLink = useMemo(() => {
    return (
      linksObject &&
      linksObject.soundcloudLink &&
      linksObject.soundcloudLink != ""
    );
  }, [linksObject]);

  const hasLink = useMemo(() => {
    return isSoundcloudLink || isSpotifyLink || isYoutubeLink;
  }, [isSoundcloudLink, isSpotifyLink, isYoutubeLink]);

  const openCameraModal = async () => {
    try {
      let params = {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [1, 1] as [number, number],
        allowsEditing: IS_IOS ? true : false,
        quality: 0.4,
        base64: false,
      };

      const result = await ImagePicker.launchImageLibraryAsync({
        ...params,
      });
      if (!result.canceled) {
        if (result.assets[0].type == "video") {
          setUploadData({
            ...EMPTY_UPLOAD_SELECTION_OBJECT,
            videoURL: result.assets[0].uri,
          });
        } else {
          setUploadData({
            ...uploadData,
            videoURL: "",
            imageURL: result.assets[0].uri,
          });
        }
      }
    } catch (E) {
      console.log("error", E);
    }
  };

  return (
    <View>
      {imageUploadsOnly ? (
        <View style={{ height: 12 }} />
      ) : hasLink ? (
        <View
          style={{
            alignItems: "flex-end",
            marginRight: 8,
            marginTop: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setUploadData({
                ...uploadData,
                linksObject: EMPTY_LINKS_OBJ,
              });
            }}
            style={{ flexDirection: "row" }}
          >
            <BodyText style={{ marginRight: 4 }}>clear</BodyText>
            <AntDesign name="closecircleo" size={15} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 6,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                    borderRadius: BUTTON_SIZE / 2,
                    borderWidth: 1,
                    borderColor: "white",
                  }}
                  onPress={openCameraModal}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={ICON_SIZE}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {uploadKinds.includes(UploadKinds.Audio) && (
            <View
              style={{
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <AudioUploadButton
                loading={loading}
                setLoading={setLoading}
                audioObject={uploadData.audioObject}
                setAudioObject={(obj) => {
                  if (obj) {
                    setUploadData({
                      ...uploadData,
                      audioObject: {
                        ...obj,
                        downloadable: false,
                        profileDisplay: false,
                      },
                    });
                  }
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: BUTTON_SIZE,
                      height: BUTTON_SIZE,
                      borderRadius: BUTTON_SIZE / 2,
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cassette"
                      size={ICON_SIZE}
                      color="white"
                    />
                  </View>
                </View>
              </AudioUploadButton>
            </View>
          )}

          {uploadKinds.includes(UploadKinds.Microphone) && (
            <View
              style={{
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <MicRecordUploadButton
                loading={loading}
                setLoading={setLoading}
                audioObject={uploadData.audioObject}
                setAudioObject={(obj) => {
                  if (obj) {
                    setUploadData({
                      ...uploadData,
                      audioObject: {
                        ...obj,
                        downloadable: false,
                        profileDisplay: false,
                      },
                    });
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        borderRadius: BUTTON_SIZE / 2,
                        borderWidth: 1,
                        borderColor: "white",
                      }}
                    >
                      <MaterialIcons
                        name="mic"
                        size={ICON_SIZE}
                        color="white"
                      />
                    </View>
                  </View>
                </View>
              </MicRecordUploadButton>
            </View>
          )}

          {uploadKinds.includes(UploadKinds.ImageRecording) && (
            <View
              style={{
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <ImageCaptureUploadButton
                setVideoURL={(item) => {
                  setUploadData({
                    ...uploadData,
                    videoURL: item,
                  });
                }}
                setImageURL={(item) => {
                  setUploadData({
                    ...uploadData,
                    imageURL: item,
                  });
                }}
                setImageLoading={setLoading}
                base={"posts"}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        borderRadius: BUTTON_SIZE / 2,
                        borderWidth: 1,
                        borderColor: "white",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="video-vintage"
                        size={ICON_SIZE}
                        color="white"
                      />
                    </View>
                  </View>
                </View>
              </ImageCaptureUploadButton>
            </View>
          )}

          {!uploadData.audioObject &&
            !uploadData.videoURL &&
            uploadKinds.includes(UploadKinds.Links) && (
              <View
                style={{
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <TouchableOpacity onPress={() => setShowingLinks(true)}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        borderRadius: BUTTON_SIZE / 2,
                        borderWidth: 1,
                        borderColor: "white",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="link-variant"
                        size={ICON_SIZE}
                        color="white"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

          {!uploadData.audioObject &&
            !uploadData.videoURL &&
            !uploadData.imageURL &&
            uploadKinds.includes(UploadKinds.Skip) &&
            onSkip && (
              <View
                style={{
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <TouchableOpacity onPress={onSkip}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: BUTTON_SIZE,
                        height: BUTTON_SIZE,
                        borderRadius: BUTTON_SIZE / 2,
                        borderWidth: 1,
                        borderColor: "white",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="pen-plus"
                        size={ICON_SIZE}
                        style={{ marginLeft: 2 }}
                        color="white"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
        </View>
      )}
    </View>
  );
};
