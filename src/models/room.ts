import { MarketplaceItem } from "./marketplace";

export interface Room {
  id?: string;
  userIds: string[];
  initiatorId: string;
  initiatorName: string;
  createdate: any;
  lastupdate: any;
  archived: boolean;
  subheading: string;
  lastSenderId: string;
  unreadCounts: {
    [key: string]: number;
  };
  name: string;
}
