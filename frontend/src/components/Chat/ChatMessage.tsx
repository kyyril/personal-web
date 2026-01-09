"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface ChatMessageProps {
  msg: {
    id: string;
    text: string;
    isUser: boolean;
  };
  isLast?: boolean;
  isStreaming?: boolean;
}

// Sub-component for code blocks with Copy button (ChatGPT Style)
const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-2xl">
      <div className="flex items-center justify-between bg-[#2f2f2f] px-4 py-1.5 text-[11px] font-sans text-gray-300">
        <span className="font-mono text-[10px] uppercase tracking-wider">{language || "code"}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3.5 w-3.5 text-green-400" />
              <span className="text-[10px] font-medium">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-3 w-3" />
              <span className="text-[10px] font-medium">Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "12.5px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const MemoizedReactMarkdown = React.memo(ReactMarkdown);

export default React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage({ msg, isLast, isStreaming }, ref) {
    const showCursor = !msg.isUser && isStreaming;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex w-full mb-6 ${msg.isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative max-w-[95%] sm:max-w-[85%] px-4 py-2.5 transition-all duration-500 shadow-sm ${msg.isUser
            ? "bg-custom text-white rounded-[20px] rounded-br-none"
            : "bg-secondary/40 backdrop-blur-md text-foreground rounded-[20px] rounded-tl-none"
            }`}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed text-[14px]">
            <MemoizedReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-5 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-custom font-medium hover:underline underline-offset-4">
                    {children}
                  </a>
                ),
                // Custom Code Block Renderer (ChatGPT Style)
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline ? (
                    <CodeBlock
                      language={match ? match[1] : ""}
                      value={String(children).replace(/\n$/, "")}
                    />
                  ) : (
                    <code className="bg-custom/10 text-custom rounded px-1.5 py-0.5 text-[11px] font-mono font-medium" {...props}>
                      {children}
                    </code>
                  );
                },
                // Skip pre container as SyntaxHighlighter handles it
                pre: ({ children }) => <>{children}</>,
                strong: ({ children }) => <strong className="font-bold text-custom/90">{children}</strong>,
              }}
            >
              {msg.text}
            </MemoizedReactMarkdown>

            {showCursor && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-1 h-[14px] ml-1 bg-custom rounded-full align-middle mb-[2px]"
                aria-hidden="true"
              />
            )}
          </div>

          {!msg.isUser && (
            <div className="text-[8px] mt-1.5 font-bold tracking-[0.15em] uppercase opacity-20 text-left">
              Katou
            </div>
          )}
        </div>

        {msg.isUser && (
          <div className="flex-shrink-0 mb-1 w-1 h-1 rounded-full bg-custom/30" />
        )}
      </motion.div>
    );
  }
);
