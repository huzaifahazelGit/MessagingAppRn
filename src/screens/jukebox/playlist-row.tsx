import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View,
} from "react-native";
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import GenericModal from "../../components/modals/generic-modal";
import { BodyText, BoldMonoText } from "../../components/text";
import { TextInputInnerModal } from "../../components/upload-wrappers/text-input-modal";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { useMe } from "../../hooks/useMe";
import { ProfileColors } from "../../hooks/useProfileColors";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { Playlist } from "../../models/playlist";
import { Post } from "../../models/post";
import { setPlaylist } from "../../store/general-data-store";
import JukeboxControls from "./jukebox-controls";
import { PlaylistSongItem } from "./playlist-song-item";

export const PlaylistRowDisplay = ({
  playlist,
  profileColors,
  activePlaylistId,
  setActivePlaylistId,
  deletedPostIds,
  userId,
  companyId,
  canEdit,
  setDeletedPostIds,
  detailScreen,
  results,
  setResults,
}: {
  playlist: Playlist;
  profileColors: ProfileColors;
  activePlaylistId: string;
  setActivePlaylistId: any;
  deletedPostIds: string[];
  userId?: string;
  companyId?: string;
  canEdit: boolean;
  setDeletedPostIds: any;
  detailScreen?: boolean;
  results: Post[];
  setResults: any;
}) => {
  const currentTrack = useCurrentTrack();
  const { textColor } = profileColors;
  const [songs, setSongs] = useState([]);

  const me = useMe();
  const [newTitle, setNewTitle] = useState(playlist.name);
  const [showEditPlaylist, setShowEditPlaylist] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [done, setDone] = useState(false);
  const [scrolledId, setScrolledId] = useState(null);
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const [didPlay, setDidPlay] = useState(false);
  const ref = useRef<any>(null);
  let playlistId = playlist && playlist.id ? playlist.id : DEFAULT_ID;
  const navigation = useNavigation();

  const {
    pauseCurrentTrack,
    playTrackById,
    setUpPlaylist,
    isPlaying,
    setShouldShowFloater,
  } = useTrackPlayerContext();

  const onSharePlaylist = () => {
    setActivePlaylistId(null);
    pauseCurrentTrack();

    (navigation as any).navigate("SharePlaylistScreen", {
      currentTrack: currentTrack ? JSON.stringify(currentTrack) : null,
      songs: JSON.stringify(songs),
      playlistId: playlistId,
    });
  };

  const onShareSong = (post: Post) => {
    onSharePlaylist();
  };

  const onDeletePlaylist = async () => {
    setActivePlaylistId(null);
    let docRef = doc(getFirestore(), "playlists", playlistId);
    await deleteDoc(docRef);
  };

  const initializePlaylistDetail = async (items?: Post[]) => {
    await setUpPlaylistAudio(items, true);
  };

  const setUpPlaylistAudio = async (items?: Post[], shouldPlay?: boolean) => {
    let resultItems = items ? items : [...songs];
    setUpPlaylist(resultItems, null, shouldPlay, playlistId);
    setActivePlaylistId(playlistId);
    setShouldShowFloater(false);
    setDidPlay(false);
  };

  const selectTrack = async (post: Post) => {
    let didSetUp = false;
    if (activePlaylistId != playlistId) {
      didSetUp = true;
      await setUpPlaylistAudio(null, true);
    }
    if (didSetUp) {
      scrollToTrack(post.id, false);
      setTimeout(() => {
        console.log("later scroll");
        scrollToTrack(post.id, false);
      }, 500);
    }

    pauseCurrentTrack();
    if (currentTrack && post.id == currentTrack.id && isPlaying) {
      // just pause
    } else {
      playTrackById(post.id);
    }
  };

  useEffect(() => {
    if (me && me.id && songs.length == 0 && !didInitialFetch) {
      setDidInitialFetch(true);
      fetchFeed(null);
    }
  }, [me, songs, didInitialFetch]);

  const fetchFeed = async (lastItem) => {
    console.log("fetchFeed");
    let baseCollection = collection(getFirestore(), "posts");
    let queryOptions = [
      where("playlistIds", "array-contains", playlistId),
      where("createdate", "<=", new Date()),
    ];

    let orderByOption = orderBy("createdate", "desc");
    let itemsPerPage = 5;

    if (!fetching) {
      setFetching(true);
      let shouldSetLastFetch = false;
      let q = query(
        baseCollection,
        ...queryOptions,
        orderByOption,
        limit(itemsPerPage)
      );

      if (lastItem) {
        q = query(
          baseCollection,
          ...queryOptions,
          orderByOption,
          startAfter(lastItem),
          limit(itemsPerPage)
        );
      } else {
        shouldSetLastFetch = true;
      }

      let snapshot = await getDocs(q);

      let items: any[] = [];
      var index = 0;
      snapshot.forEach((item) => {
        items.push({ ...item.data(), id: item.id });
        if (index == snapshot.docs.length - 1) {
          setLastItem(item);
        }
        index++;
      });
      if (items.length < itemsPerPage) {
        setDone(true);
      }
      if (lastItem) {
        setSongs([...songs, ...items]);
        setResults([...songs, ...items]);
      } else {
        setSongs(items);
        setResults(items);

        if (detailScreen) {
          initializePlaylistDetail(items);
        }
      }
      setRefreshing(false);
      setFetching(false);
    }
  };

  const updatePlaylistName = async () => {
    let docRef = doc(getFirestore(), "playlists", playlistId);
    await updateDoc(docRef, {
      name: newTitle,
    });

    setPlaylist({ ...playlist, name: newTitle });
  };

  const isActive = useMemo(() => {
    return activePlaylistId == playlistId;
  }, [activePlaylistId, playlistId]);

  useEffect(() => {
    if (isActive) {
      console.log("didPlay", didPlay);
    }
  }, [didPlay, isActive]);

  const onScroll = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setScrolledId(viewableItems[0].item.id);
    }
  }, []);

  const scrollToTrack = (trackId: string, animated: boolean) => {
    let index = songs.findIndex((item) => item.id == trackId);
    if (index > -1) {
      setDidPlay(false);
      console.log("setDidPlay false and scroll to index", index);
      if (ref && ref.current) {
        ref.current.scrollToIndex({
          animated: animated,
          index: index,
          viewPosition: 0.5,
        });
      }
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      if (didPlay) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        scrollToTrack(track.id, true);
      }
    }
  });

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      if ((event as any).state == "playing") {
        setTimeout(() => {
          setDidPlay(true);
        }, 1000);
      }
    }
  });

  useEffect(() => {
    if (didPlay && isActive) {
      if (scrolledId && currentTrack) {
        if (currentTrack.id != scrolledId) {
          let post = songs.find((item) => item.id == scrolledId);
          if (post) {
            setDidPlay(false);
            console.log(
              "setDidPlay false and change to track",
              songs.findIndex((item) => item.id == scrolledId)
            );
            selectTrack(post);
          }
        }
      }
    }
  }, [scrolledId, currentTrack, didPlay, isActive]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const hasSongs = useMemo(() => {
    return (
      (songs || []).filter((item) => !deletedPostIds.includes(item.id)).length >
      0
    );
  }, [songs]);

  if (!playlist) {
    return <View />;
  }

  if (!hasSongs && !canEdit) {
    return <View />;
  }

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 4,
        }}
      >
        {detailScreen ? (
          <View style={{ marginBottom: 12 }}>
            <BodyText style={{ color: textColor }}>Now Playing</BodyText>
            <BoldMonoText style={{ color: textColor, fontSize: 18 }}>
              {playlist.name}
            </BoldMonoText>
          </View>
        ) : (
          <BodyText style={{ color: textColor }}>{playlist.name}</BodyText>
        )}
        {canEdit && !isActive && (
          <Pressable
            onPress={() => setShowEditPlaylist(true)}
            style={{ marginLeft: 4 }}
          >
            <Feather
              name="more-horizontal"
              size={24}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
          </Pressable>
        )}
        {isActive && !detailScreen && (
          <Pressable
            onPress={() => {
              setActivePlaylistId(null);
              setShouldShowFloater(true);
            }}
            style={{ marginLeft: 4 }}
          >
            <Ionicons name="close-circle" size={20} color={textColor} />
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal={true}
        data={(songs || []).filter((item) => !deletedPostIds.includes(item.id))}
        ref={ref}
        decelerationRate={"fast"}
        snapToInterval={isActive ? SCREEN_WIDTH - 70 : 140}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: isActive ? 40 : 20 }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onScroll}
        renderItem={({ item }) => {
          return (
            <PlaylistSongItem
              isActive={isActive}
              key={item.id}
              profileColors={profileColors}
              item={item}
              userId={userId}
              companyId={companyId}
              canEdit={canEdit}
              onSelect={() => selectTrack(item)}
              playlistId={playlistId}
              onRemoveFromJukebox={(postId) => {
                setDeletedPostIds([...deletedPostIds, postId]);
                setActivePlaylistId(null);
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: SCREEN_WIDTH - 40,
              paddingVertical: 20,
            }}
          >
            <BoldMonoText style={{ color: textColor, fontSize: 13 }}>
              No songs yet
            </BoldMonoText>
          </View>
        }
        ListFooterComponent={
          fetching && !done && !refreshing ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 14,
              }}
            >
              <ActivityIndicator color={"white"} />
            </View>
          ) : (
            <View />
          )
        }
        onEndReached={() => {
          if (songs && songs.length > 0 && !fetching && !done) {
            fetchFeed(lastItem);
          }
        }}
      />
      {isActive && currentTrack && (
        <View style={{ paddingHorizontal: 20 }}>
          <JukeboxControls
            onShare={onShareSong}
            profileColors={profileColors}
          />
        </View>
      )}
      <Modal visible={showEditTitle}>
        <TextInputInnerModal
          setShowModal={setShowEditTitle}
          confirm={() => {
            updatePlaylistName();
            setShowEditTitle(false);
          }}
          modalTitle={"EDIT NAME"}
          text={newTitle}
          setText={setNewTitle}
        />
      </Modal>
      <GenericModal
        showModal={showEditPlaylist}
        setShowModal={setShowEditPlaylist}
        options={
          playlist && playlist.executiveDefault
            ? [
                {
                  title: "Share",
                  icon: (
                    <FontAwesome
                      name={"share-square-o"}
                      size={18}
                      color={"black"}
                    />
                  ),
                  onPress: () => {
                    setShowEditPlaylist(false);
                    onSharePlaylist();
                  },
                },
              ]
            : [
                {
                  title: "Edit Title",
                  icon: <FontAwesome name={"edit"} size={18} color={"black"} />,

                  subtext: playlist.name,
                  onPress: () => {
                    setShowEditPlaylist(false);
                    setShowEditTitle(true);
                  },
                },
                {
                  title: "Share",
                  icon: (
                    <FontAwesome
                      name={"share-square-o"}
                      size={18}
                      color={"black"}
                    />
                  ),
                  onPress: () => {
                    setShowEditPlaylist(false);
                    onSharePlaylist();
                  },
                },
                {
                  title: "Delete",
                  icon: <FontAwesome name={"trash"} size={18} color={"red"} />,
                  onPress: () => {
                    setShowEditPlaylist(false);
                    onDeletePlaylist();
                  },
                },
              ]
        }
      />
    </View>
  );
};
