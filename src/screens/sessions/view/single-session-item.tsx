import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  increment,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { didWatchSession } from "../../../store/follows-collabs-store";
import { SeenPreviewList } from "../components/seen-preview-list";
import SuperImage from "../components/super-image";
import { StoryData } from "../session-constants";

export type StoryController = {
  currentGroupIndex: number;
};

const SingleSessionItem = ({
  data,
  index,
  maxIndex,

  controller,
  setController,
}: {
  data: StoryData;
  index: number;
  maxIndex: number;

  controller: StoryController;
  setController: (preGroupIndex: number, nextGroupIndex: number) => void;
}) => {
  const navigation = useNavigation();

  const getNextIndex = React.useCallback((): number => {
    let nextIndex = 0;
    data.sessions.every((story, storyIndex) => {
      if (!(story.seenIds || []).includes(me.id)) {
        nextIndex = storyIndex;
        return false;
      }
      return true;
    });
    return nextIndex;
  }, []);

  const me = useMe();
  const isMyStory = me.id === data.user.id;

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [childIndex, setChildIndex] = useState<number>(getNextIndex());
  const [seenAll, setSeenAll] = useState<boolean>(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<{
    message: string;
    allowAnimationCallback: boolean;
  }>({
    message: "",
    allowAnimationCallback: false,
  });

  const animXList = data.sessions.map((x) => new Animated.Value(0));

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (controller.currentGroupIndex === index && ready) {
      markWatched(childIndex);
    }
  }, [controller, index, childIndex, ready]);

  const markWatched = (animIndex: number) => {
    let id = `${data.sessions[animIndex].id}`;
    didWatchSession(id);
    const docRef = doc(getFirestore(), "sessions", id);

    getDoc(docRef).then((storyDoc) => {
      const currentSeenIds: string[] = (storyDoc.data() || {}).seenIds || [];
      const currentSeenAvatars: string[] =
        (storyDoc.data() || {}).seenAvatars || [];
      if (currentSeenIds.indexOf(`${me.id}`) < 0) {
        const includeNewAvatar =
          currentSeenAvatars.length < 5 && me && me.profilePicture;

        updateDoc(storyDoc.ref, {
          seenIds: arrayUnion(`${me.id}`),
          seenCount: increment(1),
          seenAvatars: includeNewAvatar
            ? arrayUnion(me.profilePicture)
            : [...currentSeenAvatars],
        });

        data.sessions[animIndex].seenIds = [...currentSeenIds, me.id];
      }
    });
  };

  useEffect(() => {
    if (controller.currentGroupIndex === index && ready) {
      if (seenAll) {
        animXList.map((animX) => animX.setValue(0));
        setSeenAll(false);
        setReady(false);
        return setChildIndex(0);
      }
      animXList.every((animX, animIndex) => {
        if (animIndex === childIndex) {
          ref.current.allowAnimationCallback = true;
          animX.setValue(0);

          Animated.timing(animX, {
            toValue: 1,
            duration: data.sessions[childIndex].duration * 1000,
            useNativeDriver: false,
          }).start((finalValue) => {
            if (finalValue.finished) {
              if (ref.current.allowAnimationCallback) {
                if (childIndex + 1 < data.sessions.length) {
                  setReady(false);
                  setChildIndex(childIndex + 1);
                } else {
                  if (index < maxIndex) {
                    setController(index, index + 1);
                  } else {
                    navigation.goBack();
                  }
                }
              }
            }
          });
          return false;
        }

        return true;
      });
    } else {
      stopAnimation();
    }
  }, [controller, childIndex, seenAll, ready]);

  const _onNext = () => {
    if (childIndex + 1 < data.sessions.length) {
      stopAnimation();
      setReady(false);
      setChildIndex(childIndex + 1);
    } else {
      stopAnimation();
      if (index < maxIndex) {
        console.log("2");
        setController(index, index + 1);
      } else {
        navigation.goBack();
      }
    }
  };

  const stopAnimation = (allowCallback: boolean = false) => {
    ref.current.allowAnimationCallback = allowCallback;
    animXList.map((animX) => animX.stopAnimation());
  };

  const _onBack = () => {
    if (childIndex > 0) {
      stopAnimation();
      animXList.slice(childIndex).map((animX) => animX.setValue(0));
      setTimeout(() => {
        setReady(false);
        setChildIndex(childIndex - 1);
      }, 300);
    } else {
      setController(index, index - 1);
    }
  };

  const _onConfirmDelete = async () => {
    setShowConfirmDelete(false);
    const uid = data.sessions[childIndex].id;

    let ref = doc(getFirestore(), "sessions", `${uid}`);
    await updateDoc(ref, {
      archived: true,
      expired: true,
    });

    navigation.goBack();
  };

  const timeoutBarItemWidth = SCREEN_WIDTH / data.sessions.length - 3;
  const seenIds = [...(data.sessions[childIndex]?.seenIds || [])];

  if (animXList.length < 1) {
    return <View />;
  }
  return (
    <React.Fragment>
      {showConfirmDelete && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowConfirmDelete(false);
          }}
          style={styles.backdrop}
        >
          <View style={styles.confirmBox}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 15,
              }}
            >
              Delete Story?
            </Text>
            <TouchableOpacity
              onPress={_onConfirmDelete}
              style={styles.btnConfirm}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "red",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmDelete(false);
              }}
              style={styles.btnConfirm}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      {showOptions && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => {
            setShowOptions(false);
          }}
          activeOpacity={1}
        >
          <View style={styles.optionsWrapper}>
            <TouchableHighlight underlayColor="#eee" style={styles.optionItem}>
              <Text>Report...</Text>
            </TouchableHighlight>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          {data.sessions.map((storyItem, storyIndex) => (
            <View key={storyIndex}>
              {((index === controller.currentGroupIndex &&
                storyIndex === childIndex) ||
                storyIndex === childIndex) && (
                <SuperImage
                  session={storyItem}
                  onStopAnimation={stopAnimation}
                  onNext={_onNext}
                  onBack={_onBack}
                  setReady={setReady}
                  superId={storyItem.superImageId}
                />
              )}
            </View>
          ))}
        </View>
        <View style={styles.topWrapper}>
          <View style={styles.topInfo}>
            <Image
              style={styles.avatar}
              source={{
                uri: data.user.profilePicture,
              }}
            />
            <Text
              style={{
                fontWeight: "600",
                color: "#fff",
                marginLeft: 10,
              }}
            >
              {data.user.username}
            </Text>
            {controller.currentGroupIndex === index && (
              <Text
                style={{
                  fontWeight: "600",
                  color: "#ddd",
                  marginLeft: 10,
                }}
              >
                {moment(
                  new Date(
                    (data.sessions[childIndex]?.timeCreated?.seconds || 0) *
                      1000
                  )
                ).format("hh:mm A")}
              </Text>
            )}
          </View>
          <View style={styles.timeoutBarWrapper}>
            {data.sessions.map((storyItem, storyIndex) => (
              <View
                key={storyIndex}
                style={{
                  ...styles.timeoutBarItem,
                  width: timeoutBarItemWidth,
                }}
              >
                <Animated.View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    width: timeoutBarItemWidth,
                    backgroundColor: "#fff",
                    transform: [
                      {
                        translateX: animXList[storyIndex].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-timeoutBarItemWidth, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }}
                />
              </View>
            ))}
          </View>
        </View>
        <KeyboardAvoidingView
          style={{
            width: SCREEN_WIDTH,
            height: 80,
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
          behavior="position"
        >
          <View style={styles.bottomWrapper}>
            {isMyStory && (
              <React.Fragment>
                <View>
                  {seenIds.length > 0 && (
                    <SeenPreviewList
                      stopAnimation={stopAnimation}
                      session={data.sessions[childIndex]}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowConfirmDelete(true);
                      stopAnimation();
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                        width: 30,
                        marginBottom: 5,
                      }}
                    >
                      <Icon name="trash-can" size={30} color="#fff" />
                    </View>
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 12,
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </React.Fragment>
  );
};

export default React.memo(SingleSessionItem);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 60,
  },
  backdrop: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsWrapper: {
    overflow: "hidden",
    width: "80%",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  optionItem: {
    height: 44,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  topWrapper: {
    height: 50 + 0,
    paddingTop: 0,
  },
  timeoutBarWrapper: {
    position: "absolute",
    top: 0,
    height: 3,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  timeoutBarItem: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 3,
    overflow: "hidden",
  },
  topInfo: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  bottomWrapper: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  messageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 44,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  messageInput: {
    height: 44,
    width: SCREEN_WIDTH - 30 - 44 * 2 - 20,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 44,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
  },
  btnSend: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  btnOptions: {
    position: "absolute",
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 10,
  },

  confirmBox: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  btnConfirm: {
    height: 44,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
});
