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
    keywords: post.frontmatter.tags.join(", "),
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
      url: `https://kyyril.pages.dev/articles/${post.slug}`,
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
          url: post.frontmatter.coverImage || "/assets/profile.webp",
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
      images: [post.frontmatter.coverImage || "/assets/profile.webp"],
    },
    alternates: {
      canonical: `https://kyyril.pages.dev/articles/${post.slug}`,
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedArticles(post, 3);

  // Enhanced JSON-LD structured data for article
  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url: `https://kyyril.pages.dev/articles/${post.slug}`,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author,
      url: "https://kyyril.pages.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Khairil Rahman Hakiki",
      url: "https://kyyril.pages.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kyyril.pages.dev/articles/${post.slug}`,
    },
    image: {
      "@type": "ImageObject",
      url:
        post.frontmatter.coverImage ||
        "https://kyyril.pages.dev/assets/profile.webp",
      width: 1200,
      height: 630,
      alt: post.frontmatter.title,
    },
    articleSection: post.frontmatter.category,
    keywords: post.frontmatter.tags.join(", "),
    wordCount: post.content.length,
    timeRequired: `PT${post.frontmatter.readTime.split(" ")[0]}M`,
    about: post.frontmatter.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
    mentions: relatedPosts.map((relatedPost) => ({
      "@type": "BlogPosting",
      headline: relatedPost.frontmatter.title,
      url: `https://kyyril.pages.dev/articles/${relatedPost.slug}`,
      datePublished: relatedPost.frontmatter.date,
    })),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kyyril.pages.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: "https://kyyril.pages.dev/articles",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.frontmatter.category,
          item: `https://kyyril.pages.dev/articles/category/${encodeURIComponent(
            post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
          )}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: post.frontmatter.title,
          item: `https://kyyril.pages.dev/articles/${post.slug}`,
        },
      ],
    },
  };

  return (
    <div>
      {/* Structured Data Script */}
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleData, null, 2),
        }}
      />

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Breadcrumb Navigation and Back Button */}
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Articles", href: "/articles" },
              {
                label: post.frontmatter.category,
                href: `/articles/category/${encodeURIComponent(
                  post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
                )}`,
              },
              { label: post.frontmatter.title },
            ]}
            className="order-2 sm:order-1"
          />

          {/* Back Button */}
          <div className="order-1 sm:order-2">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Articles</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Layout with TOC */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Table of Contents Sidebar - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-16">
              <TableOfContents content={post.content} />
            </div>
          </div>

          {/* Main Article Content */}
          <div className="lg:col-span-3">
            {/* Mobile TOC - Always visible on mobile */}
            <div className="block lg:hidden mb-6">
              <TableOfContents content={post.content} isMobile={true} />
            </div>
            <article className="mb-8 lg:mb-12">
              {/* Article Header */}
              <header className="mb-6 lg:mb-8">
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-4">
                  <span className="font-bold">#</span>
                  {post.frontmatter.tags.slice(0, 3).map((tag, index) => (
                    <Link
                      key={`${tag}-${index}`}
                      href={`/articles/tags/${encodeURIComponent(
                        tag.toLowerCase().replace(/s+/g, "-")
                      )}`}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-secondary"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {post.frontmatter.title}
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-6 leading-relaxed">
                  {post.frontmatter.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{post.frontmatter.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 flex-shrink-0" />
                    <time
                      dateTime={post.frontmatter.date}
                      className="whitespace-nowrap"
                    >
                      {format(new Date(post.frontmatter.date), "MMM dd, yyyy")}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {post.frontmatter.readTime}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </header>

              {/* Article Content */}
              <MDXRenderer content={post.content} />
            </article>

            {/* Comments Section */}
            <ClientCommentSection article={post} />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-8 lg:mb-12 mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 lg:mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card
                      key={relatedPost.slug}
                      className="hover:shadow-lg transition-shadow h-full"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Link
                            href={`/articles/category/${encodeURIComponent(
                              relatedPost.frontmatter.category
                                .toLowerCase()
                                .replace(/s+/g, "-")
                            )}`}
                          >
                            <span className="cursor-pointer hover:bg-secondary rounded font-semibold">
                              / {relatedPost.frontmatter.category}
                            </span>
                          </Link>
                          <span>•</span>
                          <span className="truncate">
                            {format(
                              new Date(relatedPost.frontmatter.date),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <CardTitle className="text-base lg:text-lg line-clamp-2 hover:text-primary transition-colors leading-tight">
                          <Link href={`/articles/${relatedPost.slug}`}>
                            {relatedPost.frontmatter.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {relatedPost.frontmatter.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {relatedPost.frontmatter.tags
                            .slice(0, 2)
                            .map((tag, index) => (
                              <Link
                                key={`${tag}-${index}`}
                                href={`/articles/tags/${encodeURIComponent(
                                  tag.toLowerCase().replace(/s+/g, "-")
                                )}`}
                              >
                                <Badge
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-secondary/50"
                                >
                                  {tag}
                                </Badge>
                              </Link>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Call to Action */}
            <section className="text-center py-8 lg:py-12 border-t border-border">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Enjoyed this article?
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Follow me for more insights on web development and modern
                frontend technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground roundedmd hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  <BookOpen className="h-4 w-4" />
                  Read More
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
