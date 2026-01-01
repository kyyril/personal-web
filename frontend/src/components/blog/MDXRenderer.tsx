"use client";

import React, { useRef, useEffect } from "react";
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
  X,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import mermaid from "mermaid";

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

// Mermaid Diagram Component
interface MermaidDiagramProps {
  chart: string;
  isDark: boolean;
}

function MermaidDiagram({ chart, isDark }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Initialize mermaid with enhanced configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        primaryColor: isDark ? '#1f2937' : '#f3f4f6',
        primaryTextColor: isDark ? '#f9fafb' : '#1f2937',
        primaryBorderColor: isDark ? '#374151' : '#d1d5db',
        lineColor: isDark ? '#9ca3af' : '#6b7280',
        secondaryColor: isDark ? '#374151' : '#e5e7eb',
        tertiaryColor: isDark ? '#1f2937' : '#f9fafb',
        background: isDark ? '#0f172a' : '#ffffff',
        mainBkg: isDark ? '#1e293b' : '#ffffff',
        secondBkg: isDark ? '#334155' : '#f8fafc',
        tertiaryBkg: isDark ? '#475569' : '#f1f5f9',
        edgeLabelBackground: isDark ? '#374151' : '#ffffff',
        clusterBkg: isDark ? '#374151' : '#f9fafb',
        clusterBorder: isDark ? '#6b7280' : '#d1d5db',
        defaultLinkColor: isDark ? '#9ca3af' : '#6b7280',
        titleColor: isDark ? '#f9fafb' : '#1f2937',
        fillType0: isDark ? '#374151' : '#e5e7eb',
        fillType1: isDark ? '#4b5563' : '#d1d5db',
      },
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
      gantt: {
        useMaxWidth: true,
      },
      journey: {
        useMaxWidth: true,
      },
      er: {
        useMaxWidth: true,
      },
      gitGraph: {
        useMaxWidth: true,
      },
    });

    const renderDiagram = async () => {
      try {
        // Clean the chart content and validate
        const cleanedChart = chart.trim();
        if (!cleanedChart) {
          throw new Error('Empty Mermaid diagram');
        }

        // Generate unique ID for this diagram
        const diagramId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        const { svg } = await mermaid.render(diagramId, cleanedChart);
        if (ref.current) {
          ref.current.innerHTML = svg;
          // Add responsive behavior
          const svgElement = ref.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.maxWidth = '100%';
          }
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div class="text-red-500 p-4 rounded bg-red-50 dark:bg-red-900/20">
              <div class="font-semibold mb-2">Failed to render Mermaid diagram</div>
              <div class="text-sm opacity-80 mb-3">${error instanceof Error ? error.message : 'Unknown error'}</div>
              <details class="text-xs">
                <summary class="cursor-pointer hover:underline">View diagram source</summary>
                <pre class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">${chart}</pre>
              </details>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [chart, isDark]);

  return (
    <div className="mermaid-container my-8 p-4 bg-background rounded-lg shadow-sm overflow-x-auto">
      <div ref={ref} className="mermaid-diagram" />
    </div>
  );
}

interface MDXRendererProps {
  content: string;
}

type CalloutType = "info" | "warning" | "success" | "error";

export function MDXRenderer({ content }: MDXRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

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
              className="text-4xl font-bold mb-8 text-foreground pb-4"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, className, ...props }) => (
            <h2
              className="text-3xl font-bold mt-16 mb-6 text-foreground/90 scroll-mt-20"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-12 mb-4 text-foreground/80 scroll-mt-20"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xl font-semibold mt-8 mb-3 text-foreground/80 scroll-mt-20"
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

            // Handle Mermaid diagrams - check both className language and direct mermaid syntax
            const isMermaid = !inline && (
              language === "mermaid" ||
              // Check if the code starts with common mermaid diagram types
              code.trim().startsWith('sequenceDiagram') ||
              code.trim().startsWith('flowchart') ||
              code.trim().startsWith('graph') ||
              code.trim().startsWith('stateDiagram') ||
              code.trim().startsWith('classDiagram') ||
              code.trim().startsWith('erDiagram') ||
              code.trim().startsWith('journey') ||
              code.trim().startsWith('gitgraph') ||
              code.trim().startsWith('quadrantChart')
            );

            if (isMermaid) {
              return (
                <motion.div
                  variants={codeBlockVariants}
                  initial="initial"
                  animate="animate"
                  className="my-8"
                >
                  <MermaidDiagram chart={code} isDark={isDark} />
                </motion.div>
              );
            }

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
                className={`my-8 pl-6 py-3 text-foreground/60 italic bg-custom/10 rounded ${author ? "relative" : ""
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
                <ExternalLink className="h-3 w-3 opacity-70" />
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

            return (
              <span className="block my-4">
                <span
                  className="block relative w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg cursor-zoom-in"
                  onClick={() => setZoomImage({ src, alt: alt || "" })}
                >
                  <Image
                    src={src}
                    alt={alt || ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                    {...props}
                  />
                </span>
                {alt && (
                  <span className="block text-center text-sm text-muted-foreground mt-3 italic font-medium">
                    {alt}
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
                  className={`my-6 p-4 rounded shadow-sm ${type === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                    : type === "error"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                      : type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
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

      {/* Enhanced Lightbox Overlay */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 sm:p-8 md:p-12"
            onClick={() => setZoomImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setZoomImage(null)}
                className="absolute top-0 right-0 sm:-top-12 sm:-right-0 p-3 rounded-full bg-secondary/80 hover:bg-secondary text-foreground backdrop-blur-md transition-all z-[110]"
                aria-label="Close image"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="relative w-full flex-1 min-h-0 bg-transparent rounded-lg overflow-hidden">
                {zoomImage?.src && (
                  <Image
                    src={zoomImage.src}
                    alt={zoomImage.alt || ""}
                    fill
                    className="object-contain"
                    priority
                    quality={100}
                  />
                )}
              </div>

              {zoomImage?.alt && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground/80 text-sm sm:text-base font-medium text-center bg-secondary/50 px-6 py-2 rounded-full backdrop-blur-md"
                >
                  {zoomImage.alt}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
