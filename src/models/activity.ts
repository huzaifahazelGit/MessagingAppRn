export interface Activity {
  id?: string;
  kind:
    | "post-like"
    | "comment-like"
    | "post-comment"
    | "follow"
    | "post-save"
    | "add-to-jukebox"
    | "marketplace-save"
    | "audio-download"
    | "comment-mention"
    | "post-mention"
    | "cosign-create"
    | "cosign-request"
    | "create-coauthor"
    | "confirm-coauthor"
    | "challenge-win"
    | "realm-general"
    | "share-post-to-story"
    | "post-repost"
    | "company-post-repost"
    | "room-add-member"
    | "executive-add-artist";
  actorId: string;
  actorName: string;
  actorImage?: string;
  postId?: string;
  playlistId?: string;
  cosignId?: string;
  commentId?: string;
  recipientId?: string;
  challengeId?: string;
  roomId?: string;
  cleared: boolean;
  bodyText: string;

  postImage?: string;
  postKind?:
    | "audio"
    | "image"
    | "video"
    | "text"
    | "soundcloud"
    | "youtube"
    | "spotify"
    | "otherlink";
  timeCreated: any;
  unread: boolean;
  commentText?: string;
}
