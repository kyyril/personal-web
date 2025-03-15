"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([
    {
      role: "user",
      parts: [
        {
          text: "You're Katou, an AI chatbot, build by none other than Khairil or as call him, Kiril. He’s just a handsome and smart guy who love computer science and philosophy, all while being endlessly inspired by the quirks of the universe. 🛸 Pretty awesome, right?",
        },
      ],
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setHistory((prev) => [
      ...prev,
      { role: "user", parts: [{ text: userMessage }] },
    ]);
    setInput("");
    setPending(true);

    try {
      const chatSession = model.startChat({ generationConfig, history });

      // Mulai request streaming
      const result = await chatSession.sendMessageStream(userMessage);

      let responseText = "";
      setMessages((prev) => [...prev, { text: "", isUser: false }]); // Siapkan bubble chat kosong

      for await (const chunk of result.stream) {
        responseText += chunk.text(); // Tambahkan teks hasil streaming
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            text: responseText,
            isUser: false,
          };
          return updatedMessages;
        });
      }

      setHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: responseText }] },
      ]);
    } catch (error) {
      console.error("Error during Gemini interaction:", error);
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred. Please try again.", isUser: false },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="max-w-7xl w-full h-full px-4 md:px-16 overflow-hidden mx-auto pb-16">
      <Card className="px-1 mx-auto max-w-3xl">
        {/* Header */}
        <header className="flex m-3 bg-custom py-1 rounded-full bg-opacity-10 sticky top-0 z-10">
          <Dialog>
            <DialogTrigger>
              <Image
                src="/assets/katou.gif"
                width={50}
                height={50}
                alt="Katou Megumin"
                loading="lazy"
                className="aspect-square ring-1 ring-custom mx-2 overflow-hidden object-cover object-center rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              />
            </DialogTrigger>
            <DialogContent className="bg-transparent shadow-none border-none rounded-2xl">
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/katou.gif"
                  width={400}
                  height={400}
                  alt="Katou Megumin"
                  className="rounded-sm object-cover"
                />
              </div>
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
        </header>

        {/* Chat Messages */}
        <div className="mx-3 mt-5 h-[360px] overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0, scale: 0.8 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.5 },
                  height: { duration: 0.5 },
                  scale: { duration: 0.3 },
                }}
              >
                <div
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      msg.isUser
                        ? "bg-custom text-white rounded-l-sm rounded-b-md p-2 my-2"
                        : "bg-secondary text-primary rounded-r-sm rounded-b-md p-2 my-2"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Section */}
        <div className="m-3 flex flex-col">
          <Input
            className="w-full border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyPress={(e) => e.key === "Enter" && !pending && sendMessage()}
            disabled={pending}
          />
          <Button
            className="mt-2 flex items-center"
            onClick={sendMessage}
            disabled={pending}
          >
            {pending ? (
              <div className="flex items-center text-secondary">
                Thinking...
                <ReloadIcon className="ml-2 animate-spin w-4 h-4 text-custom" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-secondary">
                <span>Send</span>
                <RocketIcon className="h-4 w-4 text-custom" />
              </div>
            )}
          </Button>
        </div>
      </Card>
    </section>
  );
}
