import React, { useMemo, useState } from "react";
import { Keyboard, Pressable, ScrollView, TextInput, View } from "react-native";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { UploadObjectPostImagePrevew } from "../select-phase/post-image-preview";
import { UploadSelectionObject } from "../upload-constants";

export const CaptionPhase = ({
  uploadData,
  setUploadData,
}: {
  uploadData: UploadSelectionObject;
  setUploadData: any;
}) => {
  const [focused, setFocused] = useState(false);

  const audioObject = useMemo(() => {
    return uploadData.audioObject;
  }, [uploadData]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
        ></Pressable>

        <View style={{ paddingHorizontal: 8 }}>
          <UploadObjectPostImagePrevew
            uploadData={uploadData}
            setUploadData={setUploadData}
            loading={false}
            width={SCREEN_WIDTH - 56}
            onCrop={null}
          />

          <View style={{ paddingTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 1,
                paddingVertical: 8,
              }}
            >
              <TextInput
                style={[
                  {
                    fontFamily: Fonts.Regular,
                    width: "100%",
                    color: "white",
                  },
                ]}
                multiline={true}
                placeholder={audioObject ? "Track Name" : "Title"}
                placeholderTextColor={colors.white}
                cursorColor={"white"}
                value={audioObject ? audioObject.name : ""}
                onChangeText={(text) =>
                  setUploadData({
                    ...uploadData,
                    audioObject: { ...audioObject, name: text },
                  })
                }
              />
            </View>
          </View>

          {focused ? (
            <Pressable
              style={{
                flex: 1,
                width: SCREEN_WIDTH,
                minHeight: 200,
              }}
              onPress={() => Keyboard.dismiss()}
            ></Pressable>
          ) : (
            <View></View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
