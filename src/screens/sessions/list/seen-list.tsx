import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { Session } from "../../../models/session";
import { User } from "../../../models/user";
import SuperImage from "../components/super-image";

const STATUS_BAR_HEIGHT = 20;

const StorySeenList = () => {
  const route = useRoute();

  const params = route.params as any;
  const me = useMe();
  const [story, setStory] = useState<Session>();
  const [viewerInfos, setViewerInfos] = useState<User[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setStory(JSON.parse(params.session));
  }, []);

  const filteredSeenList = useMemo(() => {
    if (story) {
      return story.seenIds;
    }
    return [];
  }, [story]);

  const _anim = React.useMemo(() => new Animated.Value(0), []);
  const ref = useRef<{ animating: boolean }>({ animating: false });

  useEffect(() => {
    (async () => {
      const fetchUserInfoTask: Promise<User>[] = filteredSeenList.map(
        async (usr) => {
          const docRef = doc(getFirestore(), "users", `${usr}`);
          const rq = await getDoc(docRef);

          return { ...(rq.data() || {}), id: usr } as any;
        }
      );
      Promise.all(fetchUserInfoTask).then((rs) => {
        setViewerInfos([...rs]);
      });
    })();
  }, [filteredSeenList]);

  const _onAnimation = () => {
    if (ref.current.animating) return;
    Animated.timing(_anim, {
      toValue: 1,
      useNativeDriver: false,
      duration: 400,
    }).start();
    ref.current.animating = true;
  };

  const _onGoBack = () => {
    Animated.timing(_anim, {
      toValue: 0,
      useNativeDriver: false,
      duration: 250,
    }).start(() => {
      navigation.goBack();
    });
  };

  let seenCount = story ? story.seenCount || 0 : 0;

  if (!story) {
    return null;
  }
  return (
    <React.Fragment>
      <View>
        <Animated.View
          style={{
            ...styles.storyTopWrapper,
            opacity: _anim,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View></View>
            <TouchableOpacity onPress={_onGoBack} style={styles.btnOption}>
              <Text
                style={{
                  fontSize: 30,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.triangle} />
        </Animated.View>
        <Animated.View
          style={{
            ...styles.mainContainer,
            opacity: _anim,
          }}
        >
          <View style={styles.optionsBar}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="eye" size={20} />
              <Text
                style={{
                  marginLeft: 5,
                }}
              >
                {seenCount}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "600",
                margin: 15,
              }}
            >
              Viewers
            </Text>
            <FlatList
              style={{
                height: SCREEN_HEIGHT - HEADER_SIZE - 44 - 50,
              }}
              data={viewerInfos}
              renderItem={({ item }) => <ViewerItem user={item} />}
              keyExtractor={(_, index) => `${index}`}
            />
          </View>
        </Animated.View>
      </View>
      <Animated.View
        style={{
          ...styles.storyImage,
          transform: [
            {
              translateX: _anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (SCREEN_WIDTH - 150) / 2],
              }),
            },
            {
              translateY: _anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, STATUS_BAR_HEIGHT],
              }),
            },
          ],
          width: _anim.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_WIDTH, 150],
          }),
          height: _anim.interpolate({
            inputRange: [0, 1],
            outputRange: [SCREEN_HEIGHT, 250],
          }),
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={_onGoBack}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <SuperImage
            showOnlyImage={true}
            disablePress={true}
            setReady={_onAnimation}
            fitSize={true}
            superId={story.superImageId as number}
            session={story}
          />
        </TouchableOpacity>
      </Animated.View>
    </React.Fragment>
  );
};
export default StorySeenList;

const HEADER_SIZE = 250 + 30 + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT - HEADER_SIZE,
  },
  optionsBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 0.5,
  },
  storyImage: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  storyTopWrapper: {
    width: "100%",
    height: HEADER_SIZE,
    paddingTop: STATUS_BAR_HEIGHT,
    backgroundColor: "rgb(242,242,242)",
  },
  triangle: {
    position: "absolute",
    zIndex: 1,
    borderColor: "#fff",
    borderRightWidth: 15,
    borderLeftWidth: 15,
    borderRightColor: "rgba(0,0,0,0)",
    borderLeftColor: "rgba(0,0,0,0)",
    borderBottomWidth: 15,
    bottom: 0,
    left: (SCREEN_WIDTH - 30) / 2,
  },
  btnOption: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 7.5,
  },
  btnViewerOption: {
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerAvatar: {
    height: 50,
    width: 50,
    borderRadius: 64,
    borderColor: "#333",
    borderWidth: 0.3,
    marginRight: 10,
  },
  backdrop: {
    zIndex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
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
  },
  msgInput: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",

    backgroundColor: "#fff",
  },
  msgUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderTopColor: "#ddd",
  },
  msgTxtInput: {
    height: 44,
    paddingHorizontal: 15,
    paddingRight: 75,
    borderColor: "#ddd",
    borderRadius: 44,
    borderWidth: 1,
    width: SCREEN_WIDTH - 30,
  },
  btnSend: {
    height: 44,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
interface ViewerItemProps {
  user: User;
}
const ViewerItem = React.memo(({ user }: ViewerItemProps) => {
  const navigation = useNavigation();
  const _onViewProfile = () => {
    (navigation as any).navigate("Tabs");
    (navigation as any).navigate("ProfileStack", {
      screen: "ProfileScreen",
      params: { userId: user.id },
    });
  };

  return (
    <TouchableOpacity onPress={_onViewProfile} style={styles.viewerItem}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: user.profilePicture,
          }}
          style={styles.viewerAvatar}
        />
        <View>
          <Text
            style={{
              fontWeight: "500",
            }}
          >
            {user.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
