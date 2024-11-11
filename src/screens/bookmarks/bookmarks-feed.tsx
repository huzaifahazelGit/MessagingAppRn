import { useFocusEffect } from "@react-navigation/native";
import { collection, getFirestore, orderBy } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { useMe } from "../../hooks/useMe";
import { Paginator } from "../../components/lists/paginator";
import { PostItem } from "../post-item/post-item";
import { IS_ANDROID } from "../../constants/utils";

export const BookmarksFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [needsReload, setNeedsReload] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const me = useMe();

  const checkNeedsFetch = async () => {
    if (me && me.lastBookmark && me.lastBookmark.seconds) {
      let lastCreate = moment(new Date(me.lastBookmark.seconds * 1000));
      let mLastFetch = moment(lastFetch);
      if (mLastFetch.isBefore(lastCreate)) {
        setNeedsReload(true);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (lastFetch) {
        checkNeedsFetch();
      }

      return () => {};
    }, [me.id, lastFetch])
  );

  return (
    <Paginator
      baseCollection={collection(getFirestore(), "users", me.id, "saved")}
      queryOptions={[]}
      orderByOption={orderBy("createdate", "desc")}
      needsReload={needsReload}
      setNeedsReload={setNeedsReload}
      setResults={setFeedItems}
      results={feedItems}
      itemsPerPage={5}
      listEmptyText={"No bookmarked items."}
      renderListItem={function (item: any, visible: boolean) {
        return (
          <PostItem
            post={item}
            onDelete={(post) => {
              setFeedItems([...feedItems].filter((item) => item.id != post.id));
            }}
            visible={visible}
            skipAutoPlay={IS_ANDROID}
          />
        );
      }}
      trackVisible={true}
      setLastFetch={setLastFetch}
    />
  );
};
