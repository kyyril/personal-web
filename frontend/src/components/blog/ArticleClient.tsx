"use client";

import React, { useRef, useState, Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ClientCommentSection } from "@/components/blog/ClientCommentSection";
import { LazyMDXRenderer, MDXRendererSkeleton } from "@/components/blog/MDXRendererLazy";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { siteUrl } from "@/lib/metadata";

interface ArticleClientProps {
  post: any;
  relatedPosts: any[];
}

export function ArticleClient({ post, relatedPosts }: ArticleClientProps) {
  const router = useRouter();
  const commentsSectionRef = useRef<HTMLElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: post.frontmatter.title,
            text: post.frontmatter.description,
            url: window.location.href,
          });
        } catch (err) {
          // User cancelled or share failed
          console.debug("Share cancelled or failed:", err);
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      }
    }
  };

  // Enhanced JSON-LD structured data for article
  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: post.frontmatter.author,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Khairil Rahman Hakiki",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    image: {
      "@type": "ImageObject",
      url:
        post.frontmatter.coverImage ||
        `${siteUrl}/assets/profile.webp`,
      width: 1200,
      height: 630,
      alt: post.frontmatter.title,
    },
    articleSection: post.frontmatter.category,
    keywords: post.frontmatter.tags.join(", "),
    wordCount: post.content.length,
    timeRequired: `PT${post.frontmatter.readTime.split(" ")[0]}M`,
    about: post.frontmatter.tags.map((tag: string) => ({
      "@type": "Thing",
      name: tag,
    })),
    mentions: relatedPosts.map((relatedPost) => ({
      "@type": "BlogPosting",
      headline: relatedPost.frontmatter.title,
      url: `${siteUrl}/blog/${relatedPost.slug}`,
      datePublished: relatedPost.frontmatter.date,
    })),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteUrl}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.frontmatter.category,
          item: `${siteUrl}/blog/category/${encodeURIComponent(
            post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
          )}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: post.frontmatter.title,
          item: `${siteUrl}/blog/${post.slug}`,
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
      <ReadingProgressBar targetRef={commentsSectionRef} />

      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Breadcrumb
                items={[
                  { label: "Blog", href: "/blog" },
                  { label: post.frontmatter.title },
                ]}
              />
            </div>

            <button
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/blog");
                }
              }}
              className="hidden sm:inline-flex group items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex-shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout with TOC */}
      <div className="container mx-auto px-4 max-w-7xl pt-8 sm:pt-12">
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
                  {post.frontmatter.tags
                    .slice(0, 3)
                    .map((tag: string, index: number) => (
                      <Link
                        key={`${tag}-${index}`}
                        href={`/blog/tags/${encodeURIComponent(
                          tag.toLowerCase().replace(/\s+/g, "-")
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
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    aria-label="Share this article"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="hidden sm:inline text-green-500 font-medium">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Share</span>
                      </>
                    )}
                  </button>
                </div>
              </header>

              {/* Article Content */}
              <Suspense fallback={<MDXRendererSkeleton />}>
                <LazyMDXRenderer content={post.content} />
              </Suspense>
            </article>

            {/* Comments Section */}
            <section ref={commentsSectionRef} data-comments-section>
              <ClientCommentSection article={post} />
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-8 lg:mb-12 mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 lg:mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                  Related Posts
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
                            href={`/blog/category/${encodeURIComponent(
                              relatedPost.frontmatter.category
                                .toLowerCase()
                                .replace(/\s+/g, "-")
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
                          <Link href={`/blog/${relatedPost.slug}`}>
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
                            .map((tag: string, index: number) => (
                              <Link
                                key={`${tag}-${index}`}
                                href={`/blog/tags/${encodeURIComponent(
                                  tag.toLowerCase().replace(/\s+/g, "-")
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
            <section className="text-center py-8 lg:py-12 bg-secondary/5 rounded-lg mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                Enjoyed this article?
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Follow me for more insights on web development and modern
                frontend technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
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
