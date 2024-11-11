import AsyncStorage from "@react-native-async-storage/async-storage";

export const setDidViewPopup = async (popupId: string) => {
  await AsyncStorage.setItem(
    `@realm_${popupId}_closed`,
    new Date().toISOString()
  );
};

export const checkDidViewPopup = async (popupId: string) => {
  const value = await AsyncStorage.getItem(`@realm_${popupId}_closed`);
  if (value !== null) {
    return true;
  } else {
    return false;
  }
};
