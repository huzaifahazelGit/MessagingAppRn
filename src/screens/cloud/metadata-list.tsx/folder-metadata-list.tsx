import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  increment,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Paginator } from "../../../components/lists/paginator";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { PostAudioItem } from "./audio-metadata-list";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import { BoldMonoText } from "../../../components/text";
import { MaterialIcons } from "@expo/vector-icons";
import { Post } from "../../../models/post";
import { useNavigation } from "@react-navigation/native";
import { FileOptionsModal } from "../../../components/modals/file-options-modal";
import Share from "react-native-share";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import { createPostLink } from "../../../services/link-service";

export function PaginatedFolderMetadataList({ folderId }) {
  const [results, setResults] = useState([]);
  const me = useMe();
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const name = useMemo(() => {
    if (editingPost) {
      if (editingPost.uploadTitle) {
        return editingPost.uploadTitle;
      }
      let base = editingPost.image;
      if (editingPost.video) {
        base = editingPost.video;
      }
      if (base.split("%2F").length > 1) {
        let newBase = base.split("%2F")[1];
        return newBase.split("?")[0];
      }
      return editingPost.kind;
    }
    return "";
  }, [editingPost]);

  const onShare = async (post: Post) => {
    let link = createPostLink(post.id, me.id);

    let source = post.audio ? post.audio : post.video ? post.video : post.image;
    let title = name;

    let ending = source.split("%2F").pop();
    let extOne = ending.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    if (title.includes(ext)) {
      ext = "";
    }
    const path = `${DocumentDirectoryPath}/${title || "audio"}${ext}`;

    console.log("source", source);

    if (source) {
      const response = downloadFile({
        fromUrl: source,
        toFile: path,
      });
      response.promise
        .then(async (res) => {
          if (res && res.statusCode === 200 && res.bytesWritten > 0) {
            await Share.open({ url: path });
          } else {
            await Share.open({ url: post.image, message: link });
          }
        })
        .catch(async (error) => {
          console.log("err", error);
        });
    }
  };

  return (
    <View>
      <Paginator
        queryOptions={[where("parentFolderIds", "array-contains", folderId)]}
        orderByOption={orderBy("createdate", "desc")}
        baseCollection={collection(getFirestore(), "posts")}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}
        needsReload={false}
        setNeedsReload={() => {}}
        setResults={setResults}
        results={results}
        itemsPerPage={12}
        listEmptyText={"No files."}
        renderListItem={function (item: any, visible: boolean) {
          return item.kind == "audio" ? (
            <PostAudioItem
              item={item}
              folderId={folderId}
              includeMoreButton={true}
              onClickMore={() => {
                setEditingPost(item);
                setShowFileOptions(true);
              }}
            />
          ) : (
            <ListItemNonAudio
              post={item}
              includeMoreButton={true}
              onClickMore={() => {
                setEditingPost(item);
                setShowFileOptions(true);
              }}
              folderId={folderId}
            />
          );
        }}
        trackVisible={false}
        setLastFetch={() => {}}
      />
      <FileOptionsModal
        post={editingPost}
        inFolder={true}
        onSelectOption={async (option) => {
          if (option == "Remove from folder") {
            setShowFileOptions(false);
            await updateDoc(doc(getFirestore(), "posts", editingPost.id), {
              parentFolderIds: arrayRemove(folderId),
            });

            await updateDoc(doc(getFirestore(), "folders", folderId), {
              fileCount: increment(-1),
            });
            setResults(results.filter((r) => r.id != editingPost.id));
            setEditingPost(null);
          }
          if (option == "Share") {
            setShowFileOptions(false);
            onShare(editingPost);
          }
        }}
        showModal={showFileOptions}
        setShowModal={setShowFileOptions}
      />
    </View>
  );
}

const ListItemNonAudio = ({
  post,
  includeMoreButton,
  onClickMore,
  folderId,
}: {
  post: Post;
  includeMoreButton: boolean;
  onClickMore: any;
  folderId: string;
}) => {
  const me = useMe();
  const navigation = useNavigation();

  const name = useMemo(() => {
    if (post) {
      if (post.uploadTitle) {
        return post.uploadTitle;
      }
      let base = post.image;
      if (post.video) {
        base = post.video;
      }
      if (base.split("%2F").length > 1) {
        let newBase = base.split("%2F")[1];
        return newBase.split("?")[0];
      }
      return post.kind;
    }
    return "";
  }, [post]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: colors.transparentWhite4,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",

          paddingRight: 20,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
          }}
          onPress={() => {
            (navigation as any).navigate("ObjectViewerDetail", {
              postId: post.id,
              parentFolderId: folderId,
            });
          }}
        >
          <ImageBackground
            style={{
              marginTop: 4,
              width: 50,
              height: 50,
              borderRadius: 6,
              overflow: "hidden",
            }}
            source={post.image ? { uri: post.image } : null}
          ></ImageBackground>
          <View
            style={{
              justifyContent: "space-evenly",
              marginLeft: 12,
              width: includeMoreButton ? SCREEN_WIDTH - 125 : SCREEN_WIDTH - 80,
            }}
          >
            <BoldMonoText
              style={{
                fontSize: 18,
              }}
            >
              {`${name}`}
            </BoldMonoText>
          </View>
        </TouchableOpacity>
        {includeMoreButton && (
          <TouchableOpacity
            onPress={() => onClickMore()}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color={"white"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
