"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, SortAsc, SortDesc, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { Article } from "@/data/blog-data";

interface ArticleFilterProps {
  articles: Article[];
  onFilteredArticles: (filtered: Article[]) => void;
  allTags: string[];
  allCategories: { name: string; slug: string; count: number }[];
}

export function ArticleFilter({
  articles,
  onFilteredArticles,
  allTags,
  allCategories,
}: ArticleFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "title" | "readTime">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.frontmatter.title.toLowerCase().includes(query) ||
          article.frontmatter.description.toLowerCase().includes(query) ||
          article.frontmatter.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          ) ||
          article.frontmatter.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) =>
          article.frontmatter.category.toLowerCase().replace(/\s+/g, "-") ===
          selectedCategory
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((article) =>
        selectedTags.every((tag) => article.frontmatter.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.frontmatter.date).getTime() -
            new Date(b.frontmatter.date).getTime();
          break;
        case "title":
          comparison = a.frontmatter.title.localeCompare(b.frontmatter.title);
          break;
        case "readTime":
          const aReadTime = parseInt(a.frontmatter.readTime) || 0;
          const bReadTime = parseInt(b.frontmatter.readTime) || 0;
          comparison = aReadTime - bReadTime;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [
    articles,
    searchQuery,
    selectedCategory,
    selectedTags,
    sortBy,
    sortOrder,
  ]);

  // Notify parent of filtered results
  useEffect(() => {
    onFilteredArticles(filteredAndSortedArticles);
  }, [filteredAndSortedArticles, onFilteredArticles]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTags([]);
    setSortBy("date");
    setSortOrder("desc");
  };

  const activeFiltersCount = [
    searchQuery.trim() ? 1 : 0,
    selectedCategory !== "all" ? 1 : 0,
    selectedTags.length,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="readTime">Read Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    {sortOrder === "desc" ? (
                      <SortDesc className="h-4 w-4" />
                    ) : (
                      <SortAsc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Active Filters Display */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Active Filters
                </label>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Filter by Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? "default" : "secondary"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            !isSelected && "opacity-70 hover:opacity-100"
                          )}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// Search Results Counter Component
export function SearchResultsCount({
  total,
  filtered,
  isFiltered,
}: {
  total: number;
  filtered: number;
  isFiltered: boolean;
}) {
  if (!isFiltered) {
    return (
      <p className="text-sm text-muted-foreground mb-4">
        Showing all {total} articles
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground mb-4">
      Showing {filtered} of {total} articles
    </p>
  );
}
