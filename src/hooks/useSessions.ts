import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { DEFAULT_ID, toArray } from "../constants/utils";
import { Session } from "../models/session";
import { collection, orderBy, query, where } from "firebase/firestore";

export const useUserSessions = (userId: string): Session[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "sessions");
  const qref = query(
    coll,
    where("expired", "==", false),
    where("userId", "==", userId ? userId : DEFAULT_ID)
  );

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useSessions = (kind: string, myId: string): Session[] => {
  if (kind == "FOLLOWING") {
    const firestore = useFirestore();
    const coll = collection(firestore, "users", myId, "sessionFeed");
    const qref = query(
      coll,
      where("expired", "==", false),
      orderBy("timeCreated", "desc")
    );

    const { data: posts } = useFirestoreCollectionData(qref, {
      idField: "id",
    });

    return (posts as any) || [];
  } else {
    const firestore = useFirestore();
    const coll = collection(firestore, "sessions");
    const qref = query(
      coll,
      where("expired", "==", false),
      orderBy("timeCreated", "desc")
    );

    const { data: posts } = useFirestoreCollectionData(qref, {
      idField: "id",
    });

    return (posts as any) || [];
  }
};
