import ChatClient from "./ChatClient";

export default function ChatPage() {

  return (
    // <MusicPlayerProvider>
    //   <FloatingMusicPlayer />
    <section className="max-w-7xl pt-8 w-full h-[calc(100vh-theme(spacing.20))] px-4 md:px-16 mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 h-full pt-4">
        {/* Chat Area */}
        <ChatClient />
      </div>
    </section>
    // </MusicPlayerProvider>
  );
}
