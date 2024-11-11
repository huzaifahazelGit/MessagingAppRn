import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { CollabMessage } from "../models/collaboration";
import { Room } from "../models/room";

export const useMyRooms = (userId: string): Room[] => {
  if (!userId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms");
  const qref = query(coll, where("userIds", "array-contains", userId));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useRoomMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, orderBy("createdAt", "desc"));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useRoomAudioMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "==", "audio"));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useRoomOtherMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "in", ["file", "image"]));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useRoomLinkMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "==", "link"));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useLimitedRoomAudioMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "==", "audio"), limit(4));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useLimitedRoomOtherMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "in", ["file", "image"]), limit(4));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};

export const useLimitedRoomLinkMessages = (finalCollabId): CollabMessage[] => {
  if (!finalCollabId) {
    return [];
  }
  const firestore = useFirestore();
  const coll = collection(firestore, "rooms", finalCollabId, "messages");
  const qref = query(coll, where("kind", "in", ["link"]), limit(4));

  const { data: posts } = useFirestoreCollectionData(qref, {
    idField: "id",
  });

  return (posts as any) || [];
};
