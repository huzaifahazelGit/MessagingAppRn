import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";

export default function SessionCreate() {
  const [recording, setRecording] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestCPermission] = Camera.useCameraPermissions();
  const [mpermission, requestMPermission] = Camera.useMicrophonePermissions();
  const [takingPic, setTakingPic] = useState(false);
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    requestCPermission();
    requestMPermission();
  }, []);

  function toggleCameraDirection() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const toggleRecording = async () => {
    if (camera && !takingPic) {
      if (recording) {
        setRecording(false);
        await camera.stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const takePhoto = async () => {
    if (camera) {
      setTakingPic(true);
      const data = await camera.takePictureAsync(null);

      setTakingPic(false);
      (navigation as any).navigate("SessionEdit", {
        imageURL: data.uri,
        videoURL: null,
        duration: 10,
        width: data.width ? data.width : SCREEN_WIDTH,
        height: data.height ? data.height : SCREEN_HEIGHT,
      });
    }
  };

  const startRecording = async () => {
    if (camera) {
      setRecording(true);
      let start = new Date();
      const data = await camera.recordAsync({ maxDuration: 20 });
      let end = new Date();
      let duration = (end.getTime() - start.getTime()) / 1000;

      const { uri } = await VideoThumbnails.getThumbnailAsync(data.uri);

      (navigation as any).navigate("SessionEdit", {
        videoURL: data.uri,
        width: data.width ? data.width : SCREEN_WIDTH,
        height: data.height ? data.height : SCREEN_HEIGHT,
        duration: duration,
        imageURL: uri,
      });

      setRecording(false);
    }
  };

  const openCameraRoll = async () => {
    try {
      let params = {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: false,
        quality: 0.4,
        allowsEditing: false,
      };

      // @ts-ignore
      const result = await ImagePicker.launchImageLibraryAsync({
        ...params,
      });

      if (!result.canceled) {
        if (result.assets[0].type == "video") {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            result.assets[0].uri
          );

          (navigation as any).navigate("SessionEdit", {
            videoURL: result.assets[0].uri,
            imageURL: uri,
            duration: result.assets[0].duration / 1000,
            width: result.assets[0].width,
            height: result.assets[0].height,
          });
        } else {
          (navigation as any).navigate("SessionEdit", {
            imageURL: result.assets[0].uri,
            videoURL: null,
            duration: 10,
            width: result.assets[0].width,
            height: result.assets[0].height,
          });
        }
      }
    } catch (E) {
      console.log("error 10");
      console.log(E);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {permission && mpermission ? (
        <Camera
          ref={(ref) => setCamera(ref)}
          style={{ width: SCREEN_WIDTH, flex: 1 }}
          type={type}
        >
          <View
            style={{
              flex: 1,

              paddingHorizontal: 20,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                paddingTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <MaterialCommunityIcons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-end",
                paddingBottom: 50,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={openCameraRoll}
                >
                  <Entypo name="images" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30,
                    backgroundColor: recording && !takingPic ? "red" : "white",
                  }}
                  onLongPress={toggleRecording}
                  onPressOut={toggleRecording}
                  onPress={takePhoto}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={toggleCameraDirection}
                >
                  <MaterialCommunityIcons
                    name="camera-flip"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Camera>
      ) : (
        <View />
      )}
    </View>
  );
}
