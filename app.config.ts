import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  privacy: "public",
  name: "Realm",
  slug: "realm",
  version: "1.0.1",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  scheme: "realmapp",
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          buildToolsVersion: "33.0.0",
          kotlinVersion: "1.6.20",
        },
        ios: {
          deploymentTarget: "13.0",
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true,
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow Realm to access your camera.",
      },
    ],
    [
      "expo-screen-orientation",
      {
        initialOrientation: "PORTRAIT_UP",
      },
    ],
    // Stripe configuration
    [
      "@stripe/stripe-react-native",
      {
        merchantIdentifier: "Realm",
        //  urlScheme: "your-url-scheme",
      },
    ],
    [
      "expo-calendar",
      {
        calendarPermission: "The app needs to access your calendar.",
      },
    ],
  ],
  splash: {
    image: "./assets/realm-start-background.png",
    resizeMode: "cover",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    config: {
      usesNonExemptEncryption: false,
    },
    requireFullScreen: true,
    jsEngine: "hermes",
    infoPlist: {
      FirebaseDynamicLinksCustomDomains: ["https://realm.page.link"],
      UIBackgroundModes: ["remote-notification", "fetch", "audio"],
      NSCameraUsageDescription:
        "Allow Realm to access your camera for adding post images or community videos.",
      NSContactsUsageDescription:
        "Allow Realm to access your contacts for referring friends",
      NSFaceIDUsageDescription: "Allow Realm to use Face ID for easier login",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Turning on location services allows us to help you find nearby challenges.",
      NSLocationAlwaysUsageDescription:
        "Turning on location services allows us to help you find nearby challenges.",
      NSLocationWhenInUseUsageDescription:
        "Turning on location services allows us to help you find nearby challenges.",
      NSMicrophoneUsageDescription:
        "Allow Realm to access your microphone for adding community videos.",
      NSPhotoLibraryAddUsageDescription:
        "Allow Realm to save photos for uploading new posts",
      NSPhotoLibraryUsageDescription:
        "Allow Realm to access your photos for uploading new posts",
      UISupportsDocumentBrowser: true,
      UIFileSharingEnabled: true,
      LSSupportsOpeningDocumentsInPlace: true,
      LSApplicationQueriesSchemes: [
        "instagram-stories",
        "instagram",
        "spotify",
      ],
      NSCalendarsUsageDescription: "Allow App Rocket to access your calendar",
      NSRemindersUsageDescription: "Allow App Rocket to access your reminder",
    },
    associatedDomains: [
      "applinks:realm.page.link",
      "applinks:com.tarawilson.realm.app.goo.gl",
    ],
    bundleIdentifier: "com.tarawilson.realm",
    buildNumber: "48",
    googleServicesFile: "./GoogleService-Info.plist",
    supportsTablet: true,
  },
  android: {
    jsEngine: "jsc",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.tarawilson.realm",
    googleServicesFile: "./google-services.json",
    versionCode: 48,
    permissions: ["RECORD_AUDIO"],
  },
  updates: {
    url: "https://u.06e0ab75-4b4d-44c5-be0f-06fdf1e77a4f",
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 10000,
  },
  runtimeVersion: "1.0.0",
  extra: {
    eas: {
      projectId: "06e0ab75-4b4d-44c5-be0f-06fdf1e77a4f",
    },
  },
});
