import React, { Suspense } from "react";
import Link from "next/link";
import { getAllArticles, getAllCategories } from "@/data/blog-data";
import { ClientFilterWrapper } from "@/components/blog/ClientFilterWrapper";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, User, Folder } from "lucide-react";
import { Article } from "@/data/blog-data";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "@/lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "@/lib/seo";
import Script from "next/script";
import { Breadcrumb } from "@/components/Breadcrumb";

/**
 * Articles page metadata with proper canonical URL
 * Helps prevent "Alternate page with proper canonical tag" issues
 */
export const metadata: Metadata = {
  title: "Blog | Software Engineering Insights",
  description: SEO_DESCRIPTION.blog,
  keywords: [
    ...PERSONAL_KEYWORDS,
    "software engineer",
    "tutorials",
    "best practices",
    "development insights",
    "programming blog",
    "web development articles",
  ],
  authors: [{ name: "Khairil Rahman Hakiki" }],
  creator: "Khairil Rahman Hakiki",
  publisher: "Khairil Rahman Hakiki",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: generateOpenGraph({
    title: "Blog | Software Engineering Insights",
    description: SEO_DESCRIPTION.blog,
    path: "/blog",
    type: "website",
  }),
  twitter: generateTwitter({
    title: "Blog | Software Engineering Insights",
    description: SEO_DESCRIPTION.blog,
  }),
  // Key fix: Proper canonical with language alternates
  alternates: generateAlternates("/blog"),
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



export default function BlogPage() {
  const allArticles = getAllArticles();
  const categories = getAllCategories();

  // Enhanced JSON-LD structured data
  const blogData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Khairil Rahman Hakiki Blog",
    description: SEO_DESCRIPTION.blog,
    url: `${siteUrl}/blog`,
    author: {
      "@type": "Person",
      name: "Khairil Rahman Hakiki",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Khairil Rahman Hakiki",
      url: siteUrl,
    },
    blogPost: allArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.frontmatter.title,
      description: article.frontmatter.description,
      url: `${siteUrl}/blog/${article.slug}`,
      author: {
        "@type": "Person",
        name: article.frontmatter.author,
      },
      datePublished: article.frontmatter.date,
      dateModified: article.frontmatter.date,
      articleSection: article.frontmatter.category,
      keywords: article.frontmatter.tags.join(", "),
      wordCount: article.content.length,
      timeRequired: `PT${article.frontmatter.readTime.split(" ")[0]}M`,
      image: {
        "@type": "ImageObject",
        url:
          article.frontmatter.coverImage ||
          `${siteUrl}/assets/profile.webp`,
        width: 1200,
        height: 630,
        alt: article.frontmatter.title,
      },
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
      ],
    },
  };

  return (
    <>
      {/* Structured Data Script */}
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogData, null, 2),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
          className="mb-8"
        />

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover insights, tutorials, and best practices in modern software
            engineer.
          </p>
        </div>

        {/* Categories Section */}
        <section aria-labelledby="categories-heading" className="mb-12">
          <h2 id="categories-heading" className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
            <Folder className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Browse Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" aria-label={`View all posts, ${allArticles.length} available`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary"
              >
                All ({allArticles.length})
              </Badge>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${encodeURIComponent(category.slug)}`}
                aria-label={`View posts in ${category.name}, ${category.count} available`}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary"
                >
                  {category.name} ({category.count})
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* Client-side Filter & Articles List Section */}
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="sr-only">All Articles</h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            }
          >
            <ClientFilterWrapper
              allArticles={allArticles}
              categories={categories}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
}
