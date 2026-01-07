"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Article } from "@/data/blog-data";
import { ArticleFilter, SearchResultsCount } from "./ArticleFilter";
import { Folder } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

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
          <ArticleCard key={post.slug} post={post} />
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
