export const AFTER_INTERESTS_TEXT =
  "Tell me what you’re hoping to get out of your experience on Realm.";

export const LAST_INTRO_MESSAGE = "Let’s get to it! What's your name?";

export const BOT_MESSAGES = [
  `Welcome! Realm is your all-in-one universe for musical evolution. A virtual arena for you to hone your skills and build your career.`,

  `Create a dynamic profile that serves as your digital portfolio, storefront, and stage.`,

  `Enter the Arena—our competitive battleground where you tackle challenges, earn XP, and unlock unprecedented opportunities to collaborate and learn from music titans and level up.`,

  `Use our precision filters in search to discover other members of Realm who align with your vision.`,

  `Create a room to communicate and share files with your collaborators. Dynamic group chats for your core team or collaborators of a project. `,

  `Oh and meet me, RAI, your AI co-pilot for your music career. I’m here to help you develop your craft and build your career every step of the way. `,

  `If you at any time you want to exit this chat and finish setting up your profile later, just say "Later".`,

  LAST_INTRO_MESSAGE,
  `Nice to meet you NAME. Are you a creative or an industry professional?`,
  `Do you play any instruments?`,
  `Awesome, any other interests I should know about?`,
  AFTER_INTERESTS_TEXT,
  "Well you came to the right place. We’re almost done setting up your profile, just a couple more things. Can you share some links to your work? You can add links to your instagram, twitter, spotify, soundcloud, youtube channel, or your personal website.",
  "Sweet. Now, send me a photo that you want to use as your profile picture.",
  `Looking good! Let’s finish with a bio. If you want to add your bio later, just say "Skip".`,
  `Lastly, are you located in LOCATION? If not, where are you located?`,
  "Dope. That’s it! Check out the profile I put together for you, and feel free to edit in profile settings anytime. Welcome to Realm!",
];

export const DONE_QUICK_REPLY = {
  type: "checkbox",
  keepIt: false,
  values: [
    {
      title: "Let's go!",
      value: "Let's go!",
    },
  ],
};

export const INTERESTS_QUICK_REPLY = {
  type: "checkbox",
  keepIt: false,
  values: [
    {
      title: "WEB 3",
      value: "WEB 3",
    },
    {
      title: "STUDIO SESSIONS",
      value: "STUDIO SESSIONS",
    },
    {
      title: "LIVE PERFORMANCE",
      value: "LIVE PERFORMANCE",
    },
    {
      title: "TOURING",
      value: "TOURING",
    },
    {
      title: "COLLABORATIONS",
      value: "COLLABORATIONS",
    },
    {
      title: "JOINING A BAND",
      value: "JOINING A BAND",
    },
    {
      title: "EVENTS",
      value: "EVENTS",
    },
    {
      title: "NONE",
      value: "NONE",
    },
  ],
};

export const INSTRUMENTS_QUICK_REPLY = {
  type: "checkbox",
  keepIt: false,
  values: [
    {
      title: "GUITAR",
      value: "GUITAR",
    },
    {
      title: "BASS",
      value: "BASS",
    },
    {
      title: "DRUMS",
      value: "DRUMS",
    },
    {
      title: "SAXOPHONE",
      value: "SAXOPHONE",
    },
    {
      title: "PIANO",
      value: "PIANO",
    },
    {
      title: "TRUMPET",
      value: "TRUMPET",
    },
    {
      title: "SYNTHESIZER",
      value: "SYNTHESIZER",
    },
    {
      title: "VIOLIN",
      value: "VIOLIN",
    },
    {
      title: "NONE",
      value: "NONE",
    },
  ],
};

export const MUSICIAN_TYPE_QUICK_REPLY = {
  type: "checkbox",
  keepIt: false,
  values: [
    {
      title: "MUSICIAN",
      value: "MUSICIAN",
    },
    {
      title: "PRODUCER",
      value: "PRODUCER",
    },
    {
      title: "DJ",
      value: "DJ",
    },
    {
      title: "ENGINEER",
      value: "ENGINEER",
    },

    {
      title: "VOCALIST",
      value: "VOCALIST",
    },
    {
      title: "SONGWRITER",
      value: "SONGWRITER",
    },
    {
      title: "MANAGER",
      value: "MANAGER",
    },
  ],
};

export const RAI_USER = {
  _id: "RAI",
  avatar: "RAI",
  name: "RAI",
};
