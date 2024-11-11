export interface User {
  id?: string;
  profileLoaded?: boolean;
  createdate: any;
  lastupdate: any;
  lastActive: any;

  username: string;
  email: string;

  companyIds: string[];
  executiveIds: string[];

  // search
  featured: boolean;

  // links
  instagram?: string;
  twitter?: string;
  website?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;

  accessLevel: "free" | "premium_monthly" | "premium_yearly";
  isExecutive?: boolean;

  // profile info
  musicianType?: string[];
  interests?: string[];
  instruments?: string[];
  pro: string; //- PRO (performing rights organization)
  publisher: string; //- Publisher
  manager: string; //- Manager
  label: string; //- Label
  labelObj?: {
    name: string;
    id: string;
    imageURL: string;
  };
  location: string; //- Location
  daw: string; //- What DAW do you use?
  studioDetails: string; //- Do you work from a Professional or Home Studio primarily or both?
  bio?: string;

  // other
  tags: string[];

  // profile display
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  profilePicture?: string;

  //   stats
  followerCount: number;
  followingCount: number;
  audioCount: number;
  winCount: number;
  postCount: number;
  submissionCount: number;
  inviteCount: number;

  // cosigns
  cosignCount: number;
  cosignedBy?: string[];
  cosignWrittenCount: number;

  // leaderboard
  points?: number;
  xp?: number;
  rank?: number;

  //notifications
  unreadActivityCount: number;
  unreadChatCount: number;
  unreadRoomChatCount: number;

  // notification settings
  skipNotifyFollow?: boolean;
  skipNotifyLikeComment?: boolean;
  skipNotifyTag?: boolean;
  skipNotifyDaily?: boolean;
  skipNotifyMarket?: boolean;

  // general
  isAdmin?: boolean;
  lastPost?: any;
  lastReset?: any;
  lastBookmark?: any;
  pushToken?: string;
  hideRAI?: boolean;

  postStreak?: number;
  maxPostStreak?: number;
  loginStreak?: number;
  maxLoginStreak?: number;


  // wallet
  walletInfo: WalletInfo;  // Add this line
}


export interface WalletInfo  {
  walletAddress: string;
  walletBalance: number;
  encryptedPrivateKey: string;
};