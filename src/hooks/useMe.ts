import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { DEFAULT_ID, toArray } from "../constants/utils";
import { SearchQuery, SearchSession } from "../models/searchQuery";
import { User } from "../models/user";
import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Post } from "../models/post";
import { Folder } from "../models/folder";

export const useMe = (): User => {
  const { data: user } = useUser();
  const ref = doc(
    useFirestore(),
    "users",
    user && user.uid ? user.uid : DEFAULT_ID
  );

  const { status, data: profile } = useFirestoreDocData(ref, {
    idField: "id",
  });

  const me = {
    ...user,
    ...profile,
    profileLoaded: status === "success",
  };

  return me as any;
};

export const useMySearchSessions = (userId): SearchSession[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "users", userId, "searchSessions");
  const qref = query(coll, orderBy("timeCreated", "desc"));

  const { data: items } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (items as any) || [];
};

export const useMySearches = (userId, sessionId): SearchQuery[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "users", userId, "search");
  const qref = query(
    coll,
    where("sessionId", "==", sessionId),
    orderBy("timeCreated", "desc")
  );

  const { data: cosigns } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (cosigns as any) || [];
};

export const useMyPosts = (userId): Post[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");
  const qref = query(
    coll,
    where("kind", "in", ["video", "audio", "image"]),
    where("userId", "==", userId),
    where("reposted", "==", false),
    orderBy("createdate", "desc"),
    limit(6)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useMyFolders = (userId): Folder[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "folders");
  const qref = query(
    coll,
    where("userId", "==", userId),
    where("archived", "==", false)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useMyLatestAudio = (userId): Post[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");
  const qref = query(
    coll,
    where("kind", "in", ["audio"]),
    where("userId", "==", userId),
    where("reposted", "==", false),
    orderBy("createdate", "desc"),
    limit(5)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useMyLatestImages = (userId): Post[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");
  const qref = query(
    coll,
    where("kind", "in", ["image"]),
    where("userId", "==", userId),
    where("reposted", "==", false),
    orderBy("createdate", "desc"),
    limit(5)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useMyLatestVideos = (userId): Post[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "posts");
  const qref = query(
    coll,
    where("kind", "in", ["video"]),
    where("userId", "==", userId),
    where("reposted", "==", false),
    orderBy("createdate", "desc"),
    limit(5)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
