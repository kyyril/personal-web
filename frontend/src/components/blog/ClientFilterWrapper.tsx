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
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
            <p>Try adjusting your search criteria or clearing the filters.</p>
            <Link
              href="/blog"
              className="text-primary hover:underline mt-2 inline-block"
            >
              View all posts →
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
            className="flex flex-col h-full hover:shadow-lg transition-shadow border-muted/40"
          >
            <CardHeader className="flex-none pb-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                <Link
                  href={`/blog/category/${encodeURIComponent(
                    post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  aria-label={`Category: ${post.frontmatter.category}`}
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
                >
                  <Folder className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{post.frontmatter.category}</span>
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" aria-hidden="true" />
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <CardTitle className="line-clamp-2 text-foreground hover:text-primary transition-colors mb-2 text-lg sm:text-xl font-bold tracking-tight leading-tight min-h-[3.5rem] flex items-center">
                <Link href={`/blog/${post.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed min-h-[4.5rem]">
                {post.frontmatter.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" aria-hidden="true" />
                  {post.frontmatter.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {post.frontmatter.readTime}
                </span>
              </div>

              {/* Tags */}
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.frontmatter.tags.slice(0, 3).map((tag, index) => (
                    <Link
                      key={`${tag}-${index}`}
                      href={`/blog/tags/${encodeURIComponent(
                        tag.toLowerCase().replace(/\s+/g, "-")
                      )}`}
                      aria-label={`Tag: ${tag}`}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs cursor-pointer hover:bg-secondary/50 rounded-md"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                  {post.frontmatter.tags.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs rounded-md">
                      +{post.frontmatter.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="mt-auto flex justify-end">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:underline font-medium text-sm flex items-center gap-1"
                  aria-label={`Read more about ${post.frontmatter.title}`}
                >
                  Read
                  <span aria-hidden="true">→</span>
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
