import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/data/blog-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, User, Tag, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl } from "@/lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "@/lib/seo";
import Script from "next/script";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArticleCard } from "@/components/blog/ArticleCard";

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  const tagSet = new Set<string>();
  articles.forEach((article) => {
    article.frontmatter.tags.forEach((tag) => {
      tagSet.add(tag.toLowerCase().replace(/\s+/g, "-"));
    });
  });
  return Array.from(tagSet).map((tag) => ({
    tag,
  }));
}

/**
 * Generate dynamic metadata for tag pages
 * Implements proper canonical URLs to prevent duplicate content issues
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const articles = getAllArticles();
  const tagArticles = articles.filter((article) =>
    article.frontmatter.tags.some(
      (t) => t.toLowerCase().replace(/\s+/g, "-") === tag
    )
  );

  if (tagArticles.length === 0) {
    return {
      title: "Tag Not Found",
      description: "The requested tag could not be found.",
    };
  }

  const tagName =
    tagArticles[0].frontmatter.tags.find(
      (t) => t.toLowerCase().replace(/\s+/g, "-") === tag
    ) || tag;

  /* Metadata Update */
  const tagUrl = `/blog/tags/${tag}`;
  const title = `${tagName} - Blog | Khairil Rahman Hakiki`;
  const description = `Browse all blog posts tagged with ${tagName.toLowerCase()}. Find the latest insights and best practices. (${tagArticles.length} post${tagArticles.length !== 1 ? "s" : ""})`;

  return {
    title,
    description,
    keywords: [...PERSONAL_KEYWORDS, tagName, "blog", "tutorials", tagName.toLowerCase()],
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
      path: tagUrl,
      type: "website",
    }),
    twitter: generateTwitter({
      title,
      description,
    }),
    // Key fix: Proper canonical with language alternates
    alternates: generateAlternates(tagUrl),
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

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const allArticles = getAllArticles();
  const articles = allArticles.filter((article) =>
    article.frontmatter.tags.some(
      (t) => t.toLowerCase().replace(/\s+/g, "-") === tag
    )
  );

  if (articles.length === 0) {
    notFound();
  }

  const tagName =
    articles[0].frontmatter.tags.find(
      (t) => t.toLowerCase().replace(/\s+/g, "-") === tag
    ) || tag;
  const tagData = { name: tagName, slug: tag, count: articles.length };

  // Enhanced JSON-LD structured data for tag page
  const tagStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tagData.name} Blog Posts`,
    description: `Blog posts tagged with ${tagData.name}`,
    url: `${siteUrl}/blog/tags/${tag}`,
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
          name: tagData.name,
          item: `${siteUrl}/blog/tags/${tag}`,
        },
      ],
    },
  };

  return (
    <>
      {/* Structured Data Script */}
      <Script
        id="tag-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tagStructuredData, null, 2),
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
                  { label: tagData.name },
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

        {/* Tag Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {tagData.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Blog posts tagged with {tagData.name.toLowerCase()} (
                {tagData.count} post
                {tagData.count !== 1 ? "s" : ""})
              </p>
            </div>
          </div>

          {/* All Tags Navigation */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              All Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allArticles
                .reduce((acc, article) => {
                  article.frontmatter.tags.forEach((t) => {
                    const slug = t.toLowerCase().replace(/\s+/g, "-");
                    const existing = acc.find((tag) => tag.slug === slug);
                    if (existing) {
                      existing.count++;
                    } else {
                      acc.push({ name: t, slug, count: 1 });
                    }
                  });
                  return acc;
                }, [] as { name: string; slug: string; count: number }[])
                .map((t) => (
                  <Link
                    key={t.slug}
                    href={`/blog/tags/${encodeURIComponent(t.slug)}`}
                  >
                    <Badge
                      variant={t.slug === tag ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {t.name} ({t.count})
                    </Badge>
                  </Link>
                ))}
            </div>
          </div>
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
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-70" />
              <h3 className="text-lg font-semibold mb-2">
                No articles with this tag yet
              </h3>
              <p>
                Check back soon for new {tagData.name.toLowerCase()} content!
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Tag className="h-4 w-4" />
                Browse All Posts
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
