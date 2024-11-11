export interface Company {
  id?: string;
  createdate: any;
  lastupdate: any;
  lastActive: any;

  name: string;
  adminIds: string[];

  featured: boolean;
  verified: boolean;

  instagram?: string;
  twitter?: string;
  website?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;

  location: string;
  bio: string;

  tags: string[];

  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  profilePicture?: string;

  followerCount: number;
  followingCount: number;
  artistCount: number;
  postCount: number;

  archived: boolean;
}
