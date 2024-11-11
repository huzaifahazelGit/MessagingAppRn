import { Store } from "pullstate";
import { Follow } from "../models/follow";
import { Collaboration } from "../models/collaboration";

interface SocialState {
  follows: Follow[];
  collabs: Collaboration[];
  notFollowing: String[];
  notConnected: String[];
  mutualFollows: {
    [key: string]: Follow[];
  };
  seenSessions: string[];
}

export const SocialStore = new Store<SocialState>({
  follows: [],
  collabs: [],
  notFollowing: [],
  notConnected: [],
  mutualFollows: {},
  seenSessions: [],
});

export function didWatchSession(sessionId: string) {
  SocialStore.update((s) => {
    s.seenSessions = [
      ...s.seenSessions.filter((item) => item != sessionId),
      sessionId,
    ];
  });
}

export function addNotFollowingToStore(userId: String) {
  SocialStore.update((s) => {
    s.notFollowing = [...s.notFollowing, userId];
  });
}

export function removeFollowFromStore(userId: String) {
  SocialStore.update((s) => {
    s.notFollowing = [...s.notFollowing, userId];
    s.follows = s.follows.filter((item) => item.toUserId != userId);
  });
}

export function addFollowToStore(follow: Follow) {
  SocialStore.update((s) => {
    s.follows = [...s.follows, follow];
    s.notFollowing = s.notFollowing.filter((item) => item != follow.toUserId);
  });
}

export function addMutualsToStore(follows: Follow[], userId: string) {
  SocialStore.update((s) => {
    s.mutualFollows = {
      ...s.mutualFollows,
      [userId]: follows,
    };
  });
}

export function addNotConnectedToStore(userId: String) {
  SocialStore.update((s) => {
    s.notConnected = [...s.notConnected, userId];
  });
}

export function addCollabToStore(collab: Collaboration, myUserId: String) {
  SocialStore.update((s) => {
    s.collabs = [...s.collabs, collab];
    let otherUserId = collab.userIds.find((item) => item != myUserId);
    if (otherUserId) {
      s.notConnected = s.notConnected.filter((item) => item != otherUserId);
    }
  });
}
