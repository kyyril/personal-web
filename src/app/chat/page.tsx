"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, Loader } from "lucide-react";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY; // API Key dari environment

type Message = {
  text: string;
  isUser: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey! I'm Eri, a chatbot created by Kiril. How can I help you today? 😁",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content:
        "You are Eri, a chatbot created by Kiril and inspired by the oddities of the universe! 🌌 Whether you need a quick solution, a fun fact, or just someone to help you navigate the chaos of everyday life, I’m here for you. Like the Hitchhiker’s Guide, I offer a mix of wisdom, wit, and just the right amount of randomness. Don’t panic—ask me anything, and let’s explore the unknown together! 🚀💬",
    },
  ]);

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, isUser: true },
      ]);

      setHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: input },
      ]);

      setPending(true);

      try {
        const response = await fetch(XAI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${XAI_API_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              ...history,
              { role: "user", content: input }, // Tambahkan input terakhir
            ],
            model: "grok-beta",
            stream: false,
            temperature: 0,
          }),
        });

        const data = await response.json();
        const aiResponse =
          data?.choices?.[0]?.message?.content || "No response.";

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiResponse, isUser: false },
        ]);

        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "assistant", content: aiResponse },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Terjadi kesalahan, coba lagi.", isUser: false },
        ]);
      }

      setPending(false);
      setInput("");
    }
  };

  return (
    <section className="max-w-7xl mt-2 w-full px-4 md:px-16 mx-auto">
      <Card className="px-1 mx-auto max-w-3xl">
        <header className="flex m-3 bg-violet-500 py-1 rounded-full bg-opacity-10 sticky top-0 z-10">
          <Image
            src="/assets/erii.jpg"
            width={50}
            height={50}
            alt="image"
            loading="lazy"
            className="aspect-square mx-2 overflow-hidden object-cover object-center rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-center font-sans text-2xl">Eri</h1>
            <p className="text-start font-sans text-sm text-green-600 font-light">
              online.
            </p>
          </div>
        </header>

        <div className="mx-3 mt-5 h-[360px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`${
                  msg.isUser
                    ? "bg-violet-500 rounded-l-sm rounded-b-md p-1 my-2"
                    : "bg-secondary rounded-r-sm rounded-b-md p-1"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <div className="m-3 flex flex-col">
          <Input
            className="w-full border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={pending}
          />
          <Button
            className="mt-2 flex items-center"
            onClick={sendMessage}
            disabled={pending}
          >
            {pending ? (
              <div className="w-fit flex flex-row">
                think hard..
                <Loader className="ml-2 animate-spin w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-secondary">
                <span>Send</span>
                <SendIcon className="h-4 w-4 text-violet-500" />
              </div>
            )}
          </Button>
        </div>
      </Card>
    </section>
  );
}
