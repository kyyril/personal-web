import type { Metadata } from "next";

export const chatMetadata: Metadata = {
  title: "Chat | Khairil Rahman Hakiki",
  description:
    "Start a conversation with Khairil's AI assistant Katou. Ask questions about software development, get career advice, or just chat about technology and development.",
  keywords: [
    "chat",
    "AI chatbot",
    "Khairil Rahman Hakiki",
    "software engineer",
    "developer chat",
    "technology discussion",
    "career advice",
    "React developer",
    "Next.js developer",
    "Katou AI",
  ],
  alternates: {
    canonical: "https://kyyril.vercel.app/chat",
  },
  openGraph: {
    title: "Chat | Khairil Rahman Hakiki",
    description:
      "Start a conversation with Khairil's AI assistant Katou. Ask questions about software development, get career advice, or just chat about technology and development.",
    url: "https://kyyril.vercel.app/chat",
    type: "website",
    images: [
      {
        url: "https://kyyril.vercel.app/assets/profile.webp",
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Chat with AI Assistant",
      },
    ],
  },
  twitter: {
    title: "Chat | Khairil Rahman Hakiki",
    description:
      "Start a conversation with Khairil's AI assistant Katou. Ask questions about software development, get career advice, or just chat about technology.",
    card: "summary_large_image",
  },
};
