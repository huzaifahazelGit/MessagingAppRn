import { Animated } from "react-native";
import { Session } from "../../models/session";
import { User } from "../../models/user";

export type StoryText = {
  text: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  fontSize: number;
  width: number;
  height: number;
  textBg: boolean;
  textAlign: "flex-start" | "center" | "flex-end";
  color: string;
  ratio: number;
  animRatio: Animated.Value;
  zIndex: number;
};
export type StoryLabel = {
  type: "address" | "people" | "hashtag" | "emoji";
  address_id?: string;
  text: string;
  x: number;
  y: number;
  animX: Animated.Value;
  animY: Animated.Value;
  fontSize: number;
  width: number;
  height: number;
  ratio: number;
  animRatio: Animated.Value;
  zIndex: number;
};
export type StoryProcessedImage = {
  uri: string;
  videoUri?: string;
  width: number;
  height: number;
  ratio: number;
  translateX: number;
  translateY: number;
  rotateDeg: number;
  texts: StoryText[];
  labels: StoryLabel[];
  duration: number;
};
export const textColors = [
  "#000",
  "#fff",
  "#318bfb",
  "#6cc070",
  "#ffcc00",
  "#f37121",
  "#c70039",
  "#512b58",
  "#ff926b",
  "#fff3cd",
  "#ffe277",
  "#4d3e3e",
  "#3f3f44",
];
export const emojiList = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "☺",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙃",
  "🤑",
  "😲",
  "🙁",
  "😖",
  "😞",
  "😟",
  "😤",
  "😢",
  "😭",
  "😦",
  "😧",
  "😨",
  "😩",
  "🤯",
  "😬",
  "😰",
  "😱",
  "😳",
  "🤪",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🤠",
  "🤡",
  "🤥",
  "🤫",
  "🤭",
  "🧐",
  "🤓",
  "🤪",
];

export const storyPermissions = {
  ALL: 1,
  CLOSE_FRIENDS: 2,
};

export type StoryData = {
  sessions: Session[];
  user: User;
};
