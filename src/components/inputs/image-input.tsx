import { AntDesign, Entypo } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";
import { colors } from "../../constants/colors";
import ImageUploadButton from "../upload-wrappers/image-upload";

export default function ImageInput({
  imageLoading,
  setImageLoading,
  imageURL,
  setImageURL,
  width,
  height,
  customBackground,
  base,
  initialImage,
  plusStyle,
}: {
  imageLoading: boolean;
  setImageLoading: any;
  imageURL: string;
  setImageURL: any;
  width: number;
  height: number;
  customBackground?: any;
  base: string;
  initialImage?: string;
  plusStyle?: boolean;
}) {
  return (
    <View
      style={{
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageUploadButton
        setImageLoading={setImageLoading}
        setImageURL={setImageURL}
        base={base}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginLeft: 15,
          }}
        >
          {imageLoading ? (
            <View
              style={{
                width: width,
                height: height,
                borderRadius: width == height ? width / 2 : 6,
                borderColor: "white",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator />
            </View>
          ) : customBackground ? (
            customBackground
          ) : (
            <View
              style={{
                width: width,
                height: height,
                borderRadius: width == height ? width / 2 : 6,

                backgroundColor: plusStyle
                  ? colors.transparent
                  : colors.lightblack,
              }}
            >
              {imageURL || initialImage ? (
                <Image
                  source={{ uri: imageURL || initialImage }}
                  style={{
                    backgroundColor: "white",
                    width: width,
                    height: height,
                    borderRadius: width == height ? width / 2 : 6,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: width,
                    height: height,
                    borderRadius: width == height ? width / 2 : 6,
                    borderColor: "white",
                    borderWidth: plusStyle ? 2 : 0,
                    backgroundColor: plusStyle
                      ? colors.transparent
                      : colors.white,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {plusStyle ? (
                    <AntDesign name="plus" size={60} color="white" />
                  ) : (
                    <AntDesign name="picture" size={40} color="black" />
                  )}
                </View>
              )}
            </View>
          )}
          {plusStyle ? (
            <View />
          ) : (
            <View
              style={{
                backgroundColor: "black",
                borderColor: "white",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                marginLeft: -15,
                marginBottom: -10,
              }}
            >
              <Entypo name="camera" size={14} color="white" />
            </View>
          )}
        </View>
      </ImageUploadButton>
    </View>
  );
}
