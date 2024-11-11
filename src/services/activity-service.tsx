import { User } from "../models/user";

export const bodyTextForKind = (
  kind: string,
  me: User,
  companyName?: string
) => {
  let bodyText = "";
  switch (kind) {
    case "post-like":
      bodyText = `${me.username.trim()} liked your post`;
      break;
    case "share-post-to-story":
      bodyText = `${me.username.trim()} shared your post to their story`;
      break;
    case "post-repost":
      bodyText = `${me.username.trim()} reposted your post to their feed`;
      break;
    case "company-post-repost":
      bodyText = `${companyName} reposted your post to their feed`;
      break;
    case "comment-like":
      bodyText = `${me.username.trim()} liked your comment`;
      break;
    case "post-comment":
      bodyText = `${me.username.trim()} commented on your post`;
      break;
    case "follow":
      bodyText = `${me.username.trim()} followed you`;
      break;
    case "add-to-jukebox":
      bodyText = `${me.username.trim()} added your post to a jukebox set`;
      break;
    case "post-save":
      bodyText = `${me.username.trim()} bookmarked your post`;
      break;
    case "marketplace-save":
      bodyText = `${me.username.trim()} bookmarked your marketplace post`;
      break;
    case "room-add-member":
      bodyText = `${me.username.trim()} added you to a room`;
      break;
    case "executive-add-artist":
      bodyText = `${me.username.trim()} added you to as an artist`;
      break;
    case "audio-download":
      bodyText = `${me.username.trim()} downloaded your audio`;
      break;
    case "post-mention":
      bodyText = `${me.username.trim()} mentioned you in a post`;
      break;
    case "comment-mention":
      bodyText = `${me.username.trim()} mentioned you in a comment`;
      break;
    case "cosign-create":
      bodyText = `${me.username.trim()} cosigned your profile`;
      break;
    case "cosign-request":
      bodyText = `${me.username.trim()} requested a cosign`;
      break;
    case "create-coauthor":
      bodyText = `${me.username.trim()} added you as a coauthor`;
      break;
    case "confirm-coauthor":
      bodyText = `${me.username.trim()} confirmed you as a coauthor`;
      break;
    default:
      bodyText = kind;
  }
  return bodyText;
};
