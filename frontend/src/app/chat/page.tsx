"use client";

import Breadcrumb from "../../components/Breadcrumb";
import { MusicPlayerProvider } from "../../contexts/MusicPlayerContext";
import FloatingMusicPlayer from "../../components/FloatingMusicPlayer";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Chat" }];

  return (
    <MusicPlayerProvider>
      <FloatingMusicPlayer />
      <section className="max-w-7xl w-full h-full px-4 md:px-16 overflow-hidden mx-auto pb-16">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Chat Area */}
          <ChatClient />
        </div>
      </section>
    </MusicPlayerProvider>
  );
}
