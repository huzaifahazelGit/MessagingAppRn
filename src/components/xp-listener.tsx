import { useRecentXP } from "../hooks/useXP";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { XPEarnAction, cleanedXPName } from "../models/xp";
import { useMe } from "../hooks/useMe";
import { DEFAULT_ID } from "../constants/utils";
import { View } from "react-native";

export const XPListener = () => {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  let xp = useRecentXP(userId);
  const [lastXP, setLastXP] = useState(null);

  useEffect(() => {
    if (xp && xp.length > 0) {
      let newXp = xp[0];

      if (lastXP) {
        if (newXp.id != lastXP.id) {
          setLastXP(newXp);
          showToastForXP(newXp);
        }
      } else {
        setLastXP(newXp);
      }
    }
  }, [xp, lastXP]);

  const showToastForXP = async (newXP: XPEarnAction) => {
    if (newXP) {
      Toast.show({
        type: "points",
        text1: cleanedXPName(newXP.kind),
        text2: "1",
      });
    }
  };

  return <View></View>;
};
