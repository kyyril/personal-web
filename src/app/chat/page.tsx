"use client"; // File: pages/chat.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [history, setHistory] = useState<{ user: string; ai: string }[]>([]); // Menyimpan riwayat percakapan

  const sendMessage = async () => {
    if (input.trim()) {
      // Tambahkan pesan pengguna ke dalam state
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, isUser: true },
      ]);

      // Gabungkan riwayat percakapan dengan pertanyaan baru
      const context = history
        .map((entry) => `User: ${entry.user}, AI: ${entry.ai}`)
        .join(" ");
      const questionWithContext = context ? `${context} User: ${input}` : input;

      try {
        // Kirim pertanyaan dengan konteks ke API
        const response = await fetch(
          `${GEMINI_URL}${encodeURIComponent(questionWithContext)}`
        );
        const data = await response.json();

        // Tambahkan respons AI ke dalam state pesan
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.text, isUser: false },
        ]);

        // Simpan riwayat percakapan
        setHistory([...history, { user: input, ai: data.text }]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Terjadi kesalahan, coba lagi.", isUser: false },
        ]);
      }

      setInput(""); // Kosongkan input setelah dikirim
    }
  };

  return (
    <Card className="mt-6 outline-1 mx-auto xs:mx-2 max-w-3xl">
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
          <h1 className="text-center font-sans text-2xl">Gemini chan</h1>
          <p className="text-start font-sans text-sm text-green-600 font-light">
            Online.
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
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="m-3 flex flex-col">
        <Input
          className="w-full border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something.."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button className="mt-2 flex items-center" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Card>
  );
}
