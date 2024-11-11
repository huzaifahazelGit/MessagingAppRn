import { PostKind } from "./post";

export interface Submission {
  id?: string;
  userId: string;
  userImage: string;
  username: string;
  challengeId: string;
  createdate: any;
  lastupdate: any;
  postId?: String;
  isFinalist: boolean;
  isWinner: boolean;
  votes: string[];
  voterImages: string[];
  archived: boolean;
  image?: string;
  uploadTitle: string;
  imageNumber?: number;

  audio?: string;
  video?: string;
  soundcloudLink?: string;
  youtubeId?: string;
  spotifyId?: string;
  artistName?: string;
  duration?: number;

  kind: PostKind;
}
