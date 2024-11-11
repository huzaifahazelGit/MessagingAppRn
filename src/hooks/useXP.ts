import { collection, limit, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { XPEarnAction } from "../models/xp";

export const useXP = (userId: string): XPEarnAction[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "users", userId, "xp");
  const qref = query(coll, orderBy("timeCreated", "desc"));

  const { data: items } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (items as any) || [];
};

export const useRecentXP = (userId: string): XPEarnAction[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "users", userId, "xp");
  const qref = query(coll, orderBy("timeCreated", "desc"), limit(1));

  const { data: items } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (items as any) || [];
};
