import { useNavigation, useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../components/buttons/buttons";
import { Headline } from "../../components/text";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { BookmarksFeed } from "./bookmarks-feed";

export default function BookmarksScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.black,
          paddingTop: insets.top,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 5,
            borderBottomColor: "white",
            borderBottomWidth: 1,
            marginBottom: 6,
          }}
        >
          <View>
            <BackButton />
            <Headline style={{ marginTop: 4 }}>{`SAVED`}</Headline>
          </View>
        </View>

        <BookmarksFeed />
      </View>
    </View>
  );
}
