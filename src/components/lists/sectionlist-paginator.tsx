import { useNavigation } from "@react-navigation/native";
import {
  CollectionReference,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from "react-native";
import { useMe } from "../../hooks/useMe";
import { BoldMonoText } from "../text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SectionlistPaginator = ({
  results,
  setResults,
  baseCollection,
  queryOptions,
  itemsPerPage,
  contentContainerStyle,
  orderByOption,
  listEmptyText,
  renderListTitle,
  renderListItem,
  header,
  textColor,
  sectionData,
}: {
  baseCollection: CollectionReference;
  queryOptions: QueryFieldFilterConstraint[];
  orderByOption: QueryOrderByConstraint;
  contentContainerStyle?: any;

  setResults: any;
  results: any[];
  itemsPerPage: number;
  listEmptyText: string;
  sectionData: any;
  renderListTitle: (title: string) => any;
  renderListItem: (item: any, sectionTitle: string) => any;
  header?: any;
  textColor?: string;
}) => {
  const insets = useSafeAreaInsets();
  const [fetching, setFetching] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [done, setDone] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [didInitialFetch, setDidInitialFetch] = useState(false);
  const me = useMe();
  const ref = useRef<any>(null);

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
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  return (
    <SectionList
      sections={sectionData}
      contentContainerStyle={{
        paddingBottom: 60,
        ...contentContainerStyle,
      }}
      style={{ marginTop: insets.top + 30 }}
      ref={ref}
      ListHeaderComponent={header ? header : undefined}
      onEndReached={() => {
        // console.log("on end reached");
        if (results && results.length > 0 && !fetching && !done) {
          fetchFeed(lastItem);
        }
      }}
      viewabilityConfig={viewabilityConfig}
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
      ListEmptyComponent={
        reloading ? (
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
            <BoldMonoText style={{ color: textColor ? textColor : "white" }}>
              {listEmptyText}
            </BoldMonoText>
          </View>
        )
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
      renderItem={({ section: { title }, item }) => renderListItem(item, title)}
      renderSectionHeader={({ section: { title } }) => renderListTitle(title)}
    />
  );
};
