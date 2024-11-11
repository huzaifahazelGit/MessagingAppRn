import { collection, doc, orderBy, query, where } from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import { Playlist } from "../models/playlist";

export const usePlaylists = (userId: string): Playlist[] => {
  if (userId && userId.length > 0) {
    const firestore = useFirestore();
    const coll = collection(firestore, "playlists");
    const qref = query(
      coll,
      where("ownerId", "==", userId),
      orderBy("lastUpdated", "desc")
    );

    const { data: comments } = useFirestoreCollectionData(qref, {
      idField: "id",
    });

    return (comments as any) || [];
  } else {
    return [];
  }
};

export const usePlaylistById = (id: string): Playlist | null => {
  if (id && id.length > 0) {
    const firestore = useFirestore();
    const ref = doc(firestore, "playlists", id);

    const { status, data: item } = useFirestoreDocData(ref, {
      idField: "id",
    });

    return item as any;
  } else {
    return null;
  }
};
