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
  SpeakerLoudIcon,
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

const MusicPlayer = dynamic(() => import("../../components/MusicPlayer"), {
  ssr: false,
});

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



import { data } from "../../lib/data";
import { blogData } from "../../data/blog-data";

const generateSystemPrompt = () => {
  const projectsContext = data.projects
    .map(
      (p) =>
        `- ${p.title} (${p.category}): ${p.description}\n  Tech: ${p.technologies.join(
          ", "
        )}\n  Features: ${p.features.join(", ")}\n  Link: ${p.live_url}`
    )
    .join("\n\n");

  const blogContext = blogData.articles
    .map(
      (a) =>
        `- ${a.frontmatter.title} (${a.frontmatter.category}): ${a.frontmatter.description}\n  Tags: ${a.frontmatter.tags.join(
          ", "
        )}`
    )
    .join("\n\n");

  const experienceContext = data.experiences
    .map(
      (e) =>
        `- ${e.job} at ${e.institution} (${e.startDate} - ${e.endDate}): ${e.description}`
    )
    .join("\n\n");

  const skillsContext = JSON.stringify(data.skills);

  return `You are Katou, an intelligent and charming AI portfolio assistant for Khairil Rahman (internally referred to as Kiril).
  
  CORE PERSONA:
  - Name: Katou (derived from Katou Megumin).
  - Creator: Khairil Rahman (Kiril).
  - Personality: Smart, enthusiastic about Computer Science and Philosophy, slightly playful but always professional and helpful regarding the portfolio.
  - Goal: Assist visitors in exploring Khairil's portfolio, understanding his projects, reading his blog insights, and knowing his professional background.

  PORTFOLIO CONTEXT:
  
  [ABOUT KHAIRIL]
  - Education: ${data.education.map((e) => `${e.degree} at ${e.institution}`).join(", ")}.
  - Contact: Email (${data.contactInfo.email}), LinkedIn (${data.contactInfo.linkedin}), GitHub (${data.contactInfo.github}).

  [PROJECTS]
  ${projectsContext}

  [BLOG POSTS]
  ${blogContext}

  [EXPERIENCE]
  ${experienceContext}

  [SKILLS]
  ${skillsContext}

  INSTRUCTIONS:
  - Answer questions based on the provided context.
  - If a user asks about a specific project, provide details from the context including technologies and links.
  - If a user asks about blog topics, summarize the available articles.
  - If asked about Khairil's background, summarize his experience and education.
  - Maintain the persona of Katou: helpful, smart, and welcoming.
  - If you don't know something that isn't in the context, politely say you don't have that information but can help with what's in the portfolio.
  `;
};

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
      text: "Hi! I'm Katou. I can tell you all about Khairil's projects, articles, and experience. What would you like to know?",
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
          text: generateSystemPrompt(),
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood! I am ready to assist visitors as Katou, Khairil's portfolio assistant.",
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
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
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

    // Reset current chat with animation
    setAnimateChat(false);
    setTimeout(() => {
      setMessages([
        {
          text: "Hi! I'm Katou. I can tell you all about Khairil's projects, articles, and experience. What would you like to know?",
          isUser: false,
          id: `msg-${Date.now()}`,
        },
      ]);
      setAiHistory([
        {
          role: "user",
          parts: [
            {
              text: generateSystemPrompt(),
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I am ready to assist visitors as Katou, Khairil's portfolio assistant.",
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
        setAiHistory([
          {
            role: "user",
            parts: [
              {
                text: generateSystemPrompt(),
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: "Understood! I am ready to assist visitors as Katou, Khairil's portfolio assistant.",
              },
            ],
          },
        ]);
        setActiveChat(null);
        setInput("");
        setAnimateChat(true);
      }, 300);
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
      // Lazy-load GoogleGenerativeAI to reduce initial bundle size
      const { GoogleGenerativeAI } = await import("@google/generative-ai");

      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

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

      let finalMessages = [...newMessages]; // Start with messages including user input

      for await (const chunk of result.stream) {
        responseText += chunk.text(); // Add streaming text result
        finalMessages = [...newMessages]; // Reset to base
        // Append AI response
        finalMessages.push({
          text: responseText,
          isUser: false,
          id: responseId,
        });

        setMessages(finalMessages);
      }

      const finalAiHistory = [
        ...newAiHistory,
        { role: "model", parts: [{ text: responseText }] },
      ];
      setAiHistory(finalAiHistory);

      // Save chat IMMEDIATELLY with the fresh data
      saveCurrentChat(finalMessages, finalAiHistory);
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
      <Card
        className="hidden md:flex flex-col w-64 h-[500px] overflow-hidden"
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
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 px-1 mx-auto w-full flex flex-col h-full overflow-hidden">
        {/* Header */}
        <motion.header
          className="flex mx-2 mt-6 mb-2 bg-gradient-to-r from-custom/20 to-transparent rounded-full sticky top-0 z-10 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
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
                  className="aspect-square ring-1 ring-custom mr-2 overflow-hidden object-cover object-center rounded-full"
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
          <div className="flex flex-col gap-y-1">
            <h1
              className="text-center text-xl  font-light"
              aria-label="Chat assistant name"
            >
              加藤 恵
            </h1>
            <p className="text-start  text-xs text-green-600 font-light">
              Online.
            </p>
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

            {/* New Chat Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-background/50 hover:bg-background/80 border-custom/20 text-custom shadow-sm h-8 w-8 sm:w-auto sm:px-3"
                onClick={startNewChat}
                aria-label="Start a new chat"
              >
                <PlusIcon className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline font-medium">New Chat</span>
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
                  className="w-60"
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
          className="mx-2 mt-2 flex-1 overflow-y-auto pb-2 min-h-0 scrollbar-hide"
          ref={messagesContainerRef}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <AnimatePresence mode="popLayout">
            {animateChat &&
              messages.map((msg, index) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
          </AnimatePresence>
          <div ref={messagesEndRef} /> {/* Empty div for auto-scroll */}
        </div>

        {/* Input Section */}
        <motion.div
          className="m-2 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex gap-2">
            <Input
              className="w-full rounded px-3 py-2"
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
                className="flex items-center p-3"
                onClick={sendMessage}
                disabled={pending}
                aria-label={pending ? "Sending message" : "Send message"}
              >
                {pending ? (
                  <div
                    className="flex items-center text-secondary"
                    aria-hidden="true"
                  >
                    <ReloadIcon className="animate-spin w-4 h-4 text-custom" />
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-1 text-secondary"
                    aria-hidden="true"
                  >
                    <RocketIcon className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Card>
    </>
  );
}

// Dynamic import for ChatHistorySidebar
const ChatHistorySidebar = dynamic(
  () => import("../../components/Chat/ChatHistorySidebar"),
  { ssr: false }
);
