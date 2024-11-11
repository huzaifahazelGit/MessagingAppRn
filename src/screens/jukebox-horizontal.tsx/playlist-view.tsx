import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { DEFAULT_ID, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { usePlaylists } from "../../hooks/usePlaylists";
import { Playlist } from "../../models/playlist";
import { User } from "../../models/user";

export const SelectPlaylistView = ({
  user,
  userId,
  setSelectedTrack,
  setSelectedPlaylist,
  setSelectedPlaylistTracks,
}: {
  user: User;
  userId: string;
  setSelectedTrack: any;
  setSelectedPlaylist: any;
  setSelectedPlaylistTracks: any;
}) => {
  const [activePlaylist, setActivePlaylist] = React.useState<any>(null);
  const playlists = usePlaylists(userId);

  let smallImageWidth = 50;

  useEffect(() => {
    if (activePlaylist == null && playlists && playlists.length > 0) {
      setActivePlaylist(playlists[0]);
    }
  }, [playlists, activePlaylist]);

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row", paddingTop: 12 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={playlists}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor:
                  index % 2 == 0 ? colors.transparentWhite1 : colors.black,
                paddingLeft: 4,
                paddingVertical: 8,
                alignItems: "center",
              }}
              onPress={() => {
                if (activePlaylist) {
                  setActivePlaylist(null);
                  setTimeout(() => {
                    setActivePlaylist(item);
                  }, 500);
                } else {
                  setActivePlaylist(item);
                }
              }}
            >
              {item.coverImage ? (
                <Image
                  source={{ uri: item.coverImage }}
                  style={{
                    width: smallImageWidth,
                    height: smallImageWidth,
                    borderRadius: 4,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: smallImageWidth,
                    height: smallImageWidth,
                    borderRadius: 4,
                    borderColor: colors.transparentWhite7,
                    borderWidth: 0.5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="cassette"
                    size={35}
                    color="white"
                  />
                </View>
              )}
              <BoldMonoText style={{ marginLeft: 12 }}>
                {item.name}
              </BoldMonoText>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ flex: 1 }}>
        {activePlaylist && (
          <SelectSongView
            activePlaylist={activePlaylist}
            setSelectedTrack={setSelectedTrack}
            setSelectedPlaylist={setSelectedPlaylist}
            setSelectedPlaylistTracks={setSelectedPlaylistTracks}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const SelectSongView = ({
  activePlaylist,
  setSelectedTrack,
  setSelectedPlaylist,
  setSelectedPlaylistTracks,
}: {
  setSelectedTrack: any;
  activePlaylist: Playlist;
  setSelectedPlaylist: any;
  setSelectedPlaylistTracks: any;
}) => {
  const me = useMe();
  const [songs, setSongs] = useState([]);
  const [textColor, setTextColor] = useState(colors.white);
  const [fetching, setFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [done, setDone] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const ref = useRef(null);

  let largeImageWidth = 280;

  let playlistId =
    activePlaylist && activePlaylist.id ? activePlaylist.id : DEFAULT_ID;

  useEffect(() => {
    if (playlistId && playlistId != DEFAULT_ID) {
      setSongs([]);
      fetchFeed(null);
    }
  }, [playlistId]);

  const fetchFeed = async (lastItem) => {
    console.log("fetchFeed");
    let baseCollection = collection(getFirestore(), "posts");
    let queryOptions = [
      where("playlistIds", "array-contains", playlistId),
      where("createdate", "<=", new Date()),
    ];

    let orderByOption = orderBy("createdate", "desc");
    let itemsPerPage = 20;

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
      } else {
        setSongs(items);
        if (items.length > 1) {
          setTimeout(() => {
            if (ref && ref.current) {
              ref.current.scrollToIndex({ index: items.length - 1 });
            }
          }, 500);
        }
      }
      setRefreshing(false);
      setFetching(false);
    }
  };

  if (!activePlaylist) {
    return <View />;
  }

  return (
    <View style={{ marginLeft: 50 }}>
      <Animated.FlatList
        horizontal={false}
        data={songs || []}
        // decelerationRate={"fast"}
        // snapToInterval={largeImageWidth}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        ref={ref}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange =
            index == 0
              ? [-1, 0, largeImageWidth * index, largeImageWidth * (index + 1)]
              : [
                  0,
                  largeImageWidth * index - largeImageWidth / 2,
                  largeImageWidth * index - 50,
                  largeImageWidth * (index + 1),
                ];
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0, 0, 1, 0.5],
          });

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 0.9, 1, 0.9],
          });

          const offset = scrollY.interpolate({
            inputRange,
            outputRange: [100, -80, 0, 140],
          });

          return (
            <Animated.View
              style={
                index == 0
                  ? {}
                  : {
                      transform: [{ scale: scale }, { translateY: offset }],
                      opacity: opacity,
                    }
              }
            >
              <View>
                <TouchableWithoutFeedback
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                  onPress={() => {
                    setSelectedPlaylistTracks(songs);
                    setSelectedPlaylist(activePlaylist);
                    setSelectedTrack(item);
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: largeImageWidth,
                        height: largeImageWidth,
                        borderRadius: 12,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: largeImageWidth,
                        height: largeImageWidth,
                        borderRadius: 12,
                        borderColor: colors.transparentWhite7,
                        backgroundColor: colors.white,
                        borderWidth: 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="cassette"
                        size={80}
                        color="black"
                      />
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            </Animated.View>
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
    </View>
  );
};
