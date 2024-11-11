import { MarketplaceItem } from "./marketplace";

export interface Collaboration {
  id?: string;
  userIds: string[];
  initiatorId: string;
  initiatorName: string;
  accepted: boolean;
  completed: boolean;
  createdate: any;
  lastupdate: any;
  archived: boolean;
  subheading: string;
  onProfileIds: string[];
  marketplace: boolean;
  marketplaceId?: string;
  lastRecipientId: string;
  unreadCount: number;
}

export interface CollabMessage {
  id?: string;
  collaborationId: string;
  userId: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: any;
  archived: boolean;
  image?: string;
  video?: string;
  audio?: string;
  audioTitle?: string;
  audioImage?: string;
  postId?: string;
  marketplaceItem?: MarketplaceItem;
  recipientId: string;
  unread: boolean;
  system?: boolean;
}
