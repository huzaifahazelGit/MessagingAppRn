import { AntDesign } from "@expo/vector-icons";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native";
import { BodyText } from "../../components/text";
import { TextInputInnerModal } from "../../components/upload-wrappers/text-input-modal";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { usePlaylists } from "../../hooks/usePlaylists";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Playlist } from "../../models/playlist";
import { GeneralDataStore } from "../../store/general-data-store";
import { PlaylistRowDisplay } from "./playlist-row";

export const ProfileJukeboxNew = ({
  header,
  onDelete,
  userId,
  companyId,
  deletedPostIds,
  setDeletedPostIds,
  headerVisible,
  setHeaderVisible,
  profileColors,
}: {
  header?: any;
  onDelete: any;
  profileColors: ProfileColors;
  userId?: string;
  companyId?: string;
  deletedPostIds: string[];
  setDeletedPostIds: any;
  headerVisible: boolean;
  setHeaderVisible: any;
}) => {
  const [activePlaylistId, setActivePlaylistId] = useState("");
  const me = useMe();
  let ownerId = companyId ? companyId : userId;
  const playlists = usePlaylists(ownerId);
  const myCompanies = GeneralDataStore.useState((s) => s.companies);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [results, setResults] = useState([]);

  const sortedPlaylists = useMemo(() => {
    let items = playlists || [];

    items.sort(function (a, b) {
      let first = a.executiveDefault ? 1 : 0;
      let second = b.executiveDefault ? 1 : 0;
      return first - second;
    });

    return items;
  }, [playlists]);

  const isMyProfile = useMemo(() => {
    return me && userId && userId == me.id;
  }, [me.id, userId]);

  const canEdit = useMemo(() => {
    if (isMyProfile) {
      return true;
    }
    return (
      companyId &&
      (myCompanies || []).map((item) => item.id).includes(companyId)
    );
  }, [companyId, myCompanies, isMyProfile]);

  useEffect(() => {
    if (activePlaylistId) {
      if (headerVisible) {
        setHeaderVisible(false);
      }
    } else {
      if (!headerVisible) {
        setHeaderVisible(true);
      }
    }
  }, [activePlaylistId, headerVisible]);

  const createNewPlaylist = async () => {
    let playlist: Playlist = {
      ownerId: ownerId,
      name: newTitle,
      defaultPlaylist: false,
      ownerName: me.username,
      timeCreated: new Date(),
      lastUpdated: new Date(),
      archived: false,
      ownerIsCompany: companyId ? true : false,
      songCount: 0,
      likeCount: 0,
      likedAvatars: [],
      shareCount: 0,
      tags: [],
      featured: false,
    };

    await addDoc(collection(getFirestore(), "playlists"), playlist);

    setNewTitle("");
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        nestedScrollEnabled={true}
        // key={`playing-${activePlaylistId}`}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: -1 * SCREEN_WIDTH + (isMyProfile ? 100 : 125) }}
        contentContainerStyle={activePlaylistId ? {} : { paddingTop: 120 }}
        data={sortedPlaylists || []}
        ListHeaderComponent={activePlaylistId ? <View /> : header}
        ListFooterComponent={
          <View>
            {canEdit && (
              <TouchableOpacity
                style={{
                  marginHorizontal: 18,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => setShowCreatePlaylist(true)}
              >
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={profileColors.textColor}
                  style={{ marginRight: 6 }}
                />
                <BodyText style={{ color: profileColors.textColor }}>
                  New Jukebox Set
                </BodyText>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <PlaylistRowDisplay
            results={results}
            setResults={setResults}
            playlist={item}
            canEdit={canEdit}
            deletedPostIds={deletedPostIds}
            profileColors={profileColors}
            activePlaylistId={activePlaylistId}
            setActivePlaylistId={setActivePlaylistId}
            setDeletedPostIds={setDeletedPostIds}
          />
        )}
      />
      <Modal visible={showCreatePlaylist}>
        <TextInputInnerModal
          setShowModal={setShowCreatePlaylist}
          confirm={() => {
            createNewPlaylist();
            setShowCreatePlaylist(false);
          }}
          modalTitle={"NEW JUKEBOX SET"}
          placeholderText="Enter name..."
          text={newTitle}
          setText={setNewTitle}
        />
      </Modal>
    </View>
  );
};
