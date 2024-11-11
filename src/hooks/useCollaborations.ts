import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { DEFAULT_ID, toArray } from "../constants/utils";
import { CollabMessage, Collaboration } from "../models/collaboration";
import { Submission } from "../models/submission";
import { collection, orderBy, query, where } from "firebase/firestore";

export const useMyCollaborations = (userId: string): Collaboration[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "collaborations");
  const qref = query(coll, where("userIds", "array-contains", userId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useCollabMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "collaborationMessages");
  const qref = query(
    coll,
    where("collaborationId", "==", finalCollabId),
    orderBy("createdAt", "desc")
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
