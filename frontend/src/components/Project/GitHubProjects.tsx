"use client";
import { GitHubRepo } from "../../lib/github";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  GitHubLogoIcon,
  CalendarIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { GitFork } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GitHubProjectCardSkeleton from "./GitHubProjectCardSkeleton";

interface GitHubProjectsProps {
  repositories: GitHubRepo[];
}

export default function GitHubProjects({ repositories }: GitHubProjectsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(repositories.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRepositories = repositories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-orange-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      "C++": "bg-blue-600",
      HTML: "bg-red-500",
      CSS: "bg-blue-400",
      PHP: "bg-purple-500",
      Ruby: "bg-red-600",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-600",
      Dart: "bg-blue-500",
      Shell: "bg-gray-500",
      Astro: "bg-orange-400",
      TeX: "bg-green-700",
    };
    return colors[language] || "bg-gray-400";
  };

  // Generate pagination numbers with ellipsis
  const generatePaginationNumbers = () => {
    const delta = 0;
    const range = [];
    const rangeWithDots: (string | number)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-8">
      {/* Repository Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {currentRepositories.map((repo, index) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
            >
              <Card className="group h-full flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={repo.html_url}
                        target="_blank"
                        className="block"
                      >
                        <h3 className="text-lg font-semibold group-hover:text-custom transition-colors duration-200 truncate">
                          {repo.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1 leading-relaxed">
                        {repo.description || "No description available"}
                      </p>
                    </div>
                    <GitHubLogoIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors duration-200 flex-shrink-0" />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <div className="flex items-center gap-4 text-sm">
                    {repo.language && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getLanguageColor(
                            repo.language
                          )}`}
                        />
                        <span className="text-muted-foreground font-medium">
                          {repo.language}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <StarIcon className="h-3 w-3" />
                        <span className="font-medium">
                          {repo.stargazers_count}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GitFork className="h-3 w-3" />
                        <span className="font-medium">{repo.forks_count}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 pb-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Created {formatDate(repo.created_at)}</span>
                    </div>
                    <Link href={repo.html_url} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs hover:bg-custom/10 hover:text-custom"
                      >
                        View Repo
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {Array.from({
            length: itemsPerPage - currentRepositories.length,
          }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="invisible"
              aria-hidden="true"
            >
              <GitHubProjectCardSkeleton />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          {/* Results Info */}
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, repositories.length)} of{" "}
            {repositories.length} repositories
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 order-1 sm:order-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {generatePaginationNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <div key={`ellipsis-${index}`} className="px-2">
                      <DotsHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                }

                const isActive = currentPage === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`h-9 w-9 p-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Page Indicator */}
      {totalPages > 1 && (
        <div className="flex sm:hidden justify-center pt-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i + 1}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  currentPage === i + 1
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
