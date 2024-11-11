import * as ImagePicker from "expo-image-picker";
import { getStorage } from "firebase/storage";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { IS_IOS } from "../../constants/utils";
import { uploadFileAsync } from "../../services/upload-service";

export default function ImageUploadButton({
  setImageLoading,
  setImageURL,
  setVideoURL,
  allowVideo,
  base,
  children,
  disabled,
  limitEditing,
}: {
  setImageLoading: any;
  setImageURL: any;
  base: string;
  children: any;
  setVideoURL?: any;
  allowVideo?: boolean;
  disabled?: boolean;
  limitEditing?: boolean;
}) {
  const addImage = async () => {
    try {
      let params = allowVideo
        ? {
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            base64: false,
            quality: 0.4,
          }
        : {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            allowsEditing: IS_IOS ? (limitEditing ? false : true) : false,
            quality: 0.4,
            base64: false,
          };
      // @ts-ignore
      const result = await ImagePicker.launchImageLibraryAsync({
        ...params,
      });
      if (!result.canceled) {
        setImageLoading(true);
        const uploadUrl = await uploadFileAsync(
          getStorage(),
          result.assets[0].uri,
          base
        );
        if (result.assets[0].type == "video") {
          setImageLoading(false);
          setVideoURL(uploadUrl);
        } else {
          setImageLoading(false);
          setImageURL(uploadUrl);
        }
      }
    } catch (E) {
      setImageLoading(false);
    }
  };

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity disabled={disabled} onPress={addImage}>
        {children}
      </TouchableOpacity>
    </View>
  );
}
