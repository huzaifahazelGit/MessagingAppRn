import { useState } from "react";
import TrackPlayer, { useTrackPlayerEvents } from "react-native-track-player";

import { Event } from "react-native-track-player";

const events = [
  Event.PlaybackState,
  Event.PlaybackError,
  Event.PlaybackQueueEnded,
  Event.PlaybackTrackChanged,
  Event.PlaybackMetadataReceived,
  Event.RemotePlay,
  Event.RemotePause,
  Event.RemoteStop,
  Event.RemoteNext,
  Event.RemotePrevious,
  Event.RemoteJumpForward,
  Event.RemoteJumpBackward,
  Event.RemoteSeek,
  Event.RemoteDuck,
];

export function useCurrentTrack() {
  const [track, setTrack] = useState(null);

  useTrackPlayerEvents(events, (event) => {
    fetchTrack();
  });

  const fetchTrack = async () => {
    let index = await TrackPlayer.getCurrentTrack();
    if (index == null) {
      setTrack(null);
    } else if (index > -1) {
      let trackObj = await TrackPlayer.getTrack(index);
      setTrack(trackObj);
    } else {
      setTrack(null);
    }
  };

  return track;
}
