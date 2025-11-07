'use client';

import React, { useState } from 'react';
import { CommentsToggle } from './CommentSystem';
import { Article } from '@/data/blog-data';

interface ClientCommentSectionProps {
  article: Article;
}

export function ClientCommentSection({ article }: ClientCommentSectionProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <CommentsToggle
      article={article}
      showComments={showComments}
      onToggle={() => setShowComments(!showComments)}
    />
  );
}