import React, { useEffect } from "react";
import { View } from "react-native";
import { DEFAULT_ID } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { DEFAULT_PROFILE_COLORS } from "../../hooks/useProfileColors";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import JukeboxControls from "../jukebox/jukebox-controls";

export const SelectedSongView = ({
  selectedTrack,
  allTracks,
  setSelectedTrack,
  selectedPlaylist,
}) => {
  const currentTrack = useCurrentTrack();

  const { playNext, selectPlaylistTrack } = useTrackPlayerContext();

  useEffect(() => {
    if (selectedTrack) {
      selectPlaylistTrack(selectedPlaylist.id, allTracks, selectedTrack);
    }
  }, []);

  const onPressNext = async () => {
    let nextPost = await playNext();
    setSelectedTrack(nextPost);
  };

  return (
    <View style={{ flex: 1, padding: 40, justifyContent: "flex-end" }}>
      {currentTrack && (
        <JukeboxControls
          onShare={() => {}}
          profileColors={DEFAULT_PROFILE_COLORS}
          playlistId={selectedPlaylist ? selectedPlaylist.id : DEFAULT_ID}
          canEdit={false}
          horizontal={true}
          onPressNext={onPressNext}
          onRemoveFromJukebox={(postId) => {}}
        />
      )}
    </View>
  );
};
