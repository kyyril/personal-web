"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ReloadIcon,
  RocketIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

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

export default function Chat() {
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
      text: "How can I help you today?",
      isUser: false,
      id: `msg-${Date.now()}`,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [aiHistory, setAiHistory] = useState<any[]>([
    {
      role: "user",
      parts: [
        {
          text: "You're Katou, an AI chatbot, build by none other than Khairil or as call him, Kiril. He's just a handsome and smart guy who love computer science and philosophy, all while being endlessly inspired by the quirks of the universe. 🛸 Pretty awesome, right?",
        },
      ],
    },
  ]);
  const [savedChats, setSavedChats] = useState<ChatHistory[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [animateChat, setAnimateChat] = useState<boolean>(true);
  const [chatsList, setChatsList] = useState<ChatHistory[]>([]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
  const saveCurrentChat = async () => {
    if (!userId) return;
    if (messages.length <= 1) return; // Don't save empty chats

    const chatId = activeChat || Date.now().toString();
    let title;

    if (activeChat) {
      // Keep existing title for existing chat
      const existingChat = savedChats.find((chat) => chat.id === activeChat);
      title = existingChat?.title || extractChatTitle(messages);
    } else {
      // For new chats, use the first user message
      title = extractChatTitle(messages);
    }

    const chatToSave: ChatHistory = {
      id: chatId,
      title,
      messages,
      timestamp: Date.now(),
      aiHistory,
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

    setSavedChats(updatedChats);
    localStorage.setItem(`katou-chats-${userId}`, JSON.stringify(updatedChats));
    setActiveChat(chatId);

    return chatId;
  };

  // Start a new chat
  const startNewChat = () => {
    // Save current chat if there are messages
    if (messages.length > 1) {
      saveCurrentChat();
    }

    // Reset current chat with animation
    setAnimateChat(false);
    setTimeout(() => {
      setMessages([
        {
          text: "How can I help you today?",
          isUser: false,
          id: `msg-${Date.now()}`,
        },
      ]);
      setAiHistory([
        {
          role: "user",
          parts: [
            {
              text: "Your name is Katou, an AI chatbot, build by none other than Khairil or as call him, Kiril. He's just a handsome and smart guy who love computer science and philosophy, all while being endlessly inspired by the quirks of the universe. 🛸 Pretty awesome, right?",
            },
          ],
        },
      ]);
      setActiveChat(null);
      setInput("");
      setAnimateChat(true);
    }, 300);
  };

  // Load a saved chat
  const loadChat = (chatId: string) => {
    const chatToLoad = savedChats.find((chat) => chat.id === chatId);
    if (!chatToLoad) return;

    setAnimateChat(false);
    setTimeout(() => {
      setMessages(
        chatToLoad.messages.map((msg) => ({
          ...msg,
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
        }))
      );
      setAiHistory(chatToLoad.aiHistory || []);
      setActiveChat(chatId);
      setAnimateChat(true);
    }, 300);
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

    // If the active chat was deleted, start a new one
    if (activeChat === chatToDelete) {
      startNewChat();
    }

    setChatToDelete(null);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMessageId = `msg-${Date.now()}-user`;
    const newMessages = [
      ...messages,
      { text: userMessage, isUser: true, id: userMessageId },
    ];
    setMessages(newMessages);

    const newAiHistory = [
      ...aiHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    setAiHistory(newAiHistory);

    setInput("");
    setPending(true);

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: aiHistory,
      });

      // Start streaming request
      const result = await chatSession.sendMessageStream(userMessage);

      let responseText = "";
      const responseId = `msg-${Date.now()}-ai`;
      setMessages((prev) => [
        ...prev,
        { text: "", isUser: false, id: responseId },
      ]); // Prepare empty chat bubble

      for await (const chunk of result.stream) {
        responseText += chunk.text(); // Add streaming text result
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            text: responseText,
            isUser: false,
            id: responseId,
          };
          return updatedMessages;
        });
      }

      const finalAiHistory = [
        ...newAiHistory,
        { role: "model", parts: [{ text: responseText }] },
      ];
      setAiHistory(finalAiHistory);

      // Save chat after each message exchange
      setTimeout(() => saveCurrentChat(), 500);
    } catch (error) {
      console.error("Error during Gemini interaction:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "An error occurred. Please try again.",
          isUser: false,
          id: `error-${Date.now()}`,
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  // Chat history sidebar component (uses chatsList to avoid re-renders)
  const ChatHistorySidebar = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <span className="text-xs font-thin text-red-500/60">
          *This chat is saved in your localstorage
        </span>
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
        className="mx-4 mb-4 bg-custom hover:bg-custom/90 text-white"
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
                >
                  <TrashIcon className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  onClick={(e) => confirmDeleteChat(chat.id, e)}
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

  return (
    <section className="max-w-7xl w-full h-full px-4 md:px-16 overflow-hidden mx-auto pb-16">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!chatToDelete}
          onOpenChange={(open) => !open && setChatToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this chat history. This action
                cannot be undone.
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

        {/* Mobile Chat History Sidebar */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mt-2 w-8 h-8">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4C2.22386 4 2 3.77614 2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5C13 3.77614 12.7761 4 12.5 4H2.5ZM2.5 8C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5ZM2 11.5C2 11.2239 2.22386 11 2.5 11H12.5C12.7761 11 13 11.2239 13 11.5C13 11.7761 12.7761 12 12.5 12H2.5C2.22386 12 2 11.7761 2 11.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60">
            <button className="hidden" data-close-sheet></button>
            <ChatHistorySidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop Chat History Sidebar */}
        <Card className="hidden md:flex flex-col w-64 h-[500px] overflow-hidden">
          <ChatHistorySidebar />
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 px-1 mx-auto w-full">
          {/* Header */}
          <motion.header
            className="flex m-3 bg-custom py-1 rounded-full bg-opacity-10 sticky top-0 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog>
              <DialogTrigger>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="/assets/katou.gif"
                    width={50}
                    height={50}
                    alt="Katou Megumin"
                    loading="lazy"
                    className="aspect-square ring-1 ring-custom mx-2 overflow-hidden object-cover object-center rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </motion.div>
              </DialogTrigger>
              <DialogContent className="bg-transparent shadow-none border-none rounded-2xl">
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/katou.gif"
                    width={400}
                    height={400}
                    alt="Katou Megumin"
                    className="rounded-sm object-cover"
                  />
                </motion.div>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col gap-y-1">
              <h1 className="text-center text-xl font-sans font-light">
                加藤 恵
              </h1>
              <p className="text-start font-sans text-xs text-green-600 font-light">
                Online.
              </p>
            </div>

            {/* New Chat Button */}
            <div className="ml-auto mr-2 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={startNewChat}
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">New Chat</span>
                </Button>
              </motion.div>
            </div>
          </motion.header>

          {/* Chat Messages */}
          <div
            className="mx-3 mt-5 h-[360px] overflow-y-auto pb-2"
            ref={messagesContainerRef}
          >
            <AnimatePresence mode="popLayout">
              {animateChat &&
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 1, y: -50 }}
                    transition={{ duration: 0.1 }}
                    layout
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[85%] ${
                        msg.isUser
                          ? "bg-custom text-white rounded-l-sm rounded-b-md p-2 my-2"
                          : "bg-secondary text-primary rounded-r-sm rounded-b-md p-2 my-2"
                      }`}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </motion.div>
                  </motion.div>
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} /> {/* Empty div for auto-scroll */}
          </div>

          {/* Input Section */}
          <motion.div
            className="m-3 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex gap-2">
              <Input
                className="w-full border rounded px-3 py-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Something..."
                onKeyPress={(e) =>
                  e.key === "Enter" && !pending && sendMessage()
                }
                disabled={pending}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="flex items-center"
                  onClick={sendMessage}
                  disabled={pending}
                >
                  {pending ? (
                    <div className="flex items-center text-secondary">
                      <ReloadIcon className="animate-spin w-4 h-4 text-custom" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-secondary">
                      <RocketIcon className="h-4 w-4 text-custom" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Card>
      </div>
    </section>
  );
}
