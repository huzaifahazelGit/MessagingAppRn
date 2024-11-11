import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { User } from "../models/user";
import { Post } from "../models/post";

export const useExecutiveArtists = (userId: string): User[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "users");
  const qref = query(coll, where("executiveIds", "array-contains", userId));

  const { data: users } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (users as any) || [];
};
