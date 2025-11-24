import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Katou | Khairil's Personal Website",
  description:
    "Engage in a conversation with Katou, an AI chatbot built by Khairil. Ask questions, get information, or just have a friendly chat.",
  openGraph: {
    title: "Chat with Katou | Khairil's Personal Website",
    description:
      "Engage in a conversation with Katou, an AI chatbot built by Khairil. Ask questions, get information, or just have a friendly chat.",
    url: "https://kyyril.vercel.app/chat",
  },
  twitter: {
    title: "Chat with Katou | Khairil's Personal Website",
    description:
      "Engage in a conversation with Katou, an AI chatbot built by Khairil. Ask questions, get information, or just have a friendly chat.",
  },
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
