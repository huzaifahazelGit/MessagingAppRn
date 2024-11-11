import { collection, query, where ,doc} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

export const useSeller = () => {
//   if (!userId) {
//     return [];
//   }
  const firestore = useFirestore();
  const coll = collection(firestore,"market_selling");
  const qref = query(coll);
  const { data: market_selling } = useFirestoreCollectionData(qref, {
    // idField: "id",
  });
//   console.log("--data11--",market_selling);
  return (market_selling as any) || [];
  
};
