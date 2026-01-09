"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, CopyIcon, Pencil1Icon, Cross2Icon, CheckCircledIcon } from "@radix-ui/react-icons";
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
  onEdit?: (newText: string) => void;
}

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
        <button onClick={copyToClipboard} className="flex items-center gap-1.5 transition-colors hover:text-white">
          {copied ? (
            <><CheckIcon className="h-3.5 w-3.5 text-green-400" /><span className="text-[10px] font-medium">Copied!</span></>
          ) : (
            <><CopyIcon className="h-3 w-3" /><span className="text-[10px] font-medium">Copy code</span></>
          )}
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{ margin: 0, padding: "1.25rem", background: "transparent", fontSize: "12.5px", lineHeight: "1.6" }}
          codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' } }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Animated Three Dots Loading Indicator
const TypingIndicator = () => (
  <div className="flex gap-1.5 py-2 px-1 items-center h-5">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.15,
        }}
        className="w-1.5 h-1.5 bg-custom rounded-full"
      />
    ))}
  </div>
);

const MemoizedReactMarkdown = React.memo(ReactMarkdown);

export default React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage({ msg, isLast, isStreaming, onEdit }, ref) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(msg.text);
    const editInputRef = useRef<HTMLTextAreaElement>(null);
    const showCursor = !msg.isUser && isStreaming;

    useEffect(() => {
      if (isEditing && editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.selectionStart = editInputRef.current.value.length;
      }
    }, [isEditing]);

    const handleSave = () => {
      if (editText.trim() !== "" && editText !== msg.text) onEdit?.(editText);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditText(msg.text);
      setIsEditing(false);
    };

    return (
      <div
        ref={ref}
        className={`flex w-full mb-6 ${msg.isUser ? "justify-end" : "justify-start"}`}
      >
        <div className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"} max-w-[95%] sm:max-w-[85%]`}>
          <div
            className={`relative w-full px-4 py-2.5 transition-all duration-300 ${msg.isUser
              ? "bg-custom/10 text-foreground rounded-[20px] rounded-br-none"
              : "bg-secondary/40 backdrop-blur-md text-foreground rounded-[20px] rounded-tl-none"
              }`}
          >
            {!isEditing ? (
              <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed text-[14px]">
                {msg.text === "●●●" ? (
                  <TypingIndicator />
                ) : (
                  <>
                    <MemoizedReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-5 my-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-5 my-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="my-0.5">{children}</li>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-custom font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
                          >
                            {children}
                          </a>
                        ),
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline ? (
                            <CodeBlock language={match ? match[1] : ""} value={String(children).replace(/\n$/, "")} />
                          ) : (
                            <code className="bg-custom/5 text-custom rounded px-1.5 py-0.5 text-[11px] font-mono font-bold" {...props}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => <>{children}</>,
                        strong: ({ children }) => <strong className="font-black text-custom">{children}</strong>,
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
                      />
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 min-w-[200px] sm:min-w-[300px]">
                <textarea
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-[14px] leading-relaxed resize-none p-0 outline-none min-h-[60px] text-foreground font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
                    if (e.key === "Escape") handleCancel();
                  }}
                />
              </div>
            )}

            {/* {!msg.isUser && (
              <div className="text-[9px] mt-1.5 font-bold tracking-[0.2em] uppercase opacity-20 text-left">
                Katou
              </div>
            )} */}
          </div>

          {/* Buttons in natural FLOW (NOT absolute) */}
          {msg.isUser && (
            <div className="flex gap-5 mt-2.5 px-1">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-30 hover:opacity-100 hover:text-custom transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil1Icon className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-500/40 hover:text-red-500 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cross2Icon className="h-3 w-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-[9px] font-bold uppercase tracking-[0.15em] text-custom/60 hover:text-custom transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    );
  }
);
