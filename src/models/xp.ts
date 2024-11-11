export interface XPEarnAction {
  id?: string;

  points: number;
  kind: XPKind;
  message?: string;
  userId: string;
  timeCreated: any;

  postId?: string;
  cosignId?: string;
  commentId?: string;
  challengeId?: string;
  submissionId?: string;
  bonusNotes?: string;
}

export const XP_EXPLAINER_STRING = `Actions you can take to earn XP:  Complete Your Profile, Complete Onboarding, Add a Day to Post Streak, Add a Day to Login Streak, Receive a Post Comment, Receive a Post Like, Receive a Post Share, Receive a Post Download, Submit to a Challenge, Win Challenge, Vote in a Challenge, Receive a vote in a Challenge.`;
export const cleanedXPName = (kind: XPKind) => {
  switch (kind) {
    case XPKind.completeProfileShort:
      return "Complete Short Profile";
    case XPKind.completeProfileLong:
      return "Complete Long Profile";
    case XPKind.completeOnboard:
      return "Complete Onboarding";

    case XPKind.addDayToPostStreak:
      return "Add Day to Post Streak";
    case XPKind.addDayToLoginStreak:
      return "Add Day to Login Streak";
    case XPKind.postComment:
      return "Receive a Post Comment";
    case XPKind.postLike:
      return "Receive a Post Like";
    case XPKind.postShare:
      return "Receive a Post Share";
    case XPKind.postDownload:
      return "Receive a Post Download";
    case XPKind.submitChallenge:
      return "Submit to a Challenge";
    case XPKind.winChallenge:
      return "Win Challenge";
    case XPKind.sendVoteChallenge:
      return "Vote in a Challenge";
    case XPKind.receiveVoteChallenge:
      return "Received a vote in a Challenge";

    case XPKind.follow25Users:
      return "Follow 25 Users";
    case XPKind.receive25Follows:
      return "Receive 25 Follows";
    case XPKind.askRaiQuestion:
      return "RAI discussions";
    case XPKind.inviteUser:
      return "Invite User";
    case XPKind.inviteUserSuccess:
      return "Invite User Success";
    case XPKind.addSongToJukebox:
      return "Add Song to Jukebox";
    case XPKind.receiveEndorsement:
      return "Receive Endorsement";
    case XPKind.pullUpAndPlayAttendance:
      return "Pull Up and Play Attendance";
  }
};

export enum XPKind {
  completeOnboard = "completeOnboard",
  completeProfileShort = "completeProfileShort",
  completeProfileLong = "completeProfileLong",
  addDayToPostStreak = "addDayToPostStreak",
  addDayToLoginStreak = "addDayToLoginStreak",
  postComment = "postComment",
  postLike = "postLike",
  postShare = "postShare",

  postDownload = "postDownload",

  submitChallenge = "submitChallenge",
  winChallenge = "winChallenge",
  sendVoteChallenge = "sendVoteChallenge",
  receiveVoteChallenge = "receiveVoteChallenge",

  follow25Users = "follow25Users",
  receive25Follows = "receive25Follows",

  askRaiQuestion = "askRaiQuestion",

  inviteUser = "inviteUser",

  // tara later
  inviteUserSuccess = "inviteUserSuccess",
  receiveEndorsement = "receiveEndorsement",
  pullUpAndPlayAttendance = "pullUpAndPlayAttendance",
  addSongToJukebox = "addSongToJukebox",
}

const XP_POINT_VALUES = {
  completeOnboard: 1,
  completeProfileShort: 5,
  completeProfileLong: 10,
  addDayToPostStreak: 1,
  // 10 day streak multiplies points by 1.5
  addDayToLoginStreak: 1,
  postComment: 1,
  postLike: 1,
  postShare: 1,

  postDownload: 0,
  // - 10+ downloads: 10 XP
  // - 25+ downloads: 25 XP
  // - 50+ downloads: 50 XP

  submitChallenge: 1,
  winChallenge: 50,
  sendVoteChallenge: 1,
  receiveVoteChallenge: 1,
  follow25Users: 5,
  receive25Follows: 10,
  askRaiQuestion: 1, // every 5 questions

  inviteUser: 1,

  // later
  inviteUserSuccess: 10,
  addSongToJukebox: 1,
  receiveEndorsement: 0,
  // - 5+ endorsements: 25 XP
  pullUpAndPlayAttendance: 5,
};

export const MISSIONS = [
  // {
  //   kind: XPKind.completeOnboard,
  //   id: XPKind.completeOnboard,
  //   title: "Complete Onboarding",
  //   points: XP_POINT_VALUES[XPKind.completeOnboard],
  // },
  {
    kind: XPKind.completeProfileShort,
    id: XPKind.completeProfileShort,
    title: "PROFILE",
    points: XP_POINT_VALUES[XPKind.completeProfileLong],
  },
  // {
  //   kind: XPKind.completeProfileLong,
  //   id: XPKind.completeProfileLong,
  //   title: "Complete Profile",
  //   points: XP_POINT_VALUES[XPKind.completeProfileLong],
  // },
  // { kind: XPKind.addSongToJukebox, title: "Add a Song to your Jukebox" },

  {
    kind: XPKind.addDayToPostStreak,
    id: XPKind.addDayToPostStreak,
    title: "CONTENT",
    points: XP_POINT_VALUES[XPKind.addDayToPostStreak],
  },
  // {
  //   kind: XPKind.addDayToLoginStreak,
  //   id: XPKind.addDayToLoginStreak,
  //   title: "Add Day to Login Streak",
  //   points: XP_POINT_VALUES[XPKind.addDayToLoginStreak],
  // },
  // { kind: XPKind.postComment, title: "Receive a Post Comment" },
  // { kind: XPKind.postLike, title: "Receive a Post Like" },
  // { kind: XPKind.postShare, title: "Receive a Post Share" },
  // { kind: XPKind.postDownload, title: "Receive a Post Download" },
  {
    kind: XPKind.submitChallenge,
    id: XPKind.submitChallenge,
    title: "CHALLENGE SUBMISSIONS",
    points: XP_POINT_VALUES[XPKind.submitChallenge],
  },
  {
    kind: XPKind.winChallenge,
    id: XPKind.winChallenge,
    title: "CHALLENGE WINS",
    points: XP_POINT_VALUES[XPKind.winChallenge],
  },
  // {
  //   kind: XPKind.sendVoteChallenge,
  //   id: XPKind.sendVoteChallenge,
  //   title: "Vote in a Challenge",
  //   points: XP_POINT_VALUES[XPKind.sendVoteChallenge],
  // },
  // {
  //   kind: XPKind.receiveVoteChallenge,
  //   id: XPKind.receiveVoteChallenge,
  //   title: "Receive a vote in a Challenge",
  //   points: XP_POINT_VALUES[XPKind.receiveVoteChallenge],
  // },

  // {
  //   kind: XPKind.follow25Users,
  //   id: XPKind.follow25Users,
  //   title: "Follow 25 Users",
  //   points: XP_POINT_VALUES[XPKind.follow25Users],
  // },
  {
    kind: XPKind.receive25Follows,
    id: XPKind.receive25Follows,
    title: "FOLLOWS",
    points: XP_POINT_VALUES[XPKind.receive25Follows],
  },
  // { kind: XPKind.askRaiQuestion, title: "RAI discussions" },
  {
    kind: XPKind.inviteUser,
    title: "INVITES SENT",
    id: XPKind.inviteUser,
    points: XP_POINT_VALUES[XPKind.inviteUserSuccess],
  },
  // { kind: XPKind.inviteUserSuccess, title: "Invite User Success" },

  // { kind: XPKind.receiveEndorsement, title: "Receive Endorsement" },
  // {
  //   kind: XPKind.pullUpAndPlayAttendance,
  //   title: "Pull Up and Play Attendance",
  // },
];

// export const MISSIONS = [
//   {
//     kind: XPKind.completeOnboard,
//     id: XPKind.completeOnboard,
//     title: "Complete Onboarding",
//     points: XP_POINT_VALUES[XPKind.completeOnboard],
//   },
//   {
//     kind: XPKind.completeProfileShort,
//     id: XPKind.completeProfileShort,
//     title: "Update Profile",
//     points: XP_POINT_VALUES[XPKind.completeProfileShort],
//   },
//   {
//     kind: XPKind.completeProfileLong,
//     id: XPKind.completeProfileLong,
//     title: "Complete Profile",
//     points: XP_POINT_VALUES[XPKind.completeProfileLong],
//   },
//   // { kind: XPKind.addSongToJukebox, title: "Add a Song to your Jukebox" },

//   {
//     kind: XPKind.addDayToPostStreak,
//     id: XPKind.addDayToPostStreak,
//     title: "Add Day to Post Streak",
//     points: XP_POINT_VALUES[XPKind.addDayToPostStreak],
//   },
//   {
//     kind: XPKind.addDayToLoginStreak,
//     id: XPKind.addDayToLoginStreak,
//     title: "Add Day to Login Streak",
//     points: XP_POINT_VALUES[XPKind.addDayToLoginStreak],
//   },
//   // { kind: XPKind.postComment, title: "Receive a Post Comment" },
//   // { kind: XPKind.postLike, title: "Receive a Post Like" },
//   // { kind: XPKind.postShare, title: "Receive a Post Share" },
//   // { kind: XPKind.postDownload, title: "Receive a Post Download" },
//   {
//     kind: XPKind.submitChallenge,
//     id: XPKind.submitChallenge,
//     title: "Submit to a Challenge",
//     points: XP_POINT_VALUES[XPKind.submitChallenge],
//   },
//   {
//     kind: XPKind.winChallenge,
//     id: XPKind.winChallenge,
//     title: "Win a Challenge",
//     points: XP_POINT_VALUES[XPKind.winChallenge],
//   },
//   {
//     kind: XPKind.sendVoteChallenge,
//     id: XPKind.sendVoteChallenge,
//     title: "Vote in a Challenge",
//     points: XP_POINT_VALUES[XPKind.sendVoteChallenge],
//   },
//   {
//     kind: XPKind.receiveVoteChallenge,
//     id: XPKind.receiveVoteChallenge,
//     title: "Receive a vote in a Challenge",
//     points: XP_POINT_VALUES[XPKind.receiveVoteChallenge],
//   },

//   {
//     kind: XPKind.follow25Users,
//     id: XPKind.follow25Users,
//     title: "Follow 25 Users",
//     points: XP_POINT_VALUES[XPKind.follow25Users],
//   },
//   {
//     kind: XPKind.receive25Follows,
//     id: XPKind.receive25Follows,
//     title: "Receive 25 Follows",
//     points: XP_POINT_VALUES[XPKind.receive25Follows],
//   },
//   // { kind: XPKind.askRaiQuestion, title: "RAI discussions" },
//   // { kind: XPKind.inviteUser, title: "Invite User" },
//   // { kind: XPKind.inviteUserSuccess, title: "Invite User Success" },

//   // { kind: XPKind.receiveEndorsement, title: "Receive Endorsement" },
//   // {
//   //   kind: XPKind.pullUpAndPlayAttendance,
//   //   title: "Pull Up and Play Attendance",
//   // },
// ];
