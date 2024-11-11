import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { useCurrentTrack } from "../hooks/useCurrentTrack";
import { Post } from "../models/post";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Submission } from "../models/submission";
export const TrackPlayerContext = React.createContext(null);

export default function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [tracklist, setTracklist] = React.useState<any[]>([]);
  const currentTrack = useCurrentTrack();
  const progress = useProgress();
  const [shouldShowBottom, setShouldShowBottom] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isPlaying]);

  const setShouldShowFloater = (shouldShow: boolean) => {
    setShouldShowBottom(shouldShow);
  };

  const isShowingFloater = useMemo(() => {
    if (activePlaylistId && currentTrack && shouldShowBottom) {
      return true;
    }
    return false;
  }, [activePlaylistId, currentTrack, shouldShowBottom]);

  const clearCurrentAudio = async () => {
    await TrackPlayer.reset();
    setDuration(0);
    setIsPlaying(false);
    setLoading(false);
    setTracklist([]);
    setActivePlaylistId(null);
    setShouldShowBottom(false);
  };

  const canPressNext = useMemo(() => {
    let item = tracklist.findIndex((item) => item.id == currentTrack?.id);
    if (item == tracklist.length - 1) {
      return false;
    }
    return true;
  }, [currentTrack, tracklist]);

  const canPressPrev = useMemo(() => {
    let item = tracklist.findIndex((item) => item.id == currentTrack?.id);
    if (item == 0) {
      return false;
    }
    return true;
  }, [currentTrack, tracklist]);

  const togglePlay = async () => {
    if (isPlaying) {
      pauseCurrentTrack();
    } else {
      playCurrentTrack();
    }
  };

  const pauseCurrentTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const playCurrentTrack = async () => {
    fetchDuration();
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const playTrackById = async (postId: string) => {
    fetchDuration();
    let queue = await TrackPlayer.getQueue();
    let index = queue.findIndex((item) => item.id == postId);
    if (index == -1) {
      return;
    }
    await TrackPlayer.skip(index);
    setTimeout(async () => {
      await TrackPlayer.play();
      setIsPlaying(true);
    }, 600);
  };

  const playNext = async () => {
    setDuration(0);
    await TrackPlayer.pause();
    let queue = await TrackPlayer.getQueue();
    let index = queue.findIndex((item) => item.id == currentTrack.id);
    if (index == queue.length - 1) {
      index = 0;
    } else {
      index++;
    }

    let ruturnPost = tracklist[index];
    await TrackPlayer.skip(index);
    setTimeout(async () => {
      await TrackPlayer.play();
      setIsPlaying(true);
    }, 600);

    return ruturnPost;
  };

  const playPrev = async () => {
    setDuration(0);
    await TrackPlayer.pause();
    let queue = await TrackPlayer.getQueue();
    let index = queue.findIndex((item) => item.id == currentTrack.id);
    if (index == 0) {
      index = queue.length - 1;
    } else {
      index--;
    }

    let ruturnPost = tracklist[index];
    await TrackPlayer.skip(index);
    setTimeout(async () => {
      await TrackPlayer.play();
      setIsPlaying(true);
    }, 600);

    return ruturnPost;
  };

  const selectPlaylistTrack = async (
    playlistId: string,
    posts: [Post],
    startWithTrack: Post
  ) => {
    setDuration(0);
    if (playlistId != activePlaylistId) {
      setUpPlaylist(posts, startWithTrack, true, playlistId);
    } else {
      playTrackById(startWithTrack.id);
    }
  };

  const setUpSubmissions = async (submissions: Submission[]) => {
    console.log("setUpSubmissions", submissions.length);
    setDuration(0);

    let cleanedSubmissions = submissions.filter(
      (item) => item.audio && item.uploadTitle && item.username && item.id
    );
    setTracklist(cleanedSubmissions);

    await TrackPlayer.reset();
    let tracks = [];
    cleanedSubmissions.forEach((post) => {
      tracks.push({
        ...post,
        url: post.audio,
        title: post.uploadTitle,
        artist: post.username,
        artwork: post.image ? post.image : undefined,
        id: post.id,
      });
    });
    await TrackPlayer.add(tracks);
  };

  const setUpPlaylist = async (
    posts: [Post],
    startWithTrack?: Post,
    shouldPlay?: boolean,
    playlistId?: string
  ) => {
    console.log("setUpPlaylist", playlistId);
    if (playlistId) {
      setActivePlaylistId(playlistId);
    } else {
      setActivePlaylistId(playlistId);
    }

    setDuration(0);

    let list = startWithTrack
      ? [
          startWithTrack,
          ...posts.filter((item) => item.id != startWithTrack.id),
        ]
      : posts;
    setTracklist(list);

    await TrackPlayer.reset();
    let tracks = [];
    list.forEach((post) => {
      tracks.push({
        ...post,
        url: post.audio,
        title: post.uploadTitle,
        artist: post.username,
        artwork: post.image ? post.image : undefined,
        id: post.id,
      });
    });
    await TrackPlayer.add(tracks);

    if (shouldPlay) {
      setTimeout(async () => {
        await TrackPlayer.play();
        setIsPlaying(true);
      }, 600);
    }
  };

  const fetchDuration = async () => {
    setLoading(false);
    let d = await TrackPlayer.getDuration();
    setDuration(d);
    // let currentD = durationMap;
    // currentD[currentTrack.id] = d;
    // setDurationMap(currentD);
    setLoading(false);
  };

  useEffect(() => {
    if (progress.position > 1 && duration == 0) {
      fetchDuration();
    }
  }, [progress]);

  return (
    <TrackPlayerContext.Provider
      value={{
        togglePlay,
        pauseCurrentTrack,
        playCurrentTrack,
        playTrackById,
        playNext,
        playPrev,
        setUpPlaylist,
        selectPlaylistTrack,
        loading,
        duration,
        isPlaying,
        isShowingFloater,
        setShouldShowFloater,
        clearCurrentAudio,
        setUpSubmissions,
        canPressNext,
        canPressPrev,
      }}
    >
      {children}
    </TrackPlayerContext.Provider>
  );
}
