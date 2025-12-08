import type { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../../lib/metadata";

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
  ],
  alternates: {
    canonical: `${siteUrl}/guestbook`,
  },
  openGraph: {
    title: "Guestbook | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.guestbook,
    url: `${siteUrl}/guestbook`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/profile.webp`,
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Guestbook",
      },
    ],
  },
  twitter: {
    title: "Guestbook | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.guestbook,
    card: "summary_large_image",
  },
};
