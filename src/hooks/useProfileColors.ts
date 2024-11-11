import { useMemo } from "react";
import { colors } from "../constants/colors";
import { User } from "../models/user";

export interface ProfileColors {
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
}

export const DEFAULT_PROFILE_COLORS: ProfileColors = {
  backgroundColor: colors.darkblack,
  buttonColor: colors.blue,
  textColor: "#ffffff",
};

export const BW_PROFILE_COLORS: ProfileColors = {
  backgroundColor: colors.darkblack,
  buttonColor: colors.white,
  textColor: "#ffffff",
};

export const useProfileColors = (
  user: User,
  backgroundDefault?: string,
  buttonDefault?: string,
  textDefault?: string
): ProfileColors => {
  const backgroundColor = useMemo(() => {
    return user && user.backgroundColor
      ? user.backgroundColor
      : backgroundDefault
      ? backgroundDefault
      : colors.darkblack;
  }, [user, backgroundDefault]);

  const buttonColor = useMemo(() => {
    return user && user.buttonColor
      ? user.buttonColor
      : buttonDefault
      ? buttonDefault
      : colors.blue;
  }, [user, buttonDefault]);

  const textColor = useMemo(() => {
    let color =
      user && user.textColor
        ? user.textColor
        : textDefault
        ? textDefault
        : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user, textDefault]);

  return {
    backgroundColor,
    buttonColor,
    textColor,
  };
};
