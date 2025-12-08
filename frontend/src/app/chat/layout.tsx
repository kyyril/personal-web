import { chatMetadata } from "./metadata";

export const metadata = chatMetadata;

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
