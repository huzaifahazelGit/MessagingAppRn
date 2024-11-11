import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";

export default function DoubleTap({ children, onDoubleTap }) {
  const [lastTap, setLastTap] = useState(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      onDoubleTap();
    } else {
      setLastTap(now);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
}
