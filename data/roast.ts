export type RoastMode = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
};

export const roastModes: RoastMode[] = [
  {
    id: "keep-it-nice",
    title: "Keep It Nice",
    subtitle: "We'll keep things light and friendly.",
    description:
      "Gentle, helpful feedback. It'll point out what needs work nicely. No attacks, just a friendly vibe.",
    images: ["/peace-1.jpg", "/peace-2.jpg"],
  },
  {
    id: "say-it-straight",
    title: "Say It Straight",
    subtitle: "Honest feedback, no sugar coating.",
    description:
      "Direct and honest. You'll hear what's good and what isn't, with no drama or fluff. Useful and to the point.",
    images: ["/straight-1.jpg", "/straight-2.jpg"],
  },
  {
    id: "ruin-my-day",
    title: "Ruin My Day",
    subtitle: "Go all in. I can take it.",
    description:
      "Brutally true. Highlights every issue, commits, weird choices. Only for those who want the harsh truth.",
    images: ["/brutal-1.jpg", "/brutal-2.jpg"],
  },
];
