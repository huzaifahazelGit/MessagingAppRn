import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { User } from "../models/user";
import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const useFeaturedUsers = (): User[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "users");
  const qref = query(coll, where("featured", "==", true));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return posts as any;
};

export const useLeaderboard = (): User[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "users");
  const qref = query(coll, orderBy("points", "desc"), limit(1));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useXPLeader = (): User[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "users");
  const qref = query(coll, orderBy("xp", "desc"), limit(1));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useUserForId = (id: string): User | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "users", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};
