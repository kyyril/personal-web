"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const XAI_API_KEY = process.env.NEXT_PUBLIC_XAI_API_KEY;

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
        "You are Eri, a chatbot created by Kiril and inspired by the oddities of the universe! 🌌",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setPending(true);

    try {
      const response = await fetch(XAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${XAI_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [...history, { role: "user", content: userMessage }],
          model: "grok-beta",
          stream: false,
          temperature: 0,
        }),
      });

      const data = await response.json();
      const rawResponse =
        data?.choices?.[0]?.message?.content || "No response.";
      setMessages((prev) => [...prev, { text: rawResponse, isUser: false }]);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: rawResponse },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred. Please try again.", isUser: false },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="max-w-7xl mt-2 w-full px-4 md:px-16 mx-auto">
      <Card className="px-1 mx-auto max-w-3xl">
        {/* Header */}
        <header className="flex m-3 bg-violet-500 py-1 rounded-full bg-opacity-10 sticky top-0 z-10">
          <Image
            src="/assets/erii.jpg"
            width={50}
            height={50}
            alt="Eri"
            loading="lazy"
            className="aspect-square mx-2 overflow-hidden object-cover object-center rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-center font-sans text-2xl">Eri</h1>
            <p className="text-start font-sans text-sm text-green-600 font-light">
              Online
            </p>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="mx-3 mt-5 h-[360px] overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  msg.isUser
                    ? "bg-violet-500 text-white rounded-l-sm rounded-b-md p-2 my-2"
                    : "bg-secondary text-primary rounded-r-sm rounded-b-md p-2 my-2"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ inline, children }: any) {
                      return inline ? (
                        <code className="bg-purple-500 bg-opacity-10 text-red-600 px-1 rounded">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-purple-500 bg-opacity-10 dark:text-primary p-2 rounded overflow-x-auto">
                          <code>{children}</code>
                        </pre>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
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
                <Loader className="ml-2 animate-spin w-4 h-4 text-purple-500" />
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
