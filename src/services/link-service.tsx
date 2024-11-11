import * as Linking from "expo-linking";

export const createLinkFromData = (data: any) => {
  if (data && data.collabId) {
    return Linking.createURL(`/chat/${data.collabId}`);
  } else if (data && data.playlistId) {
    return Linking.createURL(`/playlist/${data.playlistId}`);
  } else if (data && data.roomId) {
    return Linking.createURL(`/room/${data.roomId}`);
  } else if (data && data.challengeId) {
    return Linking.createURL(`/challenge/${data.challengeId}`);
  } else if (data && data.postId) {
    return Linking.createURL(`/post/${data.postId}`);
  } else if (data && data.userId) {
    return Linking.createURL(`/profile/${data.userId}`);
  }

  return null;
};

export const createExecutiveInviteLink = (myId: string, inviteId: string) => {
  //   let link = Linking.createURL(`/?referringUserId=${myId}&inviteId=${inviteId}`);
  let link = "https://testflight.apple.com/join/598FKK1g";
  return link;
};

export const createInviteLink = (myId: string) => {
  //   let link = Linking.createURL(`/?referringUserId=${myId}`);
  let link = "https://testflight.apple.com/join/598FKK1g";
  return link;
};

export const createChatLink = (chatId: string, myId: string) => {
  let link = Linking.createURL(`/chat/${chatId}?referringUserId=${myId}`);
  return link;
};

export const createPlaylistLink = (playlistId: string, myId: string) => {
  let link = Linking.createURL(
    `/playlist/${playlistId}?referringUserId=${myId}`
  );
  return link;
};

export const createPostLink = (postId: string, myId: string) => {
  let link = Linking.createURL(`/post/${postId}?referringUserId=${myId}`);
  return link;
};

export const createProfileLink = (userId: string, myId: string) => {
  let link = Linking.createURL(`/profile/${userId}?referringUserId=${myId}`);
  return link;
};

export const createChallengeLink = (challengeId: string, myId: string) => {
  let link = Linking.createURL(
    `/challenge/${challengeId}?referringUserId=${myId}`
  );
  return link;
};

export const createRoomLink = (roomId: string, myId: string) => {
  let link = Linking.createURL(`/room/${roomId}?referringUserId=${myId}`);
  return link;
};
