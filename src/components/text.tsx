import { Text, View,StyleProp,TextStyle } from "react-native";
import { colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

export function BodyText({
  style,
  children,
  fontsize,
  numLines,
}: {
  style?: any;
  children: any;
  fontsize?: number;
  numLines?: number;
}) {
  return (
    <Text
      style={{
        fontFamily: Fonts.Regular,
        color: "#fff",
        fontSize: fontsize ? fontsize : 12,
        ...style,
      }}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
}

export function ArenaHeadlineText({
  style,
  children,
  fontsize,
  numLines,
}: {
  style?: any;
  children: any;
  fontsize?: number;
  numLines?: number;
}) {
  return (
    <Text
      style={{
        fontFamily: Fonts.MonoSansBold,
        color: "#fff",
        fontSize: fontsize ? fontsize : 60,
        ...style,
      }}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
}

export function SimpleMonoText({
  style,
  children,
  numLines,
}: {
  style?: StyleProp<TextStyle>;
  children: any;
  numLines?: number;
}) {
  return (
    <Text
      style={{ fontFamily: Fonts.MonoSans, color: "#fff", ...style }}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
}

export function BoldMonoText({
  style,
  children,
  numLines,
  adjustsFontSizeToFit,
}: {
  style?: StyleProp<TextStyle>;
  children: any;
  numLines?: number;
  adjustsFontSizeToFit?: boolean;
}) {
  return (
    <Text
      style={{ fontFamily: Fonts.MonoBold, color: "#fff", ...style }}
      adjustsFontSizeToFit={adjustsFontSizeToFit ? adjustsFontSizeToFit : false}
      numberOfLines={numLines}
    >
      {children}
    </Text>
  );
}

export function ExtraBoldMonoText({
  style,
  children,
}: {
  style?: any;
  children: any;
}) {
  return (
    <Text style={{ fontFamily: Fonts.MonoExtraBold, color: "#fff", ...style }}>
      {children}
    </Text>
  );
}

export function BoldText({ style, children }: { style?: any; children: any }) {
  return (
    <Text style={{ fontFamily: Fonts.SemiBold, color: "#fff", ...style }}>
      {children}
    </Text>
  );
}

export function LightText({ style, children }: { style?: any; children: any }) {
  return (
    <Text style={{ fontFamily: Fonts.Light, color: "#fff", ...style }}>
      {children}
    </Text>
  );
}

export function Headline({ style, children }: { style?: any; children: any }) {
  return (
    <Text
      style={{
        fontFamily: Fonts.MonoBold,
        color: "#fff",
        fontSize: 24,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
