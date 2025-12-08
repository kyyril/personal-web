import type { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../../lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "../../lib/seo";

/**
 * Chat page metadata with proper canonical URL
 * Helps prevent "Alternate page with proper canonical tag" issues
 */
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
  // Key fix: Proper canonical with language alternates
  alternates: generateAlternates("/chat"),
  openGraph: generateOpenGraph({
    title: "Chat | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.chat,
    path: "/chat",
    type: "website",
  }),
  twitter: generateTwitter({
    title: "Chat | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.chat,
  }),
};
