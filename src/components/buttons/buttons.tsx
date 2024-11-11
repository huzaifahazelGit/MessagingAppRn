import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { BodyText, BoldMonoText, BoldText, LightText } from "../text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";
import * as ScreenOrientation from "expo-screen-orientation";

export const LightButton = ({
  style,
  submit,
  title,
  loading,
  disabled,
  outline,
  color,
  textColor,
}: {
  style?: any;
  submit: any;
  title: string;
  loading: boolean;
  disabled?: boolean;
  outline?: boolean;
  color?: string;
  textColor?: string;
}) => {
  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        style={{
          backgroundColor: outline
            ? colors.transparent
            : color
            ? color
            : colors.blue,
          borderWidth: 2,
          borderColor: color ? color : colors.blue,
          borderRadius: 24,
          paddingVertical: 12,
          justifyContent: "center",
          alignItems: "center",
          ...style,
        }}
        onPress={submit}
        disabled={disabled}
      >
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <BoldMonoText
            style={{
              fontSize: 20,
              color: textColor
                ? textColor
                : outline
                ? color
                  ? color
                  : colors.blue
                : colors.white,
            }}
          >
            {`${title}`.toUpperCase()}
          </BoldMonoText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const BackButton = ({
  style,
  customBack,
  buttonColor,
}: {
  style?: any;
  customBack?: any;
  buttonColor?: string;
}) => {
  const navigation = useNavigation();

  const goBackWithLock = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      style={{
        width: 50,
        // paddingVertical: 8,
        justifyContent: "center",
        // alignItems: "center",
        ...style,
      }}
      onPress={() => {
        customBack ? customBack() : goBackWithLock();
      }}
    >
      <Ionicons
        name="arrow-back"
        size={30}
        color={buttonColor ?? colors.blue}
      />
    </TouchableOpacity>
  );
};

export const CloseButton = ({
  style,
  customBack,
  buttonColor,
}: {
  style?: any;
  customBack?: any;
  buttonColor?: string;
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        width: 50,
        alignItems: "flex-end",
        ...style,
      }}
      onPress={() => {
        customBack ? customBack() : navigation.goBack();
      }}
    >
      <Ionicons name="close" size={30} color={buttonColor ?? colors.blue} />
    </TouchableOpacity>
  );
};

export const OutlineButton = ({
  style,
  submit,
  title,
  loading,
  disabled,
  textStyle,
}: {
  style?: any;
  submit: any;
  title: string;
  loading: boolean;
  disabled?: boolean;
  textStyle?: any;
}) => {
  return (
    <View
      style={{
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 20,
        ...style,
      }}
    >
      <TouchableOpacity
        onPress={submit}
        style={{
          justifyContent: "center",
          alignItems: "center",
          minWidth: 70,
          minHeight: 30,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <BoldText
            style={{
              paddingVertical: 2,

              paddingHorizontal: 16,
              ...textStyle,
            }}
          >
            {`${title}`.toUpperCase()}
          </BoldText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const PressableOutlineButton = ({
  style,
  submit,
  title,
  loading,
  disabled,
  textStyle,
}: {
  style?: any;
  submit: any;
  title: string;
  loading: boolean;
  disabled?: boolean;
  textStyle?: any;
}) => {
  return (
    <View
      style={{
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 20,
        ...style,
      }}
    >
      <Pressable
        onPress={submit}
        style={{
          justifyContent: "center",
          alignItems: "center",
          minWidth: 70,
          minHeight: 30,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <BoldText
            style={{
              paddingVertical: 2,

              paddingHorizontal: 16,
              ...textStyle,
            }}
          >
            {`${title}`.toUpperCase()}
          </BoldText>
        )}
      </Pressable>
    </View>
  );
};

export const NumbersButton = ({
  style,
  submit,
  number,
  title,
  loading,

  color,
}: {
  style?: any;
  submit: any;
  number: string;
  title: string;
  loading: boolean;

  color: string;
}) => {
  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={submit}
        style={{
          ...style,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <BodyText
              style={{ fontSize: 22, color: color, fontFamily: Fonts.MonoBold }}
            >
              {number}
            </BodyText>
            <LightText
              style={{ fontSize: 13, color: color, fontFamily: Fonts.MonoBold }}
            >
              {title.toUpperCase()}
            </LightText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
