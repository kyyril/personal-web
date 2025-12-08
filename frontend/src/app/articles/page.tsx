import React from "react";
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
  title: "Articles | Software Engineering Insights",
  description: SEO_DESCRIPTION.articles,
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
    title: "Articles | Software Engineering Insights",
    description: SEO_DESCRIPTION.articles,
    path: "/articles",
    type: "website",
  }),
  twitter: generateTwitter({
    title: "Articles | Software Engineering Insights",
    description: SEO_DESCRIPTION.articles,
  }),
  // Key fix: Proper canonical with language alternates
  alternates: generateAlternates("/articles"),
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

function ArticlesList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-70" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p>Try adjusting your search criteria or clearing the filters.</p>
          <Link
            href="/articles"
            className="text-primary hover:underline mt-2 inline-block"
          >
            View all articles →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((post) => (
        <Card
          key={post.slug}
          className="h-full hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link
                href={`/articles/category/${encodeURIComponent(
                  post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
                )}`}
              >
                <span className="cursor-pointer hover:bg-secondary rounded font-semibold">
                  / {post.frontmatter.category}
                </span>
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
              <Link href={`/articles/${post.slug}`}>
                {post.frontmatter.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {post.frontmatter.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.frontmatter.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.frontmatter.readTime}
              </span>
            </div>

            {/* Tags */}
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {post.frontmatter.tags.slice(0, 3).map((tag, index) => (
                  <Link
                    key={`${tag}-${index}`}
                    href={`/articles/tags/${encodeURIComponent(
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
                {post.frontmatter.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{post.frontmatter.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="mt-4 w-full flex">
              <Link
                href={`/articles/${post.slug}`}
                className="flex justify-end text-primary hover:underline font-medium"
              >
                Read more →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ArticlesPage() {
  const allArticles = getAllArticles();
  const categories = getAllCategories();

  // Enhanced JSON-LD structured data
  const blogData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Khairil Rahman Hakiki Blog",
    description: SEO_DESCRIPTION.articles,
    url: `${siteUrl}/articles`,
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
      url: `${siteUrl}/articles/${article.slug}`,
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
          name: "Articles",
          item: `${siteUrl}/articles`,
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
          items={[{ label: "Home", href: "/" }, { label: "Articles" }]}
          className="mb-8"
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Articles</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and best practices in modern software
            engineer.
          </p>
        </div>

        {/* Client-side Filter Component */}
        <ClientFilterWrapper
          allArticles={allArticles}
          categories={categories}
        />

        {/* Quick Category Links */}
        <div className="my-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Quick Category Links
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/articles">
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
                href={`/articles/category/${encodeURIComponent(category.slug)}`}
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
        </div>
      </div>
    </>
  );
}
