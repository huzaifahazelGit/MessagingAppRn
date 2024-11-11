import { useContext } from "react";
import { TrackPlayerContext } from "../providers/audio-provider";
import { Post } from "../models/post";
import { Submission } from "../models/submission";

export const useTrackPlayerContext = (): {
  togglePlay: () => void;
  pauseCurrentTrack: () => void;
  playCurrentTrack: () => void;
  playTrackById: (trackId: string) => void;
  playNext: () => Post;
  playPrev: () => Post;
  canPressNext: boolean;
  canPressPrev: boolean;
  setUpPlaylist: (
    posts: any[],
    startWithTrack?: Post,
    shouldPlay?: boolean,
    playlistId?: string
  ) => void;
  setUpSubmissions: (submissions: Submission[]) => void;
  selectPlaylistTrack: (
    playlistId: string,
    posts: [Post],
    startWithTrack: Post
  ) => void;
  loading: boolean;
  duration: number;
  isPlaying: boolean;
  isShowingFloater: boolean;
  setShouldShowFloater(isShowing: boolean): void;
  clearCurrentAudio: () => void;
} => {
  const {
    togglePlay,
    pauseCurrentTrack,
    playCurrentTrack,
    selectPlaylistTrack,
    playTrackById,
    playNext,
    playPrev,
    canPressNext,
    canPressPrev,
    setUpPlaylist,
    loading,
    duration,
    isPlaying,
    isShowingFloater,
    setShouldShowFloater,
    clearCurrentAudio,
    setUpSubmissions,
  } = useContext(TrackPlayerContext);

  return {
    togglePlay,
    pauseCurrentTrack,
    playCurrentTrack,
    playTrackById,
    playNext,
    playPrev,
    canPressNext,
    canPressPrev,
    setUpPlaylist,
    loading,
    duration,
    isPlaying,
    selectPlaylistTrack,
    isShowingFloater,
    setShouldShowFloater,
    clearCurrentAudio,
    setUpSubmissions,
  };
};
