import { collection, doc, query, where } from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Challenge } from "../models/challenge";

export const useChallenges = (): Challenge[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "challenges");
  const qref = query(coll);

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  // return (posts as any) || [];
  return ((posts as any) || []).filter((item) => !item.archived);
};

export const useWinnerChallenges = (userId: String): Challenge[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "challenges");
  const qref = query(coll, where("winnerIds", "array-contains", userId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return ((posts as any) || []).filter((item) => !item.archived);
};

export const useChallengeForId = (id: string): Challenge | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "challenges", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};
