"use client"; // File: pages/chat.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

const GEMINI_URL = process.env.NEXT_PUBLIC_GEMINI;

// Tipe untuk pesan dalam chat
type Message = {
  text: string;
  isUser: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! How can I help you today? 😁", isUser: false },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false); // State untuk melacak status pending
  const [history, setHistory] = useState<{ user: string; ai: string }[]>([]);

  const formatResponse = (responseText: string): string => {
    return responseText
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)/g, "<strong>-</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\s*\n/g, "<br />")
      .replace(/\n/g, "<br />");
  };

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, isUser: true },
      ]);

      const lastHistory =
        history.length > 0 ? history[history.length - 1] : null;
      const questionWithContext = lastHistory
        ? `history user:${lastHistory.user}, history ai:${lastHistory.ai}, now question:${input}`
        : input;

      setPending(true); // Set status pending ke true

      try {
        const response = await fetch(
          `${GEMINI_URL}${encodeURIComponent(questionWithContext)}`
        );
        const data = await response.json();

        const formattedResponse = formatResponse(data.text);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formattedResponse, isUser: false },
        ]);

        setHistory([...history, { user: input, ai: formattedResponse }]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Terjadi kesalahan, coba lagi.", isUser: false },
        ]);
      }

      setPending(false); // Set status pending ke false setelah selesai
      setInput("");
    }
  };

  return (
    <section className="max-w-7xl mt-4 w-full px-4 md:px-16 mx-auto">
      <Card className="px-1 mx-auto max-w-3xl">
        {/* Header sticky */}
        <header className="flex m-3 bg-violet-500 py-1 rounded-full bg-opacity-10 sticky top-0 z-10">
          <Image
            src="/assets/kaoru.jpg"
            width={50}
            height={50}
            alt="image"
            className="aspect-square mx-2 overflow-hidden object-cover object-center rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-center font-sans text-2xl">Gemini Chan</h1>
            <p className="text-start font-sans text-sm text-green-600 font-light">
              online.
            </p>
          </div>
          <hr />
        </header>

        {/* Chat area with scrolling enabled */}
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
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></p>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="m-3 flex flex-col">
          <Input
            className="w-full border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={pending} // Nonaktifkan input saat pending
          />
          <Button
            className="mt-2 flex items-center"
            onClick={sendMessage}
            disabled={pending} // Nonaktifkan tombol saat pending
          >
            {pending ? (
              "Was thinking.."
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
