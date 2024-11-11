import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  CollectionReference,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useMe } from "../../hooks/useMe";
import { BoldMonoText } from "../text";

export const HeaderPaginator = ({
  results,
  setResults,
  needsReload,
  setNeedsReload,
  setLastFetch,
  baseCollection,
  queryOptions,
  itemsPerPage,
  contentContainerStyle,
  orderByOption,
  listEmptyText,
  trackVisible,
  renderListItem,
  header,
  textColor,
  numColumns,
  headerVisible,
  setHeaderVisible,
  style,
}: {
  baseCollection: CollectionReference;
  queryOptions: QueryFieldFilterConstraint[];
  orderByOption: QueryOrderByConstraint;
  contentContainerStyle?: any;
  needsReload: boolean;
  setNeedsReload: any;
  setLastFetch: any;
  setResults: any;
  results: any[];
  itemsPerPage: number;
  listEmptyText: string;
  trackVisible: boolean;
  renderListItem: (item: any, visible: boolean, index: number) => any;
  header: any;
  headerVisible: boolean;
  setHeaderVisible: any;
  textColor?: string;
  style?: any;
  numColumns?: number;
}) => {
  const [fetching, setFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [done, setDone] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [currentVisibleIds, setCurrentVisibleIds] = useState([]);
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const me = useMe();

  const navigation = useNavigation();
  const ref = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    let parent = navigation.getParent();
    if (parent) {
      const unsubscribe = (parent as any).addListener("tabPress", (e) => {
        if (ref && ref.current) {
          if (results.length > 0) {
            ref?.current?.scrollToOffset({ y: 0, animated: true });
          }
        }
      });

      return unsubscribe;
    }
  }, [navigation, ref, results]);

  useEffect(() => {
    if (me && me.id && results.length == 0 && !didInitialFetch) {
      setDidInitialFetch(true);
      fetchFeed(null);
    }
  }, [
    me,
    results,
    didInitialFetch,
    baseCollection,
    queryOptions,
    orderByOption,
  ]);

  useEffect(() => {
    if (needsReload) {
      setNeedsReload(false);
      setReloading(true);
      setDone(false);
      setRefreshing(true);
      setLastItem(null);
      setTimeout(() => {
        fetchFeed(null);
      }, 500);
    }
  }, [needsReload]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setCurrentVisibleIds([]);
      };
    }, [])
  );

  const fetchFeed = async (lastItem) => {
    if (!fetching) {
      setFetching(true);
      let shouldSetLastFetch = false;
      let q = query(
        baseCollection,
        ...queryOptions,
        orderByOption,
        limit(itemsPerPage)
      );

      if (lastItem) {
        q = query(
          baseCollection,
          ...queryOptions,
          orderByOption,
          startAfter(lastItem),
          limit(itemsPerPage)
        );
      } else {
        shouldSetLastFetch = true;
      }

      let snapshot = await getDocs(q);

      let items: any[] = [];
      var index = 0;
      snapshot.forEach((item) => {
        items.push({ ...item.data(), id: item.id });
        if (index == snapshot.docs.length - 1) {
          setLastItem(item);
        }
        index++;
      });

      if (items.length < itemsPerPage) {
        setDone(true);
      }
      if (lastItem) {
        setResults([...results, ...items]);
      } else {
        setResults(items);
      }
      setRefreshing(false);
      setFetching(false);
      setReloading(false);
      if (shouldSetLastFetch) {
        setLastFetch(new Date());
      }
    }
  };

  const onScrollWithHeader = useCallback(({ viewableItems }) => {
    let isVisible = viewableItems[0].item.header == true;
    setHeaderVisible(isVisible);

    if (viewableItems.length > 0) {
      setCurrentVisibleIds([viewableItems[0].item.id]);
    } else {
      setCurrentVisibleIds([]);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  const cleanedResults = useMemo(() => {
    let initial = [];
    if (numColumns && numColumns > 1) {
      // for (let i = 0; i < numColumns; i++) {
      //   initial.push({ header: true });
      // }
    } else {
      initial = [{ header: true }];
    }
    initial = [...initial, ...results];
    return initial;
  }, [results, numColumns]);

  return (
    <FlatList
      nestedScrollEnabled={true}
      data={cleanedResults}
      style={{ ...style }}
      contentContainerStyle={{
        paddingBottom: 60,
        ...contentContainerStyle,
      }}
      ref={ref}
      onEndReached={() => {
        if (results && results.length > 0 && !fetching && !done) {
          fetchFeed(lastItem);
        }
      }}
      ListHeaderComponent={numColumns && numColumns > 1 ? header : undefined}
      numColumns={numColumns}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={trackVisible ? onScrollWithHeader : undefined}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            if (!fetching) {
              setDone(false);
              setLastItem(null);
              setResults([]);
              fetchFeed(null);
              setRefreshing(true);
            }
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
      renderItem={({ item, index }) =>
        item.header ? (
          numColumns && numColumns > 1 ? (
            <View></View>
          ) : (
            <View>
              {header}
              {results.length == 0 && (
                <View>
                  {reloading ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 14,
                      }}
                    >
                      <ActivityIndicator color={"white"} />
                    </View>
                  ) : fetching || (refreshing && !done) ? (
                    <View />
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 14,
                        opacity: 0.8,
                        marginTop: 20,
                      }}
                    >
                      <BoldMonoText
                        style={{ color: textColor ? textColor : "white" }}
                      >
                        {listEmptyText}
                      </BoldMonoText>
                    </View>
                  )}
                </View>
              )}
            </View>
          )
        ) : (
          renderListItem(
            item,
            currentVisibleIds.includes((item as any).id),
            index
          )
        )
      }
    />
  );
};
