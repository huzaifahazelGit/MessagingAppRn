import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Submission } from "../models/submission";
import { collection, query, where } from "firebase/firestore";

export const useChallengeSubmissions = (challengeId: string): Submission[] => {
  if (!challengeId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "submissions");
  const qref = query(coll, where("challengeId", "==", challengeId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const userUserSubmissions = (userId): Submission[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "submissions");
  const qref = query(coll, where("userId", "==", userId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useMyVotes = (challengeId, myId): Submission[] => {
  if (!challengeId || !myId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "submissions");
  const qref = query(
    coll,
    where("votes", "array-contains", myId),
    where("challengeId", "==", challengeId)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
