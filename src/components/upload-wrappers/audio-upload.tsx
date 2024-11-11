import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useMe } from "../../hooks/useMe";

export default function AudioUploadButton({
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
  const addAudioFile = async () => {
    try {
      let doc = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ["audio/*", "*/wav"],
      });

      if (doc.type != "cancel") {
        if ((doc as any).size > 10000000) {
          alert("File too large.");
          setLoading(false);
          return;
        }
        setLoading(false);
        setAudioObject({ ...doc, downloadable: false, profileDisplay: false });
      }
    } catch (e) {
      console.log("error 1");
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity disabled={disabled} onPress={addAudioFile}>
        {children}
      </TouchableOpacity>
    </View>
  );
}
