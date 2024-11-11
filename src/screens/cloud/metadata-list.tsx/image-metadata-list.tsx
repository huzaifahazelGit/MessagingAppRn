import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SimpleHeightAdjustedVideo } from "../../../components/height-adjusted-video";
import EmptyAudioBackground from "../../../components/images/empty-audio-background";
import { BodyText } from "../../../components/text";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../constants/utils";
import { CollabMessage } from "../../../models/collaboration";
import { useMe } from "../../../hooks/useMe";
import { Paginator } from "../../../components/lists/paginator";
import { collection, getFirestore, orderBy, where } from "firebase/firestore";

export default function ImageMetadataList({ filePosts }) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
      {filePosts.length == 0 && (
        <View
          style={{
            opacity: 0.7,
          }}
        >
          <BodyText>No files.</BodyText>
        </View>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {[...filePosts].map((item) => (
          <View style={{ marginRight: 12, marginBottom: 12 }} key={item.id}>
            {item.video ? (
              <ListVideoItem video={item.video} onPress={null} />
            ) : item.image ? (
              <ListImageItem image={item.image} onPress={null} />
            ) : (
              <EmptyAudioBackground size={(SCREEN_WIDTH - 78) / 3} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

export function PaginatedFileMetadataList({
  kind,
  onPressItem,
}: {
  kind: "Images" | "Videos";
  onPressItem: any;
}) {
  const [results, setResults] = useState([]);
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;

  let queryList = kind == "Images" ? ["image"] : ["video"];

  return (
    <Paginator
      queryOptions={
        me.username == "Tara Wilson"
          ? [where("kind", "in", queryList), where("userId", "==", userId)]
          : [
              where("kind", "in", queryList),
              where("userId", "==", userId),
              where("reposted", "==", false),
            ]
      }
      orderByOption={orderBy("createdate", "desc")}
      baseCollection={collection(getFirestore(), "posts")}
      contentContainerStyle={{
        paddingBottom: 60,
        paddingHorizontal: 20,
        marginTop: 14,
      }}
      needsReload={false}
      setNeedsReload={() => {}}
      setResults={setResults}
      results={results}
      numColumns={3}
      itemsPerPage={12}
      listEmptyText={"No activity."}
      renderListItem={function (item: any, visible: boolean) {
        return (
          <View style={{ paddingHorizontal: 4, paddingVertical: 4 }}>
            {item.video ? (
              <ListVideoItem
                video={item.video}
                onPress={() => {
                  onPressItem(item);
                }}
              />
            ) : item.image ? (
              <ListImageItem
                image={item.image}
                onPress={() => {
                  onPressItem(item);
                }}
              />
            ) : (
              <EmptyAudioBackground size={(SCREEN_WIDTH - 78) / 3} />
            )}
          </View>
        );
      }}
      trackVisible={false}
      setLastFetch={() => {}}
    />
  );
}

const ListVideoItem = ({ video, onPress }) => {
  const [large, setLarge] = useState(false);

  if (large) {
    return (
      <View style={{ flexDirection: "row" }}>
        <SimpleHeightAdjustedVideo
          videoURL={video}
          fullWidth={SCREEN_WIDTH - 40}
        />
        <TouchableOpacity
          style={{ marginLeft: -30, marginTop: 5 }}
          onPress={() => setLarge(false)}
        >
          <Ionicons name="close-circle" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View>
      <Video
        style={{
          width: (SCREEN_WIDTH - 78) / 3,
          height: (SCREEN_WIDTH - 78) / 3,
          borderRadius: 8,
          backgroundColor: "rgba(256, 256, 256, 0.5)",
        }}
        source={{
          uri: video,
        }}
        useNativeControls={true}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
      />
      <TouchableOpacity
        style={{
          width: (SCREEN_WIDTH - 78) / 3,
          height: (SCREEN_WIDTH - 78) / 3,
          marginTop: (-1 * (SCREEN_WIDTH - 78)) / 3,
        }}
        onPress={onPress ? onPress : () => setLarge(true)}
      ></TouchableOpacity>
    </View>
  );
};

const ListImageItem = ({ image, onPress }) => {
  const [large, setLarge] = useState(false);

  if (large) {
    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{
            width: SCREEN_WIDTH - 40,
            height: SCREEN_WIDTH - 40,
            borderRadius: 8,
          }}
          source={{ uri: image }}
        />
        <TouchableOpacity
          style={{ marginLeft: -30, marginTop: 5 }}
          onPress={() => setLarge(false)}
        >
          <Ionicons name="close-circle" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View>
      <Image
        style={{
          width: (SCREEN_WIDTH - 78) / 3,
          height: (SCREEN_WIDTH - 78) / 3,
          borderRadius: 8,
        }}
        source={{ uri: image }}
      />
      <TouchableOpacity
        style={{
          width: (SCREEN_WIDTH - 78) / 3,
          height: (SCREEN_WIDTH - 78) / 3,
          marginTop: (-1 * (SCREEN_WIDTH - 78)) / 3,
        }}
        onPress={onPress ? onPress : () => setLarge(true)}
      ></TouchableOpacity>
    </View>
  );
};
