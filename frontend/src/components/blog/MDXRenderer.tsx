"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

// Update the animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const codeBlockVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { stiffness: 300, damping: 25 }, // Removed type: "spring"
  },
};

interface MDXRendererProps {
  content: string;
}

type CalloutType = "info" | "warning" | "success" | "error";

export function MDXRenderer({ content }: MDXRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose prose-neutral dark:prose-invert max-w-none prose-lg"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          // Basic text styling
          p: ({ children, ...props }) => (
            <p
              className="leading-7 text-foreground/70 [&:not(:first-child)]:mt-6"
              {...props}
            >
              {children}
            </p>
          ),

          // Clean heading styles
          h1: ({ children, ...props }) => (
            <h1
              className="text-4xl font-bold mb-8 text-foreground border-b border-border/20 pb-4"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, className, ...props }) => (
            <h2
              className="text-3xl font-bold mt-16 mb-6 text-foreground/90 scroll-mt-20 flex items-center gap-3"
              {...props}
            >
              <div className="w-1 h-8 bg-primary/60 rounded-full"></div>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-12 mb-4 text-foreground/80 scroll-mt-20 flex items-center gap-2"
              {...props}
            >
              <div className="w-1 h-6 bg-primary/40 rounded-full"></div>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xl font-semibold mt-8 mb-3 text-foreground/80 scroll-mt-20 pl-4"
              {...props}
            >
              {children}
            </h4>
          ),

          // Clean code block
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            if (!inline && match) {
              return (
                <motion.div
                  variants={codeBlockVariants}
                  initial="initial"
                  animate="animate"
                  className="relative group my-8 rounded overflow-hidden shadow-md"
                >
                  <div className="flex bg-secondary border-none outline-none items-center justify-between px-4 py-2 shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-custom">
                        {language}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(code)}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {copiedCode === code ? (
                        <Check className="h-4 w-4 text-custom" />
                      ) : (
                        <Copy className="h-4 w-4 text-foreground/50" />
                      )}
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    className="!mt-0 bg-transparent !rounded-none !border-none"
                    customStyle={{
                      margin: 0,
                      padding: "1.25rem",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </motion.div>
              );
            }

            return (
              <code className="font-mono text-[0.9em] text-primary" {...props}>
                {children}
              </code>
            );
          },

          // Enhanced blockquote with author support
          blockquote: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            let quoteContent = children;
            let author = null;
            if (childrenArray.length > 0) {
              const lastChild = childrenArray[childrenArray.length - 1];
              if (React.isValidElement(lastChild) && lastChild.type === "p") {
                const text = lastChild.props.children;
                if (typeof text === "string" && text.trim().startsWith("-- ")) {
                  author = text.trim().slice(3).trim();
                  quoteContent = childrenArray.slice(0, -1);
                }
              }
            }
            return (
              <motion.blockquote
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className={`my-8 pl-6 py-3 text-foreground/60 italic bg-custom/10 rounded border-l-2 border-primary/30 ${
                  author ? "relative" : ""
                }`}
              >
                {quoteContent}
                {author && (
                  <cite className="block mt-2 text-right text-sm font-medium text-foreground/50 not-italic">
                    — {author}
                  </cite>
                )}
              </motion.blockquote>
            );
          },

          // Cleaner link style
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
              {href?.startsWith("http") && (
                <ExternalLink className="h-3 w-3 opacity-50" />
              )}
            </a>
          ),

          // Simpler list items
          li: ({ children, ...props }) => (
            <li
              className="text-foreground/70 leading-relaxed flex items-start gap-3 my-2"
              {...props}
            >
              <div className="w-1 h-1 bg-primary/40 rounded-full mt-2.5 flex-shrink-0"></div>
              <span>{children}</span>
            </li>
          ),

          // Clean strong text
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground/90" {...props}>
              {children}
            </strong>
          ),
          img: ({ src, alt, title, width, height, ...props }) => {
            if (!src) return null;

            // For images inside paragraphs, use inline styling to avoid block elements
            return (
              <span className="inline-block relative w-full max-w-full my-4">
                <span className="block relative w-full h-64 overflow-hidden rounded">
                  <Image
                    src={src}
                    alt={alt || ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    {...props}
                  />
                </span>
                {title && (
                  <span className="block text-center text-sm text-muted-foreground mt-2 italic">
                    {title}
                  </span>
                )}
              </span>
            );
          },

          // Callout boxes
          div: ({ className, children, ...props }) => {
            if (className && className.includes("callout")) {
              const extractedType =
                className.split(" ")[0].split("-")[1] || "info";
              const type: CalloutType = (
                ["info", "warning", "success", "error"] as const
              ).includes(extractedType as CalloutType)
                ? (extractedType as CalloutType)
                : "info";
              const iconMap: Record<CalloutType, string> = {
                info: "i",
                warning: "!",
                success: "✓",
                error: "✕",
              };

              const childrenArray = React.Children.toArray(children);
              let titleElement = null;
              let content = children;

              // Check if first child is a strong element (title)
              if (
                childrenArray.length > 0 &&
                React.isValidElement(childrenArray[0]) &&
                childrenArray[0].type === "strong"
              ) {
                titleElement = childrenArray[0];
                content = childrenArray.slice(1);
              }

              return (
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className={`my-6 p-4 rounded border-l-4 shadow-sm ${
                    type === "warning"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                      : type === "error"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                      : type === "success"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {iconMap[type]}
                    <div className="flex-1">
                      {titleElement ? (
                        <>
                          <div className="font-semibold text-base mb-2">
                            {titleElement}
                          </div>
                          {content}
                        </>
                      ) : (
                        children
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },

          // Collapsible sections
          details: ({ children, ...props }) => (
            <details className="my-6" {...props}>
              {children}
            </details>
          ),
          summary: ({ children, ...props }) => (
            <summary
              className="cursor-pointer font-medium text-foreground/80 hover:text-foreground"
              {...props}
            >
              {children}
            </summary>
          ),

          // Highlight text
          mark: ({ children, ...props }) => (
            <mark
              className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
              {...props}
            >
              {children}
            </mark>
          ),

          // Enhanced table styling
          table: ({ children, ...props }) => (
            <div className="my-8 rounded overflow-x-auto">
              <table className="min-w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="bg-background" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-muted/25 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
              {...props}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
