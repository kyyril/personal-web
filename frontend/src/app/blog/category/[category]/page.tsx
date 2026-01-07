import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getArticlesByCategory } from "@/data/blog-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, User, Folder, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl } from "@/lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "@/lib/seo";
import Script from "next/script";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

/**
 * Generate dynamic metadata for category pages
 * Implements proper canonical URLs to prevent duplicate content issues
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = getAllCategories();
  const categoryData = categories.find((cat) => cat.slug === category);

  if (!categoryData) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  /* Metadata Update */
  const categoryUrl = `/blog/category/${category}`;
  const title = `${categoryData.name} - Blog | Khairil Rahman Hakiki`;
  const description = `Browse all ${categoryData.name.toLowerCase()} blog posts and tutorials. ${categoryData.description} Find the latest insights and best practices.`;

  return {
    title,
    description,
    keywords: [
      ...PERSONAL_KEYWORDS,
      categoryData.name,
      "blog",
      "tutorials",
      categoryData.name.toLowerCase(),
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
      title,
      description,
      path: categoryUrl,
      type: "website",
    }),
    twitter: generateTwitter({
      title,
      description,
    }),
    // Key fix: Proper canonical with language alternates
    alternates: generateAlternates(categoryUrl),
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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categories = getAllCategories();
  const categoryData = categories.find((cat) => cat.slug === category);

  if (!categoryData) {
    notFound();
  }

  const articles = getArticlesByCategory(category);
  const categoryTags = articles.reduce((acc, article) => {
    article.frontmatter.tags.forEach((tag) => {
      const existing = acc.find((t) => t.name === tag);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          name: tag,
          slug: tag.toLowerCase().replace(/\s+/g, "-"),
          count: 1,
        });
      }
    });
    return acc;
  }, [] as { name: string; slug: string; count: number }[]);

  // Enhanced JSON-LD structured data for category page
  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryData.name} Blog Posts`,
    description: `${categoryData.description}`,
    url: `${siteUrl}/blog/category/${category}`,
    mainEntity: {
      "@type": "Blog",
      blogPost: articles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.frontmatter.title,
        description: article.frontmatter.description,
        url: `${siteUrl}/blog/${article.slug}`,
        datePublished: article.frontmatter.date,
        author: {
          "@type": "Person",
          name: article.frontmatter.author,
        },
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
    },
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
          name: categoryData.name,
          item: `${siteUrl}/blog/category/${category}`,
        },
      ],
    },
  };

  return (
    <>
      {/* Structured Data Script */}
      <Script
        id="category-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryStructuredData, null, 2),
        }}
      />

      {/* Sticky Navigation Bar */}
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 py-3 max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: categoryData.name },
                ]}
              />
            </div>

            <Link
              href="/blog"
              className="hidden sm:inline-flex group items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex-shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Blog</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 sm:pt-12 max-w-6xl">

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {categoryData.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {categoryData.description} ({categoryData.count} article
                {categoryData.count !== 1 ? "s" : ""})
              </p>
            </div>
          </div>

          {/* All Categories Navigation */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              All Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${encodeURIComponent(cat.slug)}`}
                >
                  <Badge
                    variant={cat.slug === category ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    {cat.name} ({cat.count})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags in this Category */}
          {categoryTags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Tags in {categoryData.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tags/${encodeURIComponent(tag.slug)}`}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} post={article} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-70" />
              <h3 className="text-lg font-semibold mb-2">
                No articles in this category yet
              </h3>
              <p>
                Check back soon for new {categoryData.name.toLowerCase()}{" "}
                content!
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Folder className="h-4 w-4" />
                Browse All Posts
              </Link>
            </div>
          </div>
        )}
      </div >
    </>
  );
}
