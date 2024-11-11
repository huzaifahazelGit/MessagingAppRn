import React, { useState } from "react";
import { ImageBackground, View } from "react-native";
import { BoldMonoText } from "../../components/text";
import { HorizontalJukeboxHeader } from "./header";
import { SelectPlaylistView } from "./playlist-view";
import { SelectedSongView } from "./song-view";

export function HorizontalJukebox({
  user,
  userId,
}: {
  user: any;
  userId: string;
}) {
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<any>(null);
  const [selectedTrack, setSelectedTrack] = React.useState<any>(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);

  return (
    <HorizontalJukeboxBackground selectedTrack={selectedTrack}>
      <HorizontalJukeboxHeader
        selectedPlaylist={selectedPlaylist}
        setSelectedPlaylist={setSelectedPlaylist}
        setSelectedTrack={setSelectedTrack}
        showRadio={showRadio}
        setShowRadio={setShowRadio}
        user={user}
      />
      {showRadio ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <BoldMonoText>Realm Radio: Coming Soon.</BoldMonoText>
        </View>
      ) : selectedTrack && selectedPlaylist ? (
        <SelectedSongView
          selectedTrack={selectedTrack}
          selectedPlaylist={selectedPlaylist}
          setSelectedTrack={setSelectedTrack}
          allTracks={selectedPlaylistTracks}
        />
      ) : (
        <SelectPlaylistView
          user={user}
          userId={userId}
          setSelectedTrack={setSelectedTrack}
          setSelectedPlaylist={setSelectedPlaylist}
          setSelectedPlaylistTracks={setSelectedPlaylistTracks}
        />
      )}
    </HorizontalJukeboxBackground>
  );
}

const HorizontalJukeboxBackground = ({ selectedTrack, children }) => {
  if (selectedTrack) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{
            uri:
              selectedTrack && selectedTrack.image ? selectedTrack.image : "",
          }}
          style={{ flex: 1 }}
        >
          <View style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}>
            {children}
          </View>
        </ImageBackground>
      </View>
    );
  } else {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
};
