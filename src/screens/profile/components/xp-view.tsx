import React, { useMemo } from "react";
import { View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { User } from "../../../models/user";
import { GeneralDataStore } from "../../../store/general-data-store";

export default function XPView({
  user,
  large,
}: {
  user?: User;
  large?: boolean;
}) {
  const xpMax = GeneralDataStore.useState((s) => s.xpMax);

  const textColor = useMemo(() => {
    return user && user.textColor ? user.textColor : colors.white;
  }, [user]);

  const buttonColor = useMemo(() => {
    return user && user.buttonColor ? user.buttonColor : colors.blue;
  }, [user]);

  const percentFilled = useMemo(() => {
    if (!user) {
      return 0;
    }

    if (!xpMax || isNaN(xpMax)) {
      return 0;
    }
    if (xpMax < 0) {
      return 0;
    }

    let currentPerc = user.xp / xpMax;
    // console.log("currentPerc", currentPerc);
    if (isNaN(currentPerc)) {
      return 0;
    }
    if (currentPerc < 0.1) {
      return 0.1;
    }
    if (currentPerc < 0.7) {
      return currentPerc + 0.1;
    }
    return currentPerc;
  }, [user, xpMax]);

  const roundedXP = useMemo(() => {
    if (user && user.xp) {
      let val = Math.round(user.xp);
      if (!isNaN(val)) {
        return val;
      }
    }
    return 0;
  }, [user?.xp]);

  if (!user) {
    return <View />;
  }

  if (large) {
    return (
      <View
        style={{
          marginTop: 12,
          width: "100%",
          paddingHorizontal: 20,
          alignItems: "flex-end",
        }}
      >
        <XPBar
          borderColor={colors.blue}
          height={27}
          width={SCREEN_WIDTH * 0.8}
          percentFilled={percentFilled}
        />
      </View>
    );
  }

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BoldMonoText style={{ marginBottom: 4, color: textColor }}>{`${
          user.rank ? `#${user.rank}` : ""
        }`}</BoldMonoText>

        <BoldMonoText
          style={{ marginBottom: 4, color: textColor }}
        >{`${roundedXP} XP`}</BoldMonoText>
      </View>
      <XPBar
        borderColor={buttonColor}
        height={10}
        width={120}
        percentFilled={percentFilled}
        customColors={[buttonColor, textColor]}
        borderWidth={1}
      />
    </View>
  );
}

export const XPBar = ({
  borderColor,
  height,
  width,
  percentFilled,
  customColors,
  borderWidth,
  longerColorOne,
}: {
  borderColor: string;
  height: number;
  width: number;
  percentFilled: number;
  customColors?: string[];
  borderWidth?: number;
  longerColorOne?: boolean;
}) => {
  var borderNumber = borderWidth ? borderWidth : 2;

  const cleanedPercent = useMemo(() => {
    if (!isNaN(percentFilled)) {
      return percentFilled;
    } else {
      return 0;
    }
  }, [percentFilled]);
  return (
    <View
      style={{
        width: width,
        height: height,
        borderWidth: borderNumber,
        borderColor: borderColor,
        borderRadius: height,
      }}
    >
      <LinearGradient
        style={{
          width: width * cleanedPercent,
          height: height - 2 * borderNumber,

          borderRadius: height,
        }}
        start={longerColorOne ? { x: 0.6, y: 0.2 } : { x: 0.1, y: 0.2 }}
        end={{ x: 0.9, y: 1.0 }}
        colors={customColors ? customColors : [colors.purple, colors.blue]}
      ></LinearGradient>
    </View>
  );
};
