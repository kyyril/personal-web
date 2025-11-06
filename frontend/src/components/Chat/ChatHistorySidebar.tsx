"use client";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

type ChatHistory = {
  id: string;
  title: string;
  messages: any[];
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

export default function ChatHistorySidebar({
  chatsList,
  activeChat,
  isMobile,
  startNewChat,
  loadChat,
  confirmDeleteChat,
}: ChatHistorySidebarProps) {
  return (
    <div
      className="h-full flex flex-col"
      role="navigation"
      aria-label="Chat history"
    >
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <p className="text-xs text-primary/70">
          <span className="text-red-500">* </span>This chat is saved in your
          local storage
        </p>
      </div>

      <Button
        onClick={() => {
          startNewChat();
          if (isMobile) {
            const closeButton = document.querySelector(
              "[data-close-sheet]"
            ) as HTMLElement;
            if (closeButton) closeButton.click();
          }
        }}
        className="mx-4 mb-4 bg-custom hover:bg-custom/80 text-white"
        style={{
          backgroundColor: "#2563eb",
        }}
      >
        <PlusIcon className="mr-2 h-4 w-4" /> New Chat
      </Button>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          {chatsList.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No chat history yet
            </p>
          ) : (
            chatsList.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted group",
                  activeChat === chat.id && "bg-muted"
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
                <div className="truncate flex-1">
                  <p className="text-sm font-medium">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 sm:flex hidden"
                  onClick={(e) => confirmDeleteChat(chat.id, e)}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <TrashIcon className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={(e) => confirmDeleteChat(chat.id, e)}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <TrashIcon className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
