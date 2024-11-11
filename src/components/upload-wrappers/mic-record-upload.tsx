import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { BodyText, Headline } from "../text";

export default function MicRecordUploadButton({
  loading,
  setLoading,
  audioObject,
  setAudioObject,
  children,
  disabled,
}: {
  loading: boolean;
  setLoading: any;
  audioObject: {
    mimeType: string;
    name: string;
    size: number;
    type: string;
    uri: string;
  };
  setAudioObject: any;
  children: any;
  disabled?: boolean;
}) {
  const [recording, setRecording] = React.useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef(time);
  const [timerId, setTimerId] = useState<any>(null);

  const AUDIO_RECORDER_MODE = {
    allowsRecordingIOS: true,
    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    playsInSilentModeIOS: true,
    playThroughEarpieceAndroid: false,
    shouldDuckAndroid: true,
    staysActiveInBackground: false,
  };

  useEffect(() => {
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync(AUDIO_RECORDER_MODE);
  }, []);

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync(AUDIO_RECORDER_MODE);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setTime(0);

      var timerId = setInterval(() => {
        timerRef.current += 1;

        setTime(timerRef.current);
      }, 1000);
      setTimerId(timerId);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording(save: boolean) {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    clearInterval(timerId);

    if (save) {
      const uri = recording.getURI();

      setAudioObject({
        mimeType: "audio/m4a",
        name: "audio-recording.m4a",
        size: 0,
        type: "audio",
        uri: uri,
      });
      setTime(0);
      setTimerId(null);
      timerRef.current = 0;
      setShowModal(false);
    }
  }

  const minutes = useMemo(() => {
    if (time < 60) {
      return "00";
    } else {
      let val = Math.floor(time / 60);
      if (val < 10) {
        return `0${val}`;
      }
    }
  }, [time]);

  const seconds = useMemo(() => {
    let val = 0;
    if (time < 60) {
      val = time;
    } else {
      val = time % 60;
    }
    if (val < 10) {
      return `0${val}`;
    } else {
      return val;
    }
  }, [time]);

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setShowModal(true);
        }}
      >
        {children}
      </TouchableOpacity>

      <Modal visible={showModal}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Headline>Record Audio</Headline>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              paddingBottom: 100,
            }}
          >
            <Headline
              style={{ marginBottom: 80, fontSize: 100 }}
            >{`${minutes}:${seconds}`}</Headline>
            <TouchableOpacity
              style={{
                width: 90,
                height: 90,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 90 / 2,
                backgroundColor: recording ? "red" : "white",
              }}
              onPress={() => {
                if (recording) {
                  stopRecording(true);
                } else {
                  startRecording();
                }
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              style={{ opacity: 0.6, paddingTop: 20 }}
              onPress={() => {
                stopRecording(false);
                setTime(0);
                setShowModal(false);
              }}
            >
              <BodyText>cancel</BodyText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
