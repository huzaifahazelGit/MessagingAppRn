import { collection, doc, query, where } from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Company } from "../models/company";

export const useMyCompanies = (userId: string): Company[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "companies");
  const qref = query(coll, where("adminIds", "array-contains", userId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useCompanyForId = (id: string): Company | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "companies", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};
