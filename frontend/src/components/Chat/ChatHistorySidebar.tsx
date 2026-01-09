"use client";
import React from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

type Message = {
  text: string;
  isUser: boolean;
  id: string;
};

type ChatHistory = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  aiHistory: any[];
  userId: string;
};

interface ChatHistorySidebarProps {
  chatsList: ChatHistory[];
  activeChat: string | null;
  isMobile: boolean;
  startNewChat: () => void;
  loadChat: (chatId: string) => void;
  confirmDeleteChat: (chatId: string, e: React.MouseEvent) => void;
}

function ChatHistorySidebar({
  chatsList,
  activeChat,
  isMobile,
  startNewChat,
  loadChat,
  confirmDeleteChat,
}: ChatHistorySidebarProps) {
  return (
    <div
      className="h-full flex flex-col bg-transparent"
      role="navigation"
      aria-label="Chat history"
    >
      <div className="p-4 pb-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
          History
        </h2>
      </div>

      <div className="px-4 mb-4">
        <button
          onClick={() => {
            startNewChat();
            if (isMobile) {
              const closeButton = document.querySelector(
                "[data-close-sheet]"
              ) as HTMLElement;
              if (closeButton) closeButton.click();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-custom bg-custom/5 hover:bg-custom/10 transition-all font-sans"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      <ScrollArea className="flex-1 px-3 pb-4">
        <div className="space-y-1">
          {chatsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-20">
              <p className="text-[11px] font-bold uppercase tracking-widest">Empty</p>
            </div>
          ) : (
            chatsList.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "grid grid-cols-[1fr_auto] items-center group px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden gap-2",
                  activeChat === chat.id
                    ? "bg-custom/10"
                    : "hover:bg-secondary/50"
                )}
                onClick={() => {
                  loadChat(chat.id);
                  if (isMobile) {
                    const closeButton = document.querySelector(
                      "[data-close-sheet]"
                    ) as HTMLElement;
                    if (closeButton) closeButton.click();
                  }
                }}
              >
                <div className="min-w-0">
                  <p className={cn(
                    "text-[13px] font-bold truncate",
                    activeChat === chat.id ? "text-custom" : "text-foreground/85"
                  )}>
                    {chat.title}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-40 mt-1">
                    {new Date(chat.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteChat(chat.id, e);
                  }}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0 ml-auto",
                    activeChat === chat.id
                      ? "text-red-600 dark:text-red-400 hover:bg-black/5"
                      : "text-foreground/40 hover:text-red-500 hover:bg-red-500/10"
                  )}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-20 text-center">
          Saved Locally
        </p>
      </div>
    </div>
  );
}

// Memoize to prevent re-renders when parent state changes but props remain same
export default React.memo(ChatHistorySidebar);
