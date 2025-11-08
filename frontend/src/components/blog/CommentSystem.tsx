"use client";

import React, { useEffect, useRef } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { Article } from "@/data/blog-data";

interface CommentSystemProps {
  article: Article;
  className?: string;
}

export function CommentSystem({ article, className = "" }: CommentSystemProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme to use
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  // Giscus configuration
  const giscusConfig = {
    repo: (process.env.NEXT_PUBLIC_GISCUS_REPO ||
      "your-username/your-repo") as `${string}/${string}`,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
    mapping: "pathname" as const,
    reactionsEnabled: "1" as any,
    emitMetadata: "0" as any,
    inputPosition: "top" as const,
    theme: effectiveTheme === "dark" ? "dark" : "light",
    lang: "en",
    loading: "lazy" as const,
  };

  if (!mounted) {
    return (
      <div
        className={`border rounded-lg p-4 text-center text-muted-foreground ${className}`}
      >
        <div className="animate-pulse">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className={`mt-8 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 13V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8l4-4h12a2 2 0 0 0 2-2z" />
        </svg>
        Comments
      </h3>

      <Giscus {...giscusConfig} />

      {/* Comment Guidelines */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
        <h4 className="font-medium mb-2">Comment Guidelines:</h4>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            Sign in with your GitHub account to participate in discussions
          </li>
          <li>Be respectful and constructive in your feedback</li>
          <li>Stay on topic and help improve the content</li>
          <li>Support questions and clarifications are welcome</li>
        </ul>
      </div>
    </div>
  );
}

// Alternative Utterances component (backup system)
interface UtterancesConfig {
  repo: string;
  issueTerm: string;
  theme: string;
  crossorigin: string;
  async: boolean;
}

export function UtterancesCommentSystem({ article }: { article: Article }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ref.current) {
      // Clear previous comments
      ref.current.innerHTML = "";

      const effectiveTheme = theme === "system" ? systemTheme : theme;

      const config: UtterancesConfig = {
        repo:
          process.env.NEXT_PUBLIC_UTTERANCES_REPO || "your-username/your-repo",
        issueTerm: `article-${article.slug}`,
        theme: effectiveTheme === "dark" ? "github-dark" : "github-light",
        crossorigin: "anonymous",
        async: true,
      };

      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", config.repo);
      script.setAttribute("issue-term", config.issueTerm);
      script.setAttribute("theme", config.theme);
      script.setAttribute("crossorigin", config.crossorigin);
      script.async = config.async;

      ref.current.appendChild(script);
    }
  }, [mounted, article.slug, theme, systemTheme]);

  if (!mounted) {
    return (
      <div className="mt-8 border rounded-lg p-4 text-center text-muted-foreground">
        <div className="animate-pulse">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments (Utterances)</h3>
      <div ref={ref} className="utterances" />
    </div>
  );
}

// Comments Toggle Component
export function CommentsToggle({
  article,
  showComments,
  onToggle,
  className = "",
}: {
  article: Article;
  showComments: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div className={`mt-8 ${className}`}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 my-8 text-primary hover:text-primary/80 font-medium"
      >
        {showComments ? "Hide Comments" : "Show Comments"} ({article.slug})
        <svg
          className={`h-4 w-4 transition-transform ${
            showComments ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showComments && (
        <div className="mt-6">
          <CommentSystem article={article} />
        </div>
      )}
    </div>
  );
}
