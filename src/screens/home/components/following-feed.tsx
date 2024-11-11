import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useMe } from "../../../hooks/useMe";
import { PostItem } from "../../post-item/post-item";
import SessionsList from "../../sessions/list/sessions-list";
import { IS_ANDROID } from "../../../constants/utils";

export const FollowingFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [done, setDone] = useState(false);
  const me = useMe();
  const ref = useRef<any>(null);
  const navigation = useNavigation();
  const [currentVisibleIds, setCurrentVisibleIds] = useState([]);
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = navigation.getParent().addListener("tabPress", (e) => {
      console.log("e", e);
      if (ref && ref.current) {
        if (feedItems.length > 0) {
          ref?.current?.scrollToIndex({ index: 0 });
        }
      }
    });

    return unsubscribe;
  }, [navigation, ref, feedItems]);

  useEffect(() => {
    if (feedItems.length == 0 && !didInitialFetch) {
      setDidInitialFetch(true);
      fetchFeed(null);
    }
  }, [feedItems, didInitialFetch]);

  useFocusEffect(
    useCallback(() => {
      if (lastFetch && !refreshing) {
        checkNeedsFetch();
      }

      return () => {
        setCurrentVisibleIds([]);
      };
    }, [lastFetch, refreshing])
  );

  const checkNeedsFetch = async () => {
    if (me && me.lastReset && me.lastReset.seconds && lastFetch) {
      let lastCreate = moment(new Date(me.lastReset.seconds * 1000));
      let mLastFetch = moment(lastFetch);
      if (mLastFetch.isBefore(lastCreate)) {
        setDone(false);
        setRefreshing(true);
        setLastItem(null);
        setTimeout(() => {
          fetchFeed(null);
        }, 500);
      }
    }
  };

  const fetchFeed = async (lastItem) => {
    if (!fetching) {
      setFetching(true);

      let q = query(
        collection(getFirestore(), "users", me.id, "feed"),
        where("archived", "==", false),
        where("createdate", "<=", new Date()),
        orderBy("createdate", "desc"),
        limit(5)
      );

      if (lastItem) {
        q = query(
          collection(getFirestore(), "users", me.id, "feed"),
          where("archived", "==", false),
          where("createdate", "<=", new Date()),
          orderBy("createdate", "desc"),
          startAfter(lastItem),
          limit(5)
        );
      } else {
        setLastFetch(new Date());
      }

      let snapshot = await getDocs(q);
      let items = [];
      var index = 0;
      snapshot.forEach((item) => {
        items.push({ ...item.data(), id: item.id });
        if (index == snapshot.docs.length - 1) {
          setLastItem(item);
        }
        index++;
      });

      if (items.length < 5) {
        setDone(true);
      }
      if (lastItem) {
        setFeedItems([...feedItems, ...items]);
      } else {
        setFeedItems(items);
      }
      setRefreshing(false);
      setFetching(false);
    }
  };

  const onScroll = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleIds([viewableItems[0].item.id]);
    } else {
      setCurrentVisibleIds([]);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  return (
    <FlatList
      data={feedItems}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      ref={ref}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onScroll}
      onEndReached={() => {
        if (feedItems && feedItems.length > 0 && !fetching && !done) {
          fetchFeed(lastItem);
        }
      }}
      // ListHeaderComponent={<SessionsList kind={"FOLLOWING"} />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setDone(false);
            setRefreshing(true);
            setLastItem(null);
            setFeedItems([]);
            fetchFeed(null);
          }}
        />
      }
      ListFooterComponent={
        fetching && !done && !refreshing ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 14,
            }}
          >
            <ActivityIndicator color={"white"} />
          </View>
        ) : (
          <View />
        )
      }
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <PostItem
          post={item}
          onDelete={(post) => {
            setFeedItems([...feedItems].filter((item) => item.id != post.id));
          }}
          visible={currentVisibleIds.includes(item.id)}
          skipAutoPlay={IS_ANDROID}
        />
      )}
    />
  );
};
