export interface Playlist {
  id?: string;
  executiveDefault?: boolean;
  defaultPlaylist: boolean;
  ownerId: string;
  ownerName: string;

  name: string;
  timeCreated: any;
  lastUpdated: any;
  archived: boolean;
  ownerIsCompany: boolean;

  songCount: number;
  likeCount: number;
  likedAvatars: string[];
  shareCount: number;

  coverImage?: string;
  tags: string[];
  featured: boolean;
}
