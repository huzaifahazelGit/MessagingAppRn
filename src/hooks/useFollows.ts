import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Cosign } from "../models/cosign";

export const useCosigns = (userId): Cosign[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "cosigns");
  const qref = query(coll, where("toUserId", "==", userId));

  const { data: cosigns } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (cosigns as any) || [];
};
