import React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

export const YoutubePlayer = ({ youtubeId, containerWidth, webviewStyles }) => {
  return (
    <WebView
      style={{
        width: containerWidth - 2,
        borderRadius: 8,
        height: (containerWidth - 2) * (9 / 16),
        ...webviewStyles,
      }}
      allowsFullscreenVideo={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      source={{
        uri: `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=0&showinfo=0&controls=1`,
      }}
      allowsInlineMediaPlayback={true}
    />
  );
};

export const SoundcloudPlayer = ({
  soundcloudLink,
  containerWidth,
  webviewStyles,
}) => {
  return (
    <View style={{ ...webviewStyles }}>
      <WebView
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        javaScriptEnabled
        style={{
          height: containerWidth * 0.68,
          width: containerWidth - 2,
          backgroundColor: "black",
          borderRadius: 8,
        }}
        source={{
          html: `<iframe  width="102%" height="${"100%"}" scrolling="no" allowtransparency="true" style="background: #000000; margin-left: -8px; margin-top: -8px;"  frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${soundcloudLink}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe>`,
        }}
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
};
