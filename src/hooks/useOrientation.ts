import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";

export const useOrientation = (): ScreenOrientation.Orientation => {
  const [orientation, setOrientation] = useState(null);
  useEffect(() => {
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);

  const checkOrientation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    // console.log("checkOrientation", orientation);
    setOrientation(orientation);
  };
  const handleOrientationChange = (o) => {
    // console.log("handleOrientationChange", o.orientationInfo.orientation);
    setOrientation(o.orientationInfo.orientation);
  };

  return orientation;
};
