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
import Script from "next/script";
import { Breadcrumb } from "@/components/Breadcrumb";

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

  return {
    title: `${categoryData.name} Articles | Khairil Rahman Hakiki Blog`,
    description: `Browse all ${categoryData.name.toLowerCase()} articles and tutorials. ${categoryData.description
      } Find the latest insights and best practices.`,
    keywords: [
      ...PERSONAL_KEYWORDS,
      categoryData.name,
      "articles",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${siteUrl}/articles/category/${category}`,
      title: `${categoryData.name} Articles | Khairil Rahman Hakiki Blog`,
      description: `Browse all ${categoryData.name.toLowerCase()} articles and tutorials. ${categoryData.description
        } Find the latest insights and best practices.`,
      siteName: "Khairil Rahman Hakiki Blog",
      images: [
        {
          url: `${siteUrl}/assets/profile.webp`,
          width: 1200,
          height: 630,
          alt: `${categoryData.name} Articles`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@khairilrahmanhakiki",
      creator: "@khairilrahmanhakiki",
      title: `${categoryData.name} Articles | Khairil Rahman Hakiki Blog`,
      description: `Browse all ${categoryData.name.toLowerCase()} articles and tutorials. ${categoryData.description
        }`,
      images: [`${siteUrl}/assets/profile.webp`],
    },
    alternates: {
      canonical: `${siteUrl}/articles/category/${category}`,
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
          slug: tag.toLowerCase().replace(/s+/g, "-"),
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
    name: `${categoryData.name} Articles`,
    description: `${categoryData.description}`,
    url: `${siteUrl}/articles/category/${category}`,
    mainEntity: {
      "@type": "Blog",
      blogPost: articles.map((article) => ({
        "@type": "BlogPosting",
        headline: article.frontmatter.title,
        description: article.frontmatter.description,
        url: `${siteUrl}/articles/${article.slug}`,
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
          name: "Articles",
          item: `${siteUrl}/articles`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryData.name,
          item: `${siteUrl}/articles/category/${category}`,
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/articles" },
            { label: categoryData.name },
          ]}
          className="mb-8"
        />

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>

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
                  href={`/articles/category/${encodeURIComponent(cat.slug)}`}
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
                    href={`/articles/tags/${encodeURIComponent(tag.slug)}`}
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
              <Card
                key={article.slug}
                className="h-full hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Link
                      href={`/articles/category/${encodeURIComponent(
                        article.frontmatter.category
                          .toLowerCase()
                          .replace(/s+/g, "-")
                      )}`}
                    >
                      <span className="cursor-pointer hover:bg-secondary rounded font-semibold">
                        / {article.frontmatter.category}
                      </span>
                    </Link>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(article.frontmatter.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/articles/${article.slug}`}>
                      {article.frontmatter.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.frontmatter.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.frontmatter.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.frontmatter.readTime}
                    </span>
                  </div>

                  {/* Tags */}
                  {article.frontmatter.tags &&
                    article.frontmatter.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {article.frontmatter.tags
                          .slice(0, 3)
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
                        {article.frontmatter.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.frontmatter.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                  <div className="mt-4">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
                href="/articles"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Folder className="h-4 w-4" />
                Browse All Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
