import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";

export default function ImageCaptureUploadButton({
  setImageLoading,
  setImageURL,
  setVideoURL,
  base,
  children,
  disabled,
}: {
  setImageLoading: any;
  setImageURL: any;
  base: string;
  children: any;
  setVideoURL?: any;
  disabled?: boolean;
}) {
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showing, setShowing] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestCPermission] = Camera.useCameraPermissions();
  const [mpermission, requestMPermission] = Camera.useMicrophonePermissions();
  const [takingPic, setTakingPic] = useState(false);
  const [camera, setCamera] = useState(null);

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
      setRecordingLoading(true);
      setShowing(false);
      setTakingPic(false);
      setImageURL(data.uri);
      setRecordingLoading(false);
    }
  };

  const startRecording = async () => {
    if (camera) {
      setRecording(true);
      const data = await camera.recordAsync();
      setRecordingLoading(true);
      setShowing(false);
      setVideoURL(data.uri);
      setRecordingLoading(false);
      setRecording(false);
    }
  };

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={async () => {
          await requestMPermission();
          await requestCPermission();
          setShowing(true);
        }}
      >
        {children}
      </TouchableOpacity>

      <Modal visible={showing}>
        <View style={{ flex: 1 }}>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
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
                  paddingTop: 70,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setShowing(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    color="white"
                  />
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
                  <View
                    style={{
                      width: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></View>
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 60,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 30,
                      backgroundColor:
                        recording && !takingPic ? "red" : "white",
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
        </View>
      </Modal>
    </View>
  );
}
