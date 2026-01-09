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
      <section className="max-w-7xl w-full min-h-screen px-4 md:px-16 mx-auto pb-20">
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="mt-4 flex flex-col md:flex-row gap-4 h-[calc(100dvh-12rem)] md:h-[700px]">
          {/* Chat Area */}
          <ChatClient />
        </div>
      </section>
    </MusicPlayerProvider>
  );
}
