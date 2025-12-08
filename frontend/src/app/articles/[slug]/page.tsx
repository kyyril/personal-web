import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getAllArticles,
  getRelatedArticles,
} from "@/data/blog-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl } from "@/lib/metadata";
import Script from "next/script";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ClientCommentSection } from "@/components/blog/ClientCommentSection";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getArticleBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${post.frontmatter.title} | Khairil Rahman Hakiki Blog`,
    description: post.frontmatter.description,
    keywords: [...PERSONAL_KEYWORDS, ...post.frontmatter.tags],
    authors: [{ name: post.frontmatter.author }],
    creator: "Khairil Rahman Hakiki",
    publisher: "Khairil Rahman Hakiki",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `${siteUrl}/articles/${post.slug}`,
      title: `${post.frontmatter.title} | Khairil Rahman Hakiki Blog`,
      description: post.frontmatter.description,
      siteName: "Khairil Rahman Hakiki Blog",
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      section: post.frontmatter.category,
      tags: post.frontmatter.tags,
      images: [
        {
          url: post.frontmatter.coverImage || `${siteUrl}/assets/profile.webp`,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kilocode",
      creator: "@kilocode",
      title: `${post.frontmatter.title} | Khairil Rahman Hakiki Blog`,
      description: post.frontmatter.description,
      images: [post.frontmatter.coverImage || `${siteUrl}/assets/profile.webp`],
    },
    alternates: {
      canonical: `${siteUrl}/articles/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

import { ArticleClient } from "@/components/blog/ArticleClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedArticles(post, 3);

  return <ArticleClient post={post} relatedPosts={relatedPosts} />;
}
