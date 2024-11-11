import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { EnterLinksModal } from "../../components/modals/enter-link-modal";
import { colors } from "../../constants/colors";
import { IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { UploadObjectPostImagePrevew } from "./select-phase/post-image-preview";
import { UploadDataSelectorRow } from "./select-phase/upload-data-selector-row";
import {
  EMPTY_UPLOAD_SELECTION_OBJECT,
  UploadKinds,
  UploadSelectionObject,
} from "./upload-constants";
import ImagePicker from "react-native-image-crop-picker";

export const DataUploadSelectionPhase = ({
  uploadKinds,
  uploadData,
  setUploadData,
  onSkip,
}: {
  uploadData: UploadSelectionObject;
  setUploadData: any;
  uploadKinds: UploadKinds[];
  onSkip?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [paginating, setPaginating] = useState(true);
  const [showingLinks, setShowingLinks] = useState(false);

  useEffect(() => {
    fetchPics();
  }, []);

  const fetchPics = async () => {
    await requestPermission();
    let pics = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
    });
    let vids = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.video,
    });
    let items = [];
    if (!uploadKinds.includes(UploadKinds.Video)) {
      items = [...pics.assets];
    } else {
      items = [...pics.assets, ...vids.assets];
    }

    items.sort((a, b) => {
      return b.creationTime - a.creationTime;
    });

    let promises = [];

    items.forEach(async (item) => {
      promises.push(
        MediaLibrary.getAssetInfoAsync(item)
          .then(async (info) => {
            if (info.mediaType == "video") {
              let thumbnailURI = IS_ANDROID ? info.uri : info.localUri;
              const { uri } = await VideoThumbnails.getThumbnailAsync(
                thumbnailURI
              );
              return {
                ...info,
                thumbnail: uri,
              };
            } else {
              return info;
            }
          })
          .then((info) => {
            return {
              ...item,
              ...info,
            };
          })
      );
    });
    let finalInfo = await Promise.all(promises);

    setPhotos(finalInfo);

    setTimeout(() => {
      setPaginating(false);
    }, 500);
  };

  const loadMorePics = async () => {
    if (photos.length > 0) {
      let mediaPhotos = photos.filter((item) => item.mediaType == "photo");
      let mediaVids = photos.filter((item) => item.mediaType == "video");

      let pics = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        after:
          mediaPhotos.length > 0
            ? mediaPhotos[mediaPhotos.length - 1].id
            : null,
      });
      let vids = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        after: mediaVids.length > 0 ? mediaVids[mediaVids.length - 1].id : null,
      });

      let items = [];
      if (!uploadKinds.includes(UploadKinds.Video)) {
        items = [...pics.assets];
      } else {
        items = [...pics.assets, ...vids.assets];
      }

      items.sort((a, b) => {
        return b.creationTime - a.creationTime;
      });

      let promises = [];

      items.forEach(async (item) => {
        promises.push(
          MediaLibrary.getAssetInfoAsync(item)
            .then(async (info) => {
              if (info.mediaType == "video") {
                try {
                  let thumbnailURI = IS_ANDROID ? info.uri : info.localUri;
                  const { uri } = await VideoThumbnails.getThumbnailAsync(
                    thumbnailURI
                  );
                  return {
                    ...info,
                    thumbnail: uri,
                  };
                } catch (err) {
                  return info;
                }
              } else {
                return info;
              }
            })
            .then((info) => {
              return {
                ...item,
                ...info,
              };
            })
        );
      });

      let finalInfo = await Promise.all(promises);

      setPhotos([...photos, ...finalInfo]);

      setTimeout(() => {
        setPaginating(false);
      }, 500);
    }
  };

  const hasLink = useMemo(() => {
    return (
      uploadData.linksObject.soundcloudLink ||
      uploadData.linksObject.spotifyId ||
      uploadData.linksObject.youtubeId
    );
  }, [uploadData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: 8,
      }}
    >
      <FlatList
        data={
          hasLink
            ? []
            : permissionResponse &&
              permissionResponse.accessPrivileges == "limited"
            ? [{ kind: "add-more" }, ...photos]
            : photos
        }
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={uploadData.videoURL ? [] : [0]}
        ListHeaderComponent={
          <View>
            <UploadObjectPostImagePrevew
              uploadData={uploadData}
              setUploadData={setUploadData}
              loading={loading}
              width={SCREEN_WIDTH - 16}
              onCrop={() => {
                console.log("openCropper");
                ImagePicker.openCropper({
                  mediaType: "photo",
                  path: uploadData.imageURL,
                  width: 500,
                  height: 500,
                  cropping: true,
                }).then((image) => {
                  setUploadData({
                    ...uploadData,
                    imageURL: image.path,
                  });
                });
              }}
            />
            <UploadDataSelectorRow
              uploadData={uploadData}
              setUploadData={setUploadData}
              uploadKinds={uploadKinds}
              loading={loading}
              onSkip={onSkip}
              setLoading={setLoading}
              setShowingLinks={setShowingLinks}
            />
          </View>
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!paginating) {
            loadMorePics();
          }
        }}
        renderItem={({ item }) =>
          item.kind && item.kind == "add-more" ? (
            <SelectMoreImageButton
              setPhotos={setPhotos}
              fetchPics={fetchPics}
            />
          ) : (
            <ImageSelectionItem
              item={item}
              setUploadData={setUploadData}
              uploadData={uploadData}
            />
          )
        }
        ListEmptyComponent={
          <View>
            {permissionResponse &&
            permissionResponse.accessPrivileges != "none" &&
            !hasLink ? (
              <View>
                <ActivityIndicator animating />
              </View>
            ) : (
              <View />
            )}
          </View>
        }
      />

      <EnterLinksModal
        showingLinks={showingLinks}
        setShowingLinks={setShowingLinks}
        linksObject={uploadData.linksObject}
        setLinksObject={(item) => {
          setUploadData({
            ...uploadData,
            linksObject: item,
          });
        }}
      />
    </View>
  );
};

const SelectMoreImageButton = ({ setPhotos, fetchPics }) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        await MediaLibrary.presentPermissionsPickerAsync();
        setPhotos([]);
        setTimeout(() => {
          fetchPics();
        }, 3000);
      }}
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderColor: "white",
        borderWidth: 1,
        width: SCREEN_WIDTH / 3 - 6,
        height: SCREEN_WIDTH / 3 - 6,
      }}
    >
      <AntDesign name="pluscircle" size={24} color="white" />
    </TouchableOpacity>
  );
};

const ImageSelectionItem = ({ item, setUploadData, uploadData }) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        let itemURI = IS_ANDROID ? item.uri : item.localUri;
        if (item.mediaType == "video") {
          setUploadData({
            ...EMPTY_UPLOAD_SELECTION_OBJECT,
            videoURL: itemURI,
          });
        } else {
          setUploadData({
            ...uploadData,
            videoURL: "",
            imageURL: itemURI,
          });
        }
      }}
    >
      <Image
        style={{
          width: SCREEN_WIDTH / 3 - 4,
          height: SCREEN_WIDTH / 3 - 4,
        }}
        source={{
          uri:
            item.mediaType == "video" && item.thumbnail
              ? item.thumbnail
              : item.localUri,
        }}
      />
    </TouchableOpacity>
  );
};
