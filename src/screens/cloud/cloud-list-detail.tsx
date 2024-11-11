import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { BackButton } from "../../components/buttons/buttons";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_ANDROID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { PaginatedAudioMetadataList } from "./metadata-list.tsx/audio-metadata-list";
import { PaginatedFileMetadataList } from "./metadata-list.tsx/image-metadata-list";

export default function CloudListScreen() {
  const route = useRoute();
  const params = route.params as any;
  const navigation = useNavigation();
  const me = useMe();
  const kind = params.kind; // Files, Audio, Images, Videos

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.blueblack,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          paddingBottom: 5,
          borderBottomColor: colors.transparentWhite8,
          borderBottomWidth: 1,
        }}
      >
        <BackButton style={{}} />
        <BoldMonoText style={{ marginLeft: 8, marginBottom: 4, fontSize: 16 }}>
          {kind}
        </BoldMonoText>
        <View />
      </View>

      {(kind == "Images" || kind == "Videos") && (
        <PaginatedFileMetadataList
          kind={kind}
          onPressItem={(post) => {
            (navigation as any).navigate("ObjectViewerDetail", {
              postId: post.id,
            });
          }}
        />
      )}

      {kind == "Audio" && <PaginatedAudioMetadataList />}
    </SafeAreaView>
  );
}
