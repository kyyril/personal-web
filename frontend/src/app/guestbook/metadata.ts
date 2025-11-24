import type { Metadata } from "next";

export const guestbookMetadata: Metadata = {
  title: "Guestbook | Khairil Rahman Hakiki",
  description:
    "Sign Khairil's guestbook and share your thoughts. A place for visitors to leave messages and connect with this Software Engineer specializing in React.js and TypeScript.",
  keywords: [
    "guestbook",
    "Khairil Rahman Hakiki",
    "software engineer",
    "contact",
    "feedback",
    "message board",
    "React developer",
    "Next.js developer",
  ],
  alternates: {
    canonical: "https://kyyril.vercel.app/guestbook",
  },
  openGraph: {
    title: "Guestbook | Khairil Rahman Hakiki",
    description:
      "Sign Khairil's guestbook and share your thoughts. A place for visitors to leave messages and connect with this Software Engineer.",
    url: "https://kyyril.vercel.app/guestbook",
    type: "website",
    images: [
      {
        url: "https://kyyril.vercel.app/assets/profile.webp",
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Guestbook",
      },
    ],
  },
  twitter: {
    title: "Guestbook | Khairil Rahman Hakiki",
    description:
      "Sign Khairil's guestbook and share your thoughts. A place for visitors to leave messages and connect.",
    card: "summary_large_image",
  },
};
