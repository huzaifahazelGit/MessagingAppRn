import { Feather, FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import { DocumentDirectoryPath, downloadFile } from "react-native-fs";
import CollaborateButton from "../../components/buttons/collaborate-button";
import LikeButton, { LikeStatus } from "../../components/buttons/like-button";
import { BodyText } from "../../components/text";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { BasePostItem } from "../../models/base-post";
import { User } from "../../models/user";
import { getFunctions, httpsCallable } from "firebase/functions";
import { bodyTextForKind } from "../../services/activity-service";
import { ProfileColors } from "../../hooks/useProfileColors";

export function PostButtons({
  post,
  user,
  profileColors,
  onShare,
  vertical,
  setShowComments,
  likeStatus,
  setLikeStatus,
  onRepost,
}: {
  post: BasePostItem;
  user?: User;
  profileColors: ProfileColors;
  onShare: any;
  vertical?: boolean;
  setShowComments: any;
  likeStatus: LikeStatus;
  setLikeStatus: any;
  onRepost: any;
}) {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const navigation = useNavigation();
  const me = useMe();
  const [downloading, setDownloading] = React.useState(false);
  const [downloadCount, setDownloadCount] = React.useState(
    post && (post as any).downloadCount ? (post as any).downloadCount : 0
  );
  const [didIncrementCount, setDidIncrementCount] = React.useState(false);

  const width = SCREEN_WIDTH - 36;

  const downloadAudioFile = async () => {
    setDownloading(true);

    let ending = post.audio.split("%2F").pop();
    let extOne = ending.split(".").pop();
    let ext = `.${extOne.split("?")[0]}`;
    if (post.uploadTitle.includes(ext)) {
      ext = "";
    }
    const path = `${DocumentDirectoryPath}/${
      post.uploadTitle || "audio"
    }${ext}`;

    let filesPath = `shareddocuments://${path}`;

    const response = downloadFile({
      fromUrl: post.audio,
      toFile: path,
    });
    response.promise
      .then(async (res) => {
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          var createActivity = httpsCallable(getFunctions(), "createActivity");

          if (post.userId != me.id) {
            createActivity({
              actor: {
                id: me.id,
                username: me.username,
                profilePicture: me.profilePicture,
              },
              recipientId: post.userId,
              kind: "audio-download",
              post: {
                id: post.id,
                kind: post.kind,
                image: post.image,
              },
              bodyText: bodyTextForKind("audio-download", me),
              extraVars: {},
            });
          }

          if (!didIncrementCount) {
            setDownloadCount(downloadCount + 1);
            setDidIncrementCount(true);
          }
          setDownloading(false);

          Linking.openURL(filesPath);
        } else {
          setDownloading(false);
        }
      })
      .catch((error) => {
        setDownloading(false);
        console.log("error 6");
        console.log(error);
      });
  };

  return (
    <View
      style={
        vertical
          ? { alignItems: "center", paddingBottom: 12 }
          : {
              marginTop: 18,
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }
      }
    >
      <View
        style={
          vertical
            ? { alignItems: "center" }
            : {
                flexDirection: "row",
                alignItems: "center",
              }
        }
      >
        <View style={vertical ? { marginLeft: 8 } : {}}>
          {post.marketplace ? (
            <View />
          ) : (
            <LikeButton
              post={post as any}
              profileColors={profileColors}
              likeStatus={likeStatus}
              setLikeStatus={setLikeStatus}
            />
          )}
        </View>

        <Pressable
          style={
            vertical ? { marginBottom: 8, marginTop: 14 } : { marginLeft: 4 }
          }
          onPress={() => {
            // (navigation as any).navigate("PostDetail", {
            //   postId: post.id,
            //   marketplace: post.marketplace,
            // });
            setShowComments(true);
          }}
        >
          <FontAwesome5 name="comment" size={24} color={textColor} />
        </Pressable>

        {post && post.userId != me.id && (
          <Pressable
            style={vertical ? { marginVertical: 8 } : { marginLeft: 10 }}
            onPress={onRepost}
          >
            <AntDesign name="retweet" size={24} color={textColor} />
          </Pressable>
        )}

        <Pressable
          style={vertical ? { marginVertical: 8 } : { marginLeft: 10 }}
          onPress={onShare}
        >
          <Feather name="send" size={24} color={textColor} />
        </Pressable>

        {/* tara here today  */}
        {post.audio && (post as any).downloadable ? (
          downloading ? (
            <ActivityIndicator
              style={
                vertical
                  ? { marginVertical: 8 }
                  : {
                      marginLeft: 10,
                    }
              }
              color={textColor}
            />
          ) : (
            <Pressable
              style={
                vertical
                  ? { marginVertical: 8 }
                  : {
                      marginLeft: 10,
                    }
              }
              onPress={() => {
                downloadAudioFile();
              }}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={26}
                color={textColor}
              />
            </Pressable>
          )
        ) : (
          <View />
        )}

        {(post as any).downloadable && downloadCount > 0 && !downloading ? (
          <View style={{ marginLeft: 2 }}>
            <BodyText style={{ opacity: 0.7 }}>{downloadCount}</BodyText>
          </View>
        ) : (
          <View />
        )}
      </View>

      <CollaborateButton
        userId={post.userId}
        color={textColor}
        style={vertical ? { marginTop: 12 } : { marginRight: 4 }}
        // @ts-ignore
        marketplaceItem={post.marketplace ? post : null}
      />
    </View>
  );
}
