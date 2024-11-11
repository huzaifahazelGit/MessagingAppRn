import { PostKind } from "./post";

export interface BasePostItem {
  id?: string;
  username: string;
  userId: string;
  companyId?: string; // only on reposts

  createdate: any;
  lastupdate: any;

  // image data
  image?: string;
  videoThumbnail?: string;
  video?: string;
  videoRatio?: number;

  // stats
  likeCount: number;
  commentCount: number;
  likedAvatars: string[];
  commentedAvatars: string[];

  // audio data
  audio?: string;
  audioThumbnail?: string;
  uploadTitle?: string;

  description: string;
  location?: string;
  tags: string[];

  archived: boolean;
  featured: boolean;
  marketplace: boolean;

  kind: PostKind;
}
