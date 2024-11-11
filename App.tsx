import 'react-native-gesture-handler'
import { GiphySDK } from "@giphy/react-native-sdk";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import Toast, { BaseToast } from "react-native-toast-message";
import { FirebaseAppProvider } from "reactfire";
import { BoldMonoText } from "./src/components/text";
import { colors } from "./src/constants/colors";
import { GIPHY_KEY } from "./src/constants/env";
import { Fonts } from "./src/constants/fonts";
import { SCREEN_WIDTH } from "./src/constants/utils";
import useCachedResources from "./src/hooks/useCachedResources";
import RootNavigator from "./src/navigation/root";
import ReduxProvider from "./src/providers/redux-provider";
import firebaseConfig from "./src/store/firebase-config";
import AudioProvider from "./src/providers/audio-provider";
import CurrentChallengeProvider from "./src/providers/current-challenge-provider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.blue,
        backgroundColor: colors.black,
        marginHorizontal: 20,
        marginTop: 20,
      }}
      // contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontFamily: Fonts.MonoExtraBold,
        color: "white",
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: Fonts.MonoBold,
        color: "white",
      }}
    />
  ),
  points: ({ text1, text2, props }) => (
    <View style={{ paddingTop: 20 }}>
      <View
        style={{
          width: SCREEN_WIDTH - 60,
          backgroundColor: "#19203A",
          borderRadius: 40,
          borderColor: colors.blue,
          borderWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <BoldMonoText
          style={{
            color: colors.blue,
          }}
        >
          {`${text1}`.toUpperCase()}
        </BoldMonoText>
        <BoldMonoText
          style={{
            color: colors.purple,
          }}
        >{`+ ${text2} XP`}</BoldMonoText>
      </View>
    </View>
  ),
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    // Configure API keys

    GiphySDK.configure({ apiKey: GIPHY_KEY });
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <View style={{ flex: 1, backgroundColor: colors.black }}>
          <ReduxProvider>
            <AudioProvider>
              <CurrentChallengeProvider>
                <RootNavigator />
               
              </CurrentChallengeProvider>
            </AudioProvider>
          </ReduxProvider>
          <StatusBar style="light" />
        </View>
        {/* @ts-ignore  */}
        <Toast config={toastConfig} />
      </FirebaseAppProvider>
    );
  }
}
