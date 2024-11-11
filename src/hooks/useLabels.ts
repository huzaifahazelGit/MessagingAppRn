import { collection, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

export const useLabels = (): {
  name: string;
  imageURL: string;
  id: string;
}[] => {
  const firestore = useFirestore();
  const coll = collection(firestore, "labels");
  const qref = query(coll);

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
