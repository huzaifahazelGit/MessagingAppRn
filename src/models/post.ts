import { GiphyMedia } from "@giphy/react-native-sdk";
import { User } from "./user";
import { BasePostItem } from "./base-post";

export enum PostKind {
  audio = "audio",
  video = "video",
  text = "text",
  image = "image",
  soundcloud = "soundcloud",
  youtube = "youtube",
  spotify = "spotify",
}

export interface Post extends BasePostItem {
  collaboratorIds: string[];

  // audio items
  downloadable?: boolean;
  playlistIds?: string[];

  // links
  soundcloudLink?: string;
  youtubeId?: string;
  spotifyId?: string;
  artistName?: string;
  duration?: number;

  // counts
  downloadCount?: number;
  repostCount?: number;
  shareCount?: number;

  // booleans
  delayedPost?: boolean;

  // coauthor stuff
  coauthors?: User[];
  coauthorsApproved?: boolean;

  // repost data
  reposted?: boolean;
  originalPostId?: string;
  originalUserId?: string;
  originalUsername?: string;
  originalPostTime?: any;

  parentFolderIds?: string[];
  starred?: boolean;
  lastInteractor?: string;
}

export const EMPTY_POST = {
  userId: "",
  collaboratorIds: [],
  companyJukeboxDisplay: [],
  username: "",

  createdate: new Date(),
  lastupdate: new Date(),

  // image & video items
  image: "",
  video: "",
  videoThumbnail: "",

  // audio items
  audio: "",
  audioThumbnail: "",
  uploadTitle: "",
  downloadable: false,
  playlistIds: [],

  // general
  description: "",
  location: "",
  tags: [],

  // kind
  kind: "text",
  soundcloudLink: "",
  youtubeId: "",
  spotifyId: "",

  // counts
  likeCount: 0,
  commentCount: 0,
  downloadCount: 0,
  likedAvatars: [],
  commentedAvatars: [],

  // booleans
  archived: false,
  marketplace: false,
  featured: false,
  delayedPost: false,

  // coauthor stuff
  coauthors: [],
  coauthorsApproved: false,
};

export interface Comment {
  id?: string;
  userId: string;
  avatar: string;
  username: string;
  postId: string;
  createdate: any;
  lastupdate: any;
  text: string;
  archived: boolean;
  likeCount: number;
  likedAvatars: string[];
  parentCommentId: string;
  giphy?: GiphyMedia;
}
