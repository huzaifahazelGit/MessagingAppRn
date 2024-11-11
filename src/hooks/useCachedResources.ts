import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      TrackPlayer.setupPlayer();
      try {
        SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          ...Ionicons.font,

          InconsolataSemiBold: require("../../assets/Inconsolata-SemiBold.ttf"),
          InconsolataMedium: require("../../assets/Inconsolata-Medium.ttf"),
          InconsolataBold: require("../../assets/Inconsolata-Bold.ttf"),
          InconsolataBlack: require("../../assets/Inconsolata-Black.ttf"),
          InconsolataLight: require("../../assets/Inconsolata-Light.ttf"),
          InconsolataExtraLight: require("../../assets/Inconsolata-ExtraLight.ttf"),
          InconsolataRegular: require("../../assets/Inconsolata-Regular.ttf"),
          PPSupplyRegular: require("../../assets/PPSupplySans-Regular.otf"),
          PPSupplyBold: require("../../assets/PPSupplySans-Black.otf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
