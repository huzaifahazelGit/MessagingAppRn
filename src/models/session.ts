export type Session = {
  id?: string;
  userId: string;
  superImageId: number;
  permission?: number;
  timeCreated: any;
  username: string;

  location?: string;
  tags: string[];
  archived: boolean;
  expired: boolean;

  likeCount: number;
  likedAvatars: string[];
  seenCount: number;
  seenAvatars: string[];
  seenIds: string[];

  hashtags?: string[];
  address?: any[];
  mention?: string[];
  duration: number;

  // repost
  isRepost?: boolean;
  backgroundImageColor?: string;
  originalPostId?: string;
  originalPostUserId?: string;
};
