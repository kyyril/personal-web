import type { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../../lib/metadata";

export const chatMetadata: Metadata = {
  title: "Chat | Khairil Rahman Hakiki",
  description: SEO_DESCRIPTION.chat,
  keywords: [
    ...PERSONAL_KEYWORDS,
    "chat",
    "AI chatbot",
    "software engineer",
    "developer chat",
    "technology discussion",
    "career advice",
    "Katou AI",
  ],
  alternates: {
    canonical: `${siteUrl}/chat`,
  },
  openGraph: {
    title: "Chat | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.chat,
    url: `${siteUrl}/chat`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/profile.webp`,
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Chat with AI Assistant",
      },
    ],
  },
  twitter: {
    title: "Chat | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.chat,
    card: "summary_large_image",
  },
};
