import type { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../../lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "../../lib/seo";

/**
 * Guestbook page metadata with proper canonical URL
 * Helps prevent "Alternate page with proper canonical tag" issues
 */
export const guestbookMetadata: Metadata = {
  title: "Guestbook | Khairil Rahman Hakiki",
  description: SEO_DESCRIPTION.guestbook,
  keywords: [
    ...PERSONAL_KEYWORDS,
    "guestbook",
    "software engineer",
    "contact",
    "feedback",
    "message board",
    "community",
  ],
  // Key fix: Proper canonical with language alternates
  alternates: generateAlternates("/guestbook"),
  openGraph: generateOpenGraph({
    title: "Guestbook | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.guestbook,
    path: "/guestbook",
    type: "website",
  }),
  twitter: generateTwitter({
    title: "Guestbook | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.guestbook,
  }),
};
