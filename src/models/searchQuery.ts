export interface SearchQuery {
  id?: string;
  message: string;
  bios: string;
  translatedBios?: {
    bio: string;
    username: string;
    userId: string;
  }[];
  timeCreated: any;
  status: {
    completeTime: any;
    error?: string;
    startTime: any;
    state: "COMPLETED" | "PROCESSING";
    updateTime: any;
  };
  response: string;
}

export interface SearchSession {
  id?: string;
  timeCreated: any;
  firstMessage: string;
}
