"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Article } from "@/data/blog-data";
import { ArticleFilter, SearchResultsCount } from "./ArticleFilter";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, User, Folder } from "lucide-react";

interface ClientFilterWrapperProps {
  allArticles: Article[];
  categories: { name: string; slug: string; count: number }[];
}

export function ClientFilterWrapper({
  allArticles,
  categories,
}: ClientFilterWrapperProps) {
  const [filteredArticles, setFilteredArticles] = useState(allArticles);

  // Extract all unique tags from articles
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allArticles.forEach((article) => {
      article.frontmatter.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allArticles]);

  const isFiltered = filteredArticles.length !== allArticles.length;

  // Articles List Component
  function ArticlesList({ articles }: { articles: Article[] }) {
    if (articles.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                <span className="cursor-pointer hover:bg-secondary rounded font-semibold">
                  / {post.frontmatter.category}
                </span>
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
                  {post.frontmatter.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
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
                  {post.frontmatter.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.frontmatter.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="mt-4">
                <Link
                  href={`/articles/${post.slug}`}
                  className="text-primary hover:underline font-medium"
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

  return (
    <>
      {/* Article Filter Component */}
      <ArticleFilter
        articles={allArticles}
        onFilteredArticles={setFilteredArticles}
        allTags={allTags}
        allCategories={categories}
      />

      {/* Search Results Count */}
      <SearchResultsCount
        total={allArticles.length}
        filtered={filteredArticles.length}
        isFiltered={isFiltered}
      />

      {/* Articles Grid */}
      <ArticlesList articles={filteredArticles} />
    </>
  );
}
