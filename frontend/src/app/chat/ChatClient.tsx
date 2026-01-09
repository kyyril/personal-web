"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "../../components/ui/card";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReloadIcon,
  RocketIcon,
  PlusIcon,
  Pencil1Icon,
  Cross2Icon,
  CheckIcon as RadixCheckIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "../../components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import dynamic from "next/dynamic";
import ChatMessage from "../../components/Chat/ChatMessage";

type Message = {
  text: string;
  isUser: boolean;
  id: string; // Unique ID for animations
};

type ChatHistory = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  aiHistory: any[];
  userId: string; // To support multi-user functionality
};





// Type for chat history sent to server
interface ChatHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatClient() {
  // Generate a random user ID if not already in localStorage
  const [userId, setUserId] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Get or create user ID
    const storedUserId = localStorage.getItem("katou-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now().toString()}`;
      localStorage.setItem("katou-user-id", newUserId);
      setUserId(newUserId);
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm Katou. I can tell you all about Khairil's projects, blogs, and experience. What would you like to know?",
      isUser: false,
      id: `msg-${Date.now()}`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  // Chat history for AI context (only user/model messages, no system prompt - that's on server)
  const [aiHistory, setAiHistory] = useState<ChatHistoryItem[]>([]);
  const [savedChats, setSavedChats] = useState<ChatHistory[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [animateChat, setAnimateChat] = useState<boolean>(true);
  const [chatsList, setChatsList] = useState<ChatHistory[]>([]);

  // Auto scroll to bottom when messages change
  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: pending ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [messages, pending]);

  // Separate the savedChats for rendering to avoid re-renders
  useEffect(() => {
    setChatsList(savedChats);
  }, [savedChats]);

  // Detect if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    if (userId) {
      const savedChatsData = localStorage.getItem(`katou-chats-${userId}`);
      if (savedChatsData) {
        const parsedChats = JSON.parse(savedChatsData) as ChatHistory[];
        setSavedChats(parsedChats);
      }
    }
  }, [userId]);

  // Get the first user message for a dynamic title
  const extractChatTitle = (chatMessages: Message[]) => {
    if (chatMessages.length <= 1) return "New Chat";

    const firstUserMessage = chatMessages.find((msg) => msg.isUser);
    if (!firstUserMessage) return "New Chat";

    // Extract the first sentence or limit to 30 chars
    let title = firstUserMessage.text;

    // Try to get the first sentence
    const sentenceEnd = title.search(/[.!?]/);
    if (sentenceEnd > 0 && sentenceEnd < 50) {
      title = title.substring(0, sentenceEnd + 1);
    }
    // Otherwise limit to a reasonable length
    else if (title.length > 30) {
      title = title.substring(0, 30) + "...";
    }

    return title;
  };

  // Save current chat to localStorage
  async function saveCurrentChat(
    currentMessages: Message[] = messages,
    currentAiHistory: any[] = aiHistory
  ) {
    if (!userId) return;
    if (currentMessages.length <= 1) return; // Don't save empty chats

    const chatId = activeChat || Date.now().toString();
    let title;

    if (activeChat) {
      // Keep existing title for existing chat
      const existingChat = savedChats.find((chat) => chat.id === activeChat);
      title = existingChat?.title || extractChatTitle(currentMessages);
    } else {
      // For new chats, use the first user message
      title = extractChatTitle(currentMessages);
    }

    const chatToSave: ChatHistory = {
      id: chatId,
      title,
      messages: currentMessages,
      timestamp: Date.now(),
      aiHistory: currentAiHistory,
      userId,
    };

    let updatedChats;

    if (activeChat) {
      // Update existing chat
      updatedChats = savedChats.map((chat) =>
        chat.id === activeChat ? chatToSave : chat
      );
    } else {
      // Add new chat
      updatedChats = [chatToSave, ...savedChats];
    }

    // Limit to 20 most recent chats to prevent localStorage bloat
    const MAX_SAVED_CHATS = 20;
    if (updatedChats.length > MAX_SAVED_CHATS) {
      updatedChats = updatedChats.slice(0, MAX_SAVED_CHATS);
    }

    setSavedChats(updatedChats);
    localStorage.setItem(`katou-chats-${userId}`, JSON.stringify(updatedChats));

    // IMPORTANT: Set active chat ID immediately if it was null
    if (!activeChat) {
      setActiveChat(chatId);
    }

    return chatId;
  };

  // Start a new chat
  const startNewChat = () => {
    // Save current chat if there are messages
    if (messages.length > 1) {
      saveCurrentChat();
    }

    // Direct reset without artificial delay for snappiness
    setMessages([
      {
        text: "Hi! I'm Katou. I can tell you all about Khairil's projects, articles, and experience. What would you like to know?",
        isUser: false,
        id: `msg-${Date.now()}`,
      },
    ]);
    setAiHistory([]);
    setActiveChat(null);
    setInput("");
  };

  // Load a saved chat
  const loadChat = (chatId: string) => {
    const chatToLoad = savedChats.find((chat) => chat.id === chatId);
    if (!chatToLoad) return;

    // Direct load for snappiness
    setMessages(
      chatToLoad.messages.map((msg) => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      }))
    );
    setAiHistory(chatToLoad.aiHistory || []);
    setActiveChat(chatId);
  };

  // Handle delete confirmation
  const confirmDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    e.preventDefault();
    setChatToDelete(chatId);
  };

  // Delete a chat after confirmation
  const deleteChat = () => {
    if (!chatToDelete) return;

    const updatedChats = savedChats.filter((chat) => chat.id !== chatToDelete);
    setSavedChats(updatedChats);
    localStorage.setItem(`katou-chats-${userId}`, JSON.stringify(updatedChats));

    // If the active chat was deleted, reset to new chat state WITHOUT saving
    if (activeChat === chatToDelete) {
      setAnimateChat(false);
      setTimeout(() => {
        setMessages([
          {
            text: "Hi! I'm Katou. I can tell you all about Khairil's projects, blogs, and experience. What would you like to know?",
            isUser: false,
            id: `msg-${Date.now()}`,
          },
        ]);
        setAiHistory([]);
        setActiveChat(null);
        setInput("");
        setAnimateChat(true);
      }, 300);
    }

    setChatToDelete(null);
  };

  const editMessage = async (messageId: string, newText: string) => {
    if (!newText.trim() || pending) return;

    // Find the message index
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Truncate history to point before this message
    // Since history has [initial_prompt, initial_response, ...userHistory]
    // And messages has [initial_response, ...userHistory]
    // index in messages maps to index-1 in user part of aiHistory
    const userHistoryIndex = messageIndex - 1;

    // Filter messages and aiHistory up to this point
    const updatedMessages = messages.slice(0, messageIndex);
    const updatedAiHistory = aiHistory.slice(0, userHistoryIndex);

    setMessages(updatedMessages);
    setAiHistory(updatedAiHistory);
    setInput(newText);

    // Trigger sendMessage with the new input
    // We can't call sendMessage directly because it uses the 'input' state which might not be updated yet
    // So we manually perform the send logic with newText
    setTimeout(() => {
      sendMessageWithText(newText, updatedMessages, updatedAiHistory);
    }, 0);
  };

  const sendMessageWithText = async (text: string, currentMessages: Message[], currentAiHistory: ChatHistoryItem[]) => {
    if (pending) return;

    const userMessage = text.trim();
    const userMessageId = `msg-${Date.now()}-user`;
    const newMessages: Message[] = [
      ...currentMessages,
      { text: userMessage, isUser: true, id: userMessageId },
    ];
    setMessages(newMessages);

    const newAiHistory: ChatHistoryItem[] = [
      ...currentAiHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    setAiHistory(newAiHistory);
    setInput("");
    setPending(true);

    const responseId = `msg-${Date.now()}-ai`;
    setMessages((prev) => [
      ...prev,
      { text: "●●●", isUser: false, id: responseId },
    ]);

    let responseText = "";
    let buffer = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: currentAiHistory }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                responseText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    text: responseText,
                    isUser: false,
                    id: responseId,
                  };
                  return updated;
                });
              }
            } catch { }
          }
        }
      }

      const finalMessages: Message[] = [
        ...newMessages,
        { text: responseText, isUser: false, id: responseId },
      ];
      setMessages(finalMessages);

      const finalAiHistory: ChatHistoryItem[] = [
        ...newAiHistory,
        { role: "model", parts: [{ text: responseText }] },
      ];
      setAiHistory(finalAiHistory);
      saveCurrentChat(finalMessages, finalAiHistory);
    } catch (error) {
      console.error("Error during chat:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          text: "An error occurred. Please try знова.",
          isUser: false,
          id: responseId,
        };
        return updated;
      });
    } finally {
      setPending(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || pending) return;
    sendMessageWithText(input, messages, aiHistory);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!chatToDelete}
        onOpenChange={(open) => !open && setChatToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat history. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteChat}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Desktop Chat History Sidebar */}
      <div
        className="hidden md:flex flex-col w-64 h-full overflow-hidden"
        role="navigation"
        aria-label="Chat history sidebar"
      >
        <ChatHistorySidebar
          chatsList={chatsList}
          activeChat={activeChat}
          isMobile={isMobile}
          startNewChat={startNewChat}
          loadChat={loadChat}
          confirmDeleteChat={confirmDeleteChat}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 mx-auto w-full flex flex-col h-full overflow-hidden bg-background/20 backdrop-blur-sm">
        {/* Header */}
        <motion.header
          className="flex items-center mb-2 pb-2 sticky top-2 z-10 mx-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="View profile picture"
              >
                <Image
                  src="/assets/chat.webp"
                  width={50}
                  height={50}
                  alt="Katou Megumin"
                  loading="lazy"
                  className="aspect-square mr-2 overflow-hidden object-cover object-center rounded-full ring-[1px] ring-custom/50 transition-all"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-transparent shadow-none border-none rounded">
              <DialogTitle className="sr-only">Profile Picture</DialogTitle>
              <motion.div
                className="flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/assets/chat.webp"
                  width={400}
                  height={400}
                  alt="Katou Megumin"
                  className="rounded object-cover"
                />
              </motion.div>
            </DialogContent>
          </Dialog>
          <div className="flex flex-col ml-1">
            <h1
              className="text-lg font-semibold tracking-tight leading-none"
              aria-label="Chat assistant name"
            >
              Katou
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Online
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="ml-auto mr-2 flex items-center gap-2">
            {/* Music Player Dialog */}
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-background/50 hover:bg-background/80 border-custom/20"
                  title="Open Music Player"
                  aria-label="Open music player"
                >
                  <SpeakerLoudIcon className="h-4 w-4 text-custom" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-none rounded">
                <DialogHeader>
                  <DialogTitle className="sr-only">Music Player</DialogTitle>
                </DialogHeader>
                <MusicPlayer />
              </DialogContent>
            </Dialog> */}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-custom hover:bg-custom/10 h-8 w-8 sm:w-auto sm:px-4"
                onClick={startNewChat}
                aria-label="Start a new chat"
              >
                <PlusIcon className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline font-medium uppercase text-[11px] tracking-wider">New Chat</span>
              </Button>
            </motion.div>

            {/* List Chat Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {/* Mobile Chat History Sidebar */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    aria-label="Open chat history sidebar"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 4C2.22386 4 2 3.77614 2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5C13 3.77614 12.7761 4 12.5 4H2.5ZM2.5 8C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.22386 12.7761 8 12.5 8H2.5ZM2 11.5C2 11.2239 2.22386 11 2.5 11H12.5C12.7761 11 13 11.2239 13 11.5C13 11.7761 12.7761 12 12.5 12H2.5C2.22386 12 2 11.7761 2 11.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] p-0 border-none"
                  aria-labelledby="chat-history-sidebar-title"
                >
                  <button className="hidden" data-close-sheet></button>
                  <SheetHeader>
                    <SheetTitle className="sr-only">Chat History Sidebar</SheetTitle>
                  </SheetHeader>
                  <ChatHistorySidebar
                    chatsList={chatsList}
                    activeChat={activeChat}
                    isMobile={isMobile}
                    startNewChat={startNewChat}
                    loadChat={loadChat}
                    confirmDeleteChat={confirmDeleteChat}
                  />
                </SheetContent>
              </Sheet>
            </motion.div>
          </div>
        </motion.header>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 min-h-0 scrollbar-hide space-y-4"
          ref={messagesContainerRef}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              isLast={index === messages.length - 1}
              isStreaming={index === messages.length - 1 && pending}
              onEdit={(newText) => editMessage(msg.id, newText)}
            />
          ))}
          <div ref={messagesEndRef} /> {/* Empty div for auto-scroll */}
        </div>

        {/* Input Section */}
        <motion.div
          className="p-4 bg-background/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <Input
              className="w-full rounded-xl px-4 py-6 bg-secondary/20 border-none focus-visible:ring-0 shadow-none transition-colors focus:bg-secondary/40"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyPress={(e) => e.key === "Enter" && !pending && sendMessage()}
              disabled={pending}
              aria-label="Message input"
              aria-describedby="message-input-help"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="flex items-center p-3 h-full rounded-xl text-custom hover:bg-custom/10"
                onClick={sendMessage}
                disabled={pending}
                aria-label={pending ? "Sending message" : "Send message"}
              >
                {pending ? (
                  <div
                    className="flex items-center"
                    aria-hidden="true"
                  >
                    <ReloadIcon className="animate-spin w-5 h-5" />
                  </div>
                ) : (
                  <div
                    className="flex items-center"
                    aria-hidden="true"
                  >
                    <RocketIcon className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// Dynamic import for ChatHistorySidebar
const ChatHistorySidebar = dynamic(
  () => import("../../components/Chat/ChatHistorySidebar"),
  { ssr: false }
);
