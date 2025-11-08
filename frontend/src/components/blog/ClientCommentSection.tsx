"use client";

import React, { useState, useEffect } from "react";
import { CommentsToggle } from "./CommentSystem";
import { Article } from "@/data/blog-data";

interface ClientCommentSectionProps {
  article: Article;
}

export function ClientCommentSection({ article }: ClientCommentSectionProps) {
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      if (progress >= 80 && !showComments) {
        setShowComments(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showComments]);

  return <CommentsToggle article={article} showComments={showComments} />;
}
