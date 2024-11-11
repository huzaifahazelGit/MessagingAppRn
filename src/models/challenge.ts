export interface Challenge {
  id?: string;
  ownerId: string;
  companyId?: string;
  memberIds: string[];
  winnerIds: string[];
  winningSubmissionIds: string[];

  createdate: any;
  lastupdate: any;

  startDate: any;
  voteDate: any;
  endDate: any;
  coverImage: string;

  title: string;
  description: string;

  allowsVoting: boolean;
  voteCount: number;
  maxSubmissions: number;
  xpRewarded: number;
  complete: boolean;
  featured: boolean;
  allowsVideo: boolean;
  archived: boolean;

  tags: string[];

  submissionUserImages?: string[];

  profileRequirements: ArenaProfileRequirements;
  numWinners: number;
  usedImageNumbers?: number[];
  kind: "audio" | "multiple-choice" | "text-entry";
  daily: boolean;
  choices?: {
    name: string;
    correct: boolean;
  }[];
  audioAttachment?: {
    src: string;
    title: string;
  };
}

export interface ArenaProfileRequirements {
  hasSocialLink: boolean;
  minPosts: number;
  minFollowers: number;
  isPreviousWinner: boolean;
  hasBeenCosigned: boolean;
  hasWrittenCosign: boolean;
  minXP: number;
  premiumOnly: boolean;
}

export const EMPTY_CHALLENGE: Challenge = {
  ownerId: "",
  kind: "audio",
  daily: false,
  memberIds: [],
  winnerIds: [],
  winningSubmissionIds: [],
  createdate: new Date(),
  lastupdate: new Date(),
  startDate: null,
  voteDate: null,
  endDate: null,
  xpRewarded: 50,
  coverImage: "",
  title: "",
  description: "",
  allowsVoting: false,
  complete: false,
  featured: false,
  allowsVideo: false,
  archived: false,
  tags: ["arena"],
  numWinners: 1,
  maxSubmissions: 1,
  profileRequirements: {
    hasSocialLink: false,
    minPosts: 0,
    minFollowers: 0,
    isPreviousWinner: false,
    hasBeenCosigned: false,
    hasWrittenCosign: false,
    minXP: 0,
    premiumOnly: false,
  },
  voteCount: 0,
};
