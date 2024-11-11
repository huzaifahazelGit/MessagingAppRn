import { NativeModules, ScrollView, TouchableOpacity } from "react-native";
const { AudioDataModule } = NativeModules;
import Slider from "@react-native-community/slider";
import { mean } from "d3-array";
import { scaleLinear } from "d3-scale";
import _ from "lodash";
import * as React from "react";
import { View } from "react-native";
import { SCREEN_WIDTH } from "../constants/utils";
import { Post } from "../models/post";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import { colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { useCurrentTrack } from "../hooks/useCurrentTrack";
import TrackPlayer, {
  useProgress,
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { BodyText, BoldMonoText } from "./text";
import { Ionicons } from "@expo/vector-icons";

export default function WaveformContainer({ post }: { post: Post }) {
  const [samples, setSamples] = React.useState([]);
  const [sampleMax, setSampleMax] = React.useState(20);
  const [duration, setDuration] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [didSetUp, setDidSetUp] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [didAutoPlay, setDidAutoPlay] = useState(false);
  const track = useCurrentTrack();
  const progress = useProgress();

  React.useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    console.log("fetch samples...");
    let extOne = post.audio.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    const path = `file://${DocumentDirectoryPath}/${post.id}${ext}`;

    const response = downloadFile({
      fromUrl: post.audio,
      toFile: path,
    });

    response.promise
      .then(async (res) => {
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          try {
            let res = await AudioDataModule.getWaveformData(path);

            let samples = res.samples.filter(
              (item: any) => item && item != undefined
            );

            setSamples(samples);
            setSampleMax(res.sampleMax);
          } catch (err) {
            console.log("fetchSamples error", err);
          }
        } else {
          console.log("error 2");
        }
      })
      .catch((error) => {
        console.log("error 6");
        console.log(error);
      });
  };

  const waveWidth = () => {
    let width = SCREEN_WIDTH * 4;
    if (samples && samples.length > 0) {
      let totalItems = width / 3;
      let chunksize = Math.ceil((samples || []).length / totalItems);
      let totalNum = Math.ceil((samples || []).length / chunksize);
      return totalNum * 3;
    }
    return width;
  };

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      if (
        (event as any).state == "paused" &&
        Math.floor(progress.position) >= Math.floor(progress.duration - 1)
      ) {
        setIsPlaying(false);
        seekTrackPlayer(0);
      }
    }
  });

  useEffect(() => {
    if (isPlaying) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isPlaying]);

  const togglePlay = async () => {
    if (isPlaying) {
      pauseTrack();
    } else if (!didSetUp) {
      setUpAudio();
    } else {
      playTrack();
    }
  };

  const pauseTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const playTrack = async () => {
    let queue = await TrackPlayer.getQueue();
    if (!queue || queue.length == 0) {
      setUpAudio();
      return;
    }
    let res = await TrackPlayer.play();
    setIsPlaying(true);
  };

  const seekTrackPlayer = async (millis: number) => {
    TrackPlayer.seekTo(millis);
  };

  const setUpAudio = async () => {
    // console.log("start setUpAudio", post.uploadTitle);
    setLoading(true);
    await TrackPlayer.reset();

    const track = {
      url: post.audio,
      title: post.uploadTitle,
      artist: post.username,

      artwork: post.image ? post.image : undefined,
      id: post.id,
    };

    await TrackPlayer.add([track]);

    TrackPlayer.play();
    setIsPlaying(true);
    setLoading(false);
    setDidSetUp(true);
    fetchDuration();
    // console.log("finish setUpAudio", post.uploadTitle);
    setTimeout(() => {
      fetchDuration();
    }, 2500);
  };

  const fetchDuration = async () => {
    if (duration == 0) {
      let d = await TrackPlayer.getDuration();
      setDuration(d);
    }
  };

  return (
    <>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingStart: SCREEN_WIDTH / 2,
            paddingEnd: SCREEN_WIDTH / 2,
          }}
        >
          <View
            style={{
              width: waveWidth(),
            }}
          >
            {samples && samples.length > 0 && (
              <View
                style={{
                  marginBottom: 10,
                  width: waveWidth(),
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                  }}
                >
                  <Waveform
                    height={35}
                    sampleMax={sampleMax}
                    width={waveWidth()}
                    percentPlayable={1}
                    percentPlayed={
                      progress.position /
                      (progress.duration ? progress.duration : 1)
                    }
                    inverse={true}
                    waveform={samples}
                  />
                </View>
                {/* <View
                  style={{
                    // marginTop: -20,
                    zIndex: 2,
                    // justifyContent: "center",
                    width: waveWidth(),

                    // marginRight:  -6,
                  }}
                >
                  <Slider
                    style={{
                      width: waveWidth(),
                      height: 3,
                      marginTop: 15,
                    }}
                    minimumValue={0}
                    maximumValue={90}
                    minimumTrackTintColor={colors.white}
                    maximumTrackTintColor={"rgba(256, 256, 256, 0.5)"}
                    value={
                      didSetUp && duration > 0 ? progress.position || 0 : 0
                    }
                    onSlidingComplete={(millis: number) => {
                      seekTrackPlayer(millis);
                    }}
                    thumbImage={require("../../assets/trans-thumb.png")}
                  />
                </View> */}
                <View
                  style={{
                    position: "absolute",

                    top: 35,
                  }}
                >
                  <Waveform
                    height={35}
                    width={waveWidth()}
                    sampleMax={sampleMax}
                    percentPlayable={1}
                    percentPlayed={
                      progress.position /
                      (progress.duration ? progress.duration : 1)
                    }
                    inverse={false}
                    waveform={samples}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <View
          style={{
            height: 60,
            paddingTop: 5,
            width: SCREEN_WIDTH,
            paddingHorizontal: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.blue,
              paddingHorizontal: 24,
              borderRadius: 20,
              paddingVertical: 8,
            }}
          >
            <BoldMonoText style={{ color: "black" }}>SHARE</BoldMonoText>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlay} style={{}}>
            {isPlaying ? (
              <Ionicons name="pause" color={colors.blue} size={26} />
            ) : (
              <Ionicons name="play" color={colors.blue} size={26} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

function getColor(
  bars: any[],
  bar: number,
  width: number,
  percentPlayed: number,
  percentPlayable: number
) {
  const transparentTint = "rgba(256, 256, 256, 0.3)";
  const pink = "rgba(207, 46, 83, 1)";
  const tint = "#fff";

  let played = tint;
  let activePlayable = transparentTint;
  let inactive = transparentTint;

  if (bar / bars.length < percentPlayed) {
    return played;
  } else if (bar / bars.length < percentPlayable) {
    return activePlayable;
  } else {
    return inactive;
  }
}

export const Waveform = ({
  waveform,
  height,
  width,

  percentPlayed,
  percentPlayable,
  inverse,
  sampleMax,
}: {
  waveform: number[];
  height: number;
  width: number;

  percentPlayed: number;
  percentPlayable: number;
  inverse: boolean;
  sampleMax: number;
}) => {
  let min = Math.min.apply(Math, waveform);
  const scaleLinearHeight = scaleLinear()
    .domain([min, 0])
    .range([Math.max(sampleMax, -8), height]);
  let totalItems = width / 3;
  let chunksize = Math.ceil(waveform.length / totalItems);

  const chunks = _.chunk(waveform, chunksize) as any[];

  // tara later should be
  const renderChunk = (chunk: any, i: number) => {
    //@ts-ignore
    let scaleHeight = scaleLinearHeight(mean(chunk));
    return (
      <View key={i} style={{}}>
        <View
          style={{
            backgroundColor: getColor(
              chunks,
              i,
              width,
              percentPlayed,
              percentPlayable
            ),
            width: 2,
            marginRight: 1,
            height: scaleHeight,
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        {
          height: height,
          width: width,
          justifyContent: "center",
          flexDirection: "row",
        },
        inverse && {
          transform: [{ rotateX: "180deg" }, { rotateY: "0deg" }],
        },
      ]}
    >
      {chunks.map((chunk, i) => renderChunk(chunk, i))}
    </View>
  );
};
