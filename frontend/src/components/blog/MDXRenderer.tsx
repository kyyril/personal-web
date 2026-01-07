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
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import mermaid from "mermaid";
import ImagePreview from "../ImagePreview";

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
    transition: { stiffness: 300, damping: 25 },
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
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
      sequence: { useMaxWidth: true, wrap: true },
    });

    const renderDiagram = async () => {
      try {
        const cleanedChart = chart.trim();
        if (!cleanedChart) throw new Error('Empty Mermaid diagram');
        const diagramId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(diagramId, cleanedChart);
        if (ref.current) {
          ref.current.innerHTML = svg;
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
              <pre class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">${chart}</pre>
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

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
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
          p: ({ children }: any) => (
            <p className="leading-7 text-foreground/70 [&:not(:first-child)]:mt-6">
              {children}
            </p>
          ),
          h1: ({ children }: any) => (
            <h1 className="text-4xl font-bold mb-8 text-foreground pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }: any) => (
            <h2 className="text-3xl font-bold mt-16 mb-6 text-foreground/90 scroll-mt-20">
              {children}
            </h2>
          ),
          h3: ({ children }: any) => (
            <h3 className="text-2xl font-semibold mt-12 mb-4 text-foreground/80 scroll-mt-20">
              {children}
            </h3>
          ),
          h4: ({ children }: any) => (
            <h4 className="text-xl font-semibold mt-8 mb-3 text-foreground/80 scroll-mt-20">
              {children}
            </h4>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");
            const isMermaid = !inline && (language === "mermaid" || code.trim().startsWith('sequenceDiagram') || code.trim().startsWith('flowchart') || code.trim().startsWith('graph'));

            if (isMermaid) {
              return <motion.div variants={codeBlockVariants} initial="initial" animate="animate" className="my-8"><MermaidDiagram chart={code} isDark={isDark} /></motion.div>;
            }

            if (!inline && match) {
              return (
                <motion.div variants={codeBlockVariants} initial="initial" animate="animate" className="relative group my-8 rounded-none overflow-hidden shadow-md">
                  <div className="flex bg-secondary border-none outline-none items-center justify-between px-4 py-2 shadow-md">
                    <span className="text-xs font-medium text-custom">{language}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyCode(code)} className="opacity-0 group-hover:opacity-100 transition-all">
                      {copiedCode === code ? <Check className="h-4 w-4 text-custom" /> : <Copy className="h-4 w-4 text-foreground/50" />}
                    </Button>
                  </div>
                  <SyntaxHighlighter style={isDark ? oneDark : oneLight} language={language} PreTag="div" className="!mt-0 bg-transparent !rounded-none !border-none" customStyle={{ margin: 0, padding: "1.25rem", fontSize: "0.9rem", lineHeight: "1.5" }} {...props}>
                    {code}
                  </SyntaxHighlighter>
                </motion.div>
              );
            }
            return <code className="font-mono text-[0.9em] text-primary" {...props}>{children}</code>;
          },
          blockquote: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const findAlert = (nodes: any[]): { type: CalloutType; tag: string } | null => {
              for (const node of nodes) {
                if (typeof node === 'string') {
                  const m = node.match(/\[!\s*(NOTE|INFO|TIP|WARNING|IMPORTANT|CAUTION|ERROR|SUCCESS)\s*\]/i);
                  if (m) {
                    const raw = m[1].toUpperCase();
                    if (['NOTE', 'INFO'].includes(raw)) return { type: 'info', tag: m[0] };
                    if (['TIP', 'SUCCESS'].includes(raw)) return { type: 'success', tag: m[0] };
                    if (['WARNING', 'IMPORTANT'].includes(raw)) return { type: 'warning', tag: m[0] };
                    return { type: 'error', tag: m[0] };
                  }
                  if (node.trim()) return null;
                } else if (React.isValidElement(node)) {
                  const subNodes = React.Children.toArray((node.props as any).children);
                  const res = findAlert(subNodes);
                  if (res) return res;
                }
              }
              return null;
            };

            const alert = findAlert(childrenArray);
            if (alert) {
              const { type, tag } = alert;
              const styles: Record<CalloutType, any> = {
                info: { bg: "bg-blue-50/50 dark:bg-blue-500/10", border: "border-blue-400/50", text: "text-blue-900 dark:text-blue-100", icon: AlertCircle, accent: "text-blue-500" },
                warning: { bg: "bg-amber-50/50 dark:bg-amber-500/10", border: "border-amber-400/50", text: "text-amber-900 dark:text-amber-100", icon: AlertTriangle, accent: "text-amber-500" },
                success: { bg: "bg-emerald-50/50 dark:bg-emerald-600/10", border: "border-emerald-400/50", text: "text-emerald-900 dark:text-emerald-100", icon: CheckCircle, accent: "text-emerald-500" },
                error: { bg: "bg-red-50/50 dark:bg-red-600/10", border: "border-red-400/50", text: "text-red-900 dark:text-red-100", icon: XCircle, accent: "text-red-500" }
              };
              const s = styles[type];
              const Icon = s.icon;
              const clean = (nodes: any[]): any[] => nodes.map(n => {
                if (typeof n === 'string') return n.replace(tag, '').trimStart();
                if (React.isValidElement(n) && (n.props as any).children) return React.cloneElement(n as any, { children: clean(React.Children.toArray((n.props as any).children)) });
                return n;
              });

              return (
                <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className={`my-8 p-5 rounded-none border-l-4 shadow-sm ${s.bg} ${s.border} ${s.text}`}>
                  <div className="flex items-start gap-4">
                    <Icon className={`w-6 h-6 shrink-0 mt-1 ${s.accent}`} />
                    <div className="flex-1 prose-p:my-0">{clean(childrenArray)}</div>
                  </div>
                </motion.div>
              );
            }

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
              <motion.blockquote variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="my-8 pl-6 py-3 text-foreground/60 italic bg-custom/5 border-l-2 border-custom/20">
                {quoteContent}
                {author && <cite className="block mt-2 text-right text-sm font-medium text-foreground/50 not-italic">— {author}</cite>}
              </motion.blockquote>
            );
          },
          a: ({ children, href, ...props }) => (
            <a href={href} className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined} {...props}>
              {children}
              {href?.startsWith("http") && <ExternalLink className="h-3 w-3 opacity-70" />}
            </a>
          ),
          li: ({ children, ...props }) => (
            <li className="text-foreground/70 leading-relaxed flex items-start gap-3 my-2" {...props}>
              <div className="w-1 h-1 bg-primary/40 rounded-full mt-2.5 flex-shrink-0"></div>
              <span>{children}</span>
            </li>
          ),
          img: ({ src, alt }: any) => {
            if (!src) return null;
            return (
              <span className="block my-6">
                <ImagePreview src={src} alt={alt || ""}>
                  <img
                    src={src}
                    alt={alt || ""}
                    className="w-full h-auto rounded-none shadow-lg cursor-zoom-in"
                  />
                </ImagePreview>
                {alt && <span className="block text-center text-sm text-muted-foreground mt-3 italic">{alt}</span>}
              </span>
            );
          },
          details: ({ children, ...props }) => <details className="my-6" {...props}>{children}</details>,
          summary: ({ children, ...props }) => <summary className="cursor-pointer font-medium text-foreground/80 hover:text-foreground" {...props}>{children}</summary>,
          mark: ({ children, ...props }) => <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props}>{children}</mark>,
          table: ({ children, ...props }) => <div className="my-8 rounded overflow-x-auto"><table className="min-w-full" {...props}>{children}</table></div>,
          thead: ({ children, ...props }) => <thead className="bg-muted/50" {...props}>{children}</thead>,
          tbody: ({ children, ...props }) => <tbody className="bg-background" {...props}>{children}</tbody>,
          tr: ({ children, ...props }) => <tr className="hover:bg-muted/25 transition-colors" {...props}>{children}</tr>,
          th: ({ children, ...props }) => <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props}>{children}</th>,
          td: ({ children, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" {...props}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
