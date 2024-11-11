import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { ListSongItem } from "../../components/audio/search-results-song-list";
import { BackButton } from "../../components/buttons/buttons";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import { usePlaylistById } from "../../hooks/usePlaylists";
import { DEFAULT_PROFILE_COLORS } from "../../hooks/useProfileColors";
import { PlaylistRowDisplay } from "./playlist-row";

export default function PlaylistDetail() {
  const route = useRoute();
  const params = route.params as any;
  const playlistId = params.playlistId;
  const playlist = usePlaylistById(playlistId);
  const [deletedPostIds, setDeletedPostIds] = useState([]);
  const me = useMe();
  const navigation = useNavigation();
  const [results, setResults] = useState([]);

  if (!playlist) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: -10,
          }}
        >
          <BackButton />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 160,
                height: 60,
              }}
              contentFit={"contain"}
              source={require("../../../assets/icon-title.png")}
            />
          </View>
          <View style={{ width: 30 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: -10,
            marginBottom: 10,
          }}
        >
          <BackButton />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 160,
                height: 60,
              }}
              contentFit={"contain"}
              source={require("../../../assets/icon-title.png")}
            />
          </View>
          <View style={{ width: 30 }} />
        </View>

        <FlatList
          data={results}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ backgroundColor: colors.black }}>
              <PlaylistRowDisplay
                playlist={playlist}
                results={results}
                setResults={setResults}
                detailScreen={true}
                profileColors={DEFAULT_PROFILE_COLORS}
                activePlaylistId={playlistId}
                setActivePlaylistId={() => {}}
                deletedPostIds={deletedPostIds}
                canEdit={false}
                setDeletedPostIds={setDeletedPostIds}
              />
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <ListSongItem
                item={item}
                profileColors={DEFAULT_PROFILE_COLORS}
                onDelete={() => {}}
                isMyCompany={false}
                companyId={null}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
