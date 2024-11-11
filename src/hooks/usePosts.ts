import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { MarketplaceItem } from "../models/marketplace";
import { Comment, Post } from "../models/post";

export const usePostComments = (postId: string): Comment[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "posts", postId, "comments");
  const qref = query(coll, orderBy("createdate", "asc"));

  const { data: comments } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (comments as any) || [];
};

export const usePostForId = (id: string): Post | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "posts", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};

export const useMarketplacePostForId = (id: string): MarketplaceItem | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "marketplace", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};

export const useFeaturedPosts = (letter: string): Post[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");

  const qref = query(
    coll,
    // where("featured", "==", true),
    // where("image", ">", ""),
    where("archived", "==", false),
    where("reposted", "==", false),
    orderBy("description", "desc"),
    startAfter(letter),
    limit(40)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useRecentImagePosts = (userId): Post[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");
  const qref = query(
    coll,
    where("playlistIds", "array-contains", userId),
    orderBy("createdate", "desc"),
    limit(20)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useFeaturedMarketplace = (): MarketplaceItem[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "marketplace");
  const qref = query(
    coll,
    where("featured", "==", true),
    orderBy("createdate", "desc")
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
