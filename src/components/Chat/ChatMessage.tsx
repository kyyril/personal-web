"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  msg: {
    id: string;
    text: string;
    isUser: boolean;
  };
}

import React from "react";

export default React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage({ msg }, ref) {
    return (
      <motion.div
        ref={ref}
        key={msg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 1, y: -50 }}
        transition={{ duration: 0.1 }}
        layout
        className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
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
    );
  }
);