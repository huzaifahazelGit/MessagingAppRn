import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { SCREEN_WIDTH } from "../../constants/utils";
import { getResizedImage } from "../../services/utils";

export default function ReloadableImage({
  imageURL,
  fullWidth,
}: {
  imageURL: string;
  fullWidth: number;
}) {
  const [didError, setDidError] = useState(false);

  const updatedImageURL = useMemo(() => {
    if (imageURL) {
      if (!didError) {
        return getResizedImage(imageURL);
      } else {
        return imageURL;
      }
    }
    return null;
  }, [imageURL, didError]);

  var imageWidth = useMemo(() => {
    if (fullWidth && !isNaN(fullWidth)) {
      return fullWidth;
    } else {
      return SCREEN_WIDTH - 90;
    }
  }, [fullWidth, SCREEN_WIDTH]);

  return (
    <Image
      style={{
        width: imageWidth,
        height: imageWidth,
        borderRadius: 8,
      }}
      source={{ uri: updatedImageURL }}
      contentFit={"cover"}
      onError={(err) => {
        setDidError(true);
      }}
    />
  );
}
