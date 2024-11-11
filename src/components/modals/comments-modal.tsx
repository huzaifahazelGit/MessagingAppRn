import { Entypo } from "@expo/vector-icons";
import {
  GiphyDialog,
  GiphyDialogEvent,
  GiphyDialogMediaSelectEventHandler,
  GiphyMedia,
  GiphyThemePreset,
} from "@giphy/react-native-sdk";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import { colors } from "../../constants/colors";
import { IS_ANDROID } from "../../constants/utils";
import { usePostComments } from "../../hooks/usePosts";
import { Post } from "../../models/post";
import CommentInput from "../../screens/comments/comment-input";
import CommentsList from "../../screens/comments/comment-list";

export function CommentsModal({
  post,
  marketplace,
  showComments,
  setShowComments,
}: {
  post: Post;

  marketplace: boolean;
  showComments: boolean;
  setShowComments: any;
}) {
  const comments = usePostComments(post.id);
  const [selectedComment, setSelectedComment] = useState(null);
  const [comment, setComment] = React.useState("");
  const [subComments, setSubComments] = useState([]);
  const [media, setMedia] = useState<GiphyMedia | null>(null);
  const ref = useRef();
  const navigation = useNavigation();
  const _translateYAnim = React.useMemo(() => new Animated.Value(0), []);

  const gesterRef = useRef<{
    translateY: number;
  }>({
    translateY: 0,
  });

  useEffect(() => {
    GiphyDialog.configure({ theme: GiphyThemePreset.Dark });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (ref && ref.current) {
        // @ts-ignore
        ref.current.scrollToEnd();
      }
    }, 100);
  }, [showComments]);

  useEffect(() => {
    let items = (comments || []).filter((item) => item.parentCommentId);
    if (items.length != subComments.length) {
      setSubComments(items);
    }
  }, [comments, subComments]);

  const _onTranslateHandler = ({
    nativeEvent: { translationX, translationY },
  }: PanGestureHandlerGestureEvent) => {
    _translateYAnim.setValue(gesterRef.current.translateY + translationY);
  };

  const _onTranslateStateChange = ({
    nativeEvent: { translationX, translationY, state },
  }: PanGestureHandlerGestureEvent) => {
    if (state === State.END) {
      gesterRef.current.translateY += translationY;
      if (gesterRef.current.translateY + translationY > 200) {
        setShowComments(false);
        setTimeout(() => {
          _translateYAnim.setValue(0);
          gesterRef.current.translateY = 0;
        }, 1000);
      } else {
        _translateYAnim.setValue(0);
        gesterRef.current.translateY = 0;
      }
    }
  };

  return (
    <Modal visible={showComments} transparent={true} animationType={"slide"}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ height: 150 }}
          onPress={() => setShowComments(false)}
        ></TouchableOpacity>
        <PanGestureHandler
          onHandlerStateChange={_onTranslateStateChange}
          onGestureEvent={_onTranslateHandler}
        >
          <Animated.View
            style={{
              flex: 1,

              backgroundColor: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              justifyContent: "flex-end",
              paddingBottom: 12,
              transform: [
                {
                  translateY: _translateYAnim,
                },
              ],
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomColor: colors.gray,
                borderBottomWidth: 1,
                marginHorizontal: 12,
                marginBottom: 8,
              }}
            >
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Entypo name="chevron-down" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            {comments && comments.length > 0 ? (
              <ScrollView
                ref={ref}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  justifyContent: "flex-end",
                }}
              >
                <CommentsList
                  comments={(comments || []).filter(
                    (item) => !item.parentCommentId
                  )}
                  subComments={subComments}
                  selectedComment={selectedComment}
                  setSelectedComment={setSelectedComment}
                  textColor={colors.black}
                  onPressUser={(userId) => {
                    setShowComments(false);
                    setTimeout(() => {
                      (navigation as any).navigate("ProfileStack", {
                        screen: "ProfileScreen",
                        params: { userId: userId },
                      });
                    }, 500);
                  }}
                />
              </ScrollView>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <KeyboardAvoidingView
              behavior={!IS_ANDROID ? "padding" : "height"}
              keyboardVerticalOffset={150}
            >
              <CommentInput
                postId={post.id}
                post={post}
                selectedComment={selectedComment}
                setSelectedComment={setSelectedComment}
                setMedia={setMedia}
                media={media}
                showGiphy={() => {
                  var listener: any;
                  const handler: GiphyDialogMediaSelectEventHandler = (e) => {
                    setMedia(e.media);
                    GiphyDialog.hide();
                    setTimeout(() => {
                      setShowComments(true);
                    }, 500);
                    listener.remove();
                  };
                  listener = GiphyDialog.addListener(
                    GiphyDialogEvent.MediaSelected,
                    handler
                  );

                  setShowComments(false);
                  setTimeout(() => {
                    GiphyDialog.show();
                  }, 500);
                }}
                comment={comment}
                setComment={setComment}
                placeholderColor="rgba(0, 0, 0, 0.6)"
                textColor={colors.black}
                setShowComments={setShowComments}
              />
            </KeyboardAvoidingView>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}
