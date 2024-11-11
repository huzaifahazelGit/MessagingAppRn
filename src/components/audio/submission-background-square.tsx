import { View } from "react-native";
import { SCREEN_WIDTH } from "../../constants/utils";
import { SoundcloudPlayer, YoutubePlayer } from "./links-players";
import { useMemo } from "react";
import { Image } from "expo-image";
import EmptyAudioBackground from "../images/empty-audio-background";
import { SpotifyPlayer } from "./spotify-player";
import { Submission } from "../../models/submission";

export const SubmissionBackgroundSquare = ({
  submission,
  skipFakeBackground,
  width,
}: {
  submission: Submission;
  skipFakeBackground?: boolean;
  width?: number;
}) => {
  const coverImage = useMemo(() => {
    if (submission && submission.image) {
      return { uri: submission.image };
    }
    if (!skipFakeBackground && submission && submission.imageNumber) {
      switch (submission.imageNumber) {
        case 1:
          return require("../../../assets/rand-image-1.jpeg");
        case 2:
          return require("../../../assets/rand-image-2.jpeg");
        case 3:
          return require("../../../assets/rand-image-3.jpeg");
        case 4:
          return require("../../../assets/rand-image-4.jpeg");
        case 5:
          return require("../../../assets/rand-image-5.jpeg");
        case 6:
          return require("../../../assets/rand-image-6.jpeg");
        case 7:
          return require("../../../assets/rand-image-7.jpeg");
        case 8:
          return require("../../../assets/rand-image-8.jpeg");
        case 9:
          return require("../../../assets/rand-image-9.jpeg");
        case 10:
          return require("../../../assets/rand-image-10.jpeg");
        case 11:
          return require("../../../assets/rand-image-11.jpeg");
        case 12:
          return require("../../../assets/rand-image-12.png");
        case 13:
          return require("../../../assets/rand-image-13.png");
        case 14:
          return require("../../../assets/rand-image-14.png");
        case 15:
          return require("../../../assets/rand-image-15.png");
        case 16:
          return require("../../../assets/rand-image-16.png");
        case 17:
          return require("../../../assets/rand-image-17.png");
        case 18:
          return require("../../../assets/rand-image-18.png");
        case 19:
          return require("../../../assets/rand-image-19.png");
        case 20:
          return require("../../../assets/rand-image-20.png");
        case 21:
          return require("../../../assets/rand-image-21.png");
        case 22:
          return require("../../../assets/rand-image-22.png");
        case 23:
          return require("../../../assets/rand-image-23.png");
        case 24:
          return require("../../../assets/rand-image-24.png");
        case 25:
          return require("../../../assets/rand-image-25.png");
        case 26:
          return require("../../../assets/rand-image-26.png");
        case 27:
          return require("../../../assets/rand-image-27.png");
        case 28:
          return require("../../../assets/rand-image-28.png");
        case 29:
          return require("../../../assets/rand-image-29.png");
        case 30:
          return require("../../../assets/rand-image-30.png");
      }
    }

    return require("../../../assets/rand-image-12.png");
  }, [submission]);

  let squareWidth = width ? width : (SCREEN_WIDTH - 30) / 2;
  return (
    <View>
      {submission.soundcloudLink ? (
        <View
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <SoundcloudPlayer
            soundcloudLink={submission.soundcloudLink}
            containerWidth={SCREEN_WIDTH / 2 + 90}
            webviewStyles={{
              width: squareWidth,
              height: squareWidth,
            }}
          />
        </View>
      ) : submission.spotifyId ? (
        <View
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundColor: "#282828",
            overflow: "hidden",
          }}
        >
          <SpotifyPlayer
            spotifyId={submission.spotifyId}
            post={submission as any}
            containerWidth={SCREEN_WIDTH - 20}
            smallVersion={true}
          />
        </View>
      ) : submission.youtubeId ? (
        <View
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <YoutubePlayer
            youtubeId={submission.youtubeId}
            containerWidth={squareWidth - 4}
            webviewStyles={{
              width: squareWidth,
              height: squareWidth,
            }}
          />
        </View>
      ) : coverImage ? (
        <Image
          style={{
            width: squareWidth,
            height: squareWidth,
          }}
          source={coverImage}
          transition={500}
        />
      ) : (
        <EmptyAudioBackground size={squareWidth - 2} />
      )}
    </View>
  );
};
