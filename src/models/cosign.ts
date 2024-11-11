export interface Cosign {
  id?: string;
  fromUserIds: string[];
  toUserId: string;
  fromUserName: string;
  fromUserImage: string;
  text: string;
  tags: string[];
  accepted: boolean;
  createdate: any;
  archived: boolean;
  likeCount: number;
  likedAvatars: string[];
}
