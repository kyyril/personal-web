import React from "react";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getRelatedArticles,
  getAllArticles,
} from "@/data/blog-data";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl } from "@/lib/metadata";
import { generateAlternates, generateArticleSchema } from "@/lib/seo";
import { ArticleClient } from "@/components/blog/ArticleClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all articles at build time
 * This enables static generation for better performance
 */
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Generate dynamic metadata for article pages
 * Implements proper canonical URLs to prevent duplicate content issues
 */
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

  const articleUrl = `/blog/${post.slug}`;

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
      url: `${siteUrl}${articleUrl}`,
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
      site: "@kyyril_dev",
      creator: "@kyyril_dev",
      title: `${post.frontmatter.title} | Khairil Rahman Hakiki Blog`,
      description: post.frontmatter.description,
      images: [post.frontmatter.coverImage || `${siteUrl}/assets/profile.webp`],
    },
    // Key fix: Proper canonical URL with language alternates
    alternates: generateAlternates(articleUrl),
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedArticles(post, 3);

  // Generate article structured data for rich results
  const articleSchema = generateArticleSchema({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    slug: post.slug,
    author: post.frontmatter.author,
    datePublished: post.frontmatter.date,
    category: post.frontmatter.category,
    tags: post.frontmatter.tags,
    wordCount: post.content.split(/\s+/).length,
    readTime: post.frontmatter.readTime,
    coverImage: post.frontmatter.coverImage,
  });

  return (
    <>
      {/* Article Structured Data for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <ArticleClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
