import React from "react";
import { Linking, View } from "react-native";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import ChatAudioPlayer from "../../../../components/audio/chat-audio-player";
import { useMe } from "../../../../hooks/useMe";

export default function ChatAudio({ props }) {
  const me = useMe();
  const [downloading, setDownlaoding] = React.useState(false);

  const downloadAudioFile = () => {
    setDownlaoding(true);
    let audio = props.currentMessage.audio;
    let uploadTitle = props.currentMessage.audioTitle;
    let extOne = audio.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    if (uploadTitle.includes(ext)) {
      ext = "";
    }
    const path = `${DocumentDirectoryPath}/${uploadTitle || "audio"}${ext}`;

    let filesPath = `shareddocuments://${path}`;

    const response = downloadFile({
      fromUrl: audio,
      toFile: path,
    });
    response.promise
      .then(async (res) => {
        setDownlaoding(false);
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          Linking.openURL(filesPath);
        } else {
        }
      })
      .catch((error) => {
        setDownlaoding(false);
        console.log("error 3");
        console.log(error);
      });
  };

  return (
    <View
      style={
        props.currentMessage.userId == me.id
          ? { paddingHorizontal: 20 }
          : {
              paddingHorizontal: 20,
            }
      }
    >
      <ChatAudioPlayer
        audioTitle={props.currentMessage.audioTitle}
        audioUrl={props.currentMessage.audio}
        itemId={props.currentMessage._id}
        senderIsMe={props.currentMessage.userId == me.id}
        downloading={downloading}
        downloadAudioFile={downloadAudioFile}
      />
    </View>
  );
}
