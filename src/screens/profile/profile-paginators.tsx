import { collection, getFirestore, orderBy, where } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { HeaderPaginator } from "../../components/lists/header-paginator";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { ProfileColors } from "../../hooks/useProfileColors";
import { PostItem } from "../post-item/post-item";

export const ProfileContent = ({
  onDelete,
  profileColors,
  userId,
  companyId,
  header,
  deletedPostIds,
  headerVisible,
  setHeaderVisible,
}: {
  onDelete: any;
  profileColors: ProfileColors;
  userId?: string;
  companyId?: string;
  header?: any;
  deletedPostIds: string[];
  headerVisible: boolean;
  setHeaderVisible: any;
}) => {
  const [results, setResults] = useState([]);
  const me = useMe();

  const isMe = useMemo(() => {
    return me && userId && userId == me.id;
  }, [me.id, userId]);

  const { textColor, buttonColor, backgroundColor } = profileColors;

  return (
    <HeaderPaginator
      baseCollection={collection(getFirestore(), "posts")}
      queryOptions={
        companyId
          ? [
              where(
                "collaboratorIds",
                "array-contains",

                companyId ? companyId : DEFAULT_ID
              ),
              where("archived", "==", false),
              where("createdate", "<=", new Date()),
            ]
          : me && me.username == "Tara Wilson"
          ? [
              where(
                "collaboratorIds",
                "array-contains",
                userId ? userId : DEFAULT_ID
              ),

              where("createdate", "<=", new Date()),
            ]
          : [
              where(
                "collaboratorIds",
                "array-contains",
                userId ? userId : DEFAULT_ID
              ),
              where("archived", "==", false),
              where("createdate", "<=", new Date()),
            ]
      }
      orderByOption={orderBy("createdate", "desc")}
      needsReload={false}
      header={header}
      style={{ marginTop: -1 * SCREEN_WIDTH + (isMe ? 100 : 125) }}
      contentContainerStyle={{ paddingTop: 120 }}
      trackVisible={true}
      headerVisible={headerVisible}
      setHeaderVisible={setHeaderVisible}
      setNeedsReload={() => {}}
      setResults={setResults}
      results={results.filter((item) => !deletedPostIds.includes(item.id))}
      itemsPerPage={5}
      textColor={textColor}
      listEmptyText={"NO POSTS YET"}
      renderListItem={function (item: any, visible: boolean) {
        return (
          <PostItem
            post={item}
            profileId={userId ? userId : null}
            onDelete={(post) => {
              onDelete(post);
            }}
            visible={visible}
            // skipAutoPlay={IS_ANDROID}
            skipAutoPlay={true}
          />
        );
      }}
      setLastFetch={() => {}}
    />
  );
};

export const ProfileMarketplace = ({
  userId,
  header,
  onDelete,
  profileColors,
  deletedPostIds,
  headerVisible,
  setHeaderVisible,
}: {
  userId: string;
  header?: any;
  onDelete: any;
  profileColors: ProfileColors;
  deletedPostIds: string[];
  headerVisible: boolean;
  setHeaderVisible: any;
}) => {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const [results, setResults] = useState([]);
  const me = useMe();

  const isMe = useMemo(() => {
    return me && userId && userId == me.id;
  }, [me.id, userId]);

  return (
    <HeaderPaginator
      baseCollection={collection(getFirestore(), "marketplace")}
      queryOptions={[
        where("userId", "==", userId ? userId : DEFAULT_ID),
        where("archived", "==", false),
        where("createdate", "<=", new Date()),
      ]}
      orderByOption={orderBy("createdate", "desc")}
      needsReload={false}
      setNeedsReload={() => {}}
      setResults={setResults}
      results={results.filter((item) => !deletedPostIds.includes(item.id))}
      itemsPerPage={5}
      header={header}
      textColor={textColor}
      listEmptyText={"NO MARKETPLACE POSTS YET"}
      renderListItem={function (item: any, visible: boolean) {
        return (
          <PostItem
            post={item}
            marketplace={true}
            profileId={userId}
            onDelete={(post) => {
              onDelete(post);
            }}
            visible={visible}
          />
        );
      }}
      style={{ marginTop: -1 * SCREEN_WIDTH + (isMe ? 100 : 125) }}
      contentContainerStyle={{ paddingTop: 120 }}
      trackVisible={true}
      headerVisible={headerVisible}
      setHeaderVisible={setHeaderVisible}
      setLastFetch={() => {}}
    />
  );
};
