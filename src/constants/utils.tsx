import { Dimensions } from "react-native";
import * as Device from "expo-device";

export const toArray = (map: any) => {
  return Object.keys(map).map((key) => {
    return { ...map[key], id: key };
  });
};

export const DEFAULT_ID = "-1";

export const toDoubleDigits = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
};

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const IS_ANDROID = Device.brand != "Apple";
export const IS_IOS = Device.brand == "Apple";
export const IS_SIMULATOR = !Device.isDevice;

// tara here today
export const PREMIUM_IS_TURNED_ON = true;

export const alpha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
