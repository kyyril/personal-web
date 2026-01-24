"use client";

import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import CardProject from "./CardProject";
import CardProjectSkeleton from "./CardProjectSkeleton"; // Import the new skeleton component
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

interface ListProjectProps {
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    image: string[];
    live_url: string;
    code_repo_url: string;
    type: string;
    category: string[];
  }[];
}

const PROJECTS_PER_PAGE = 2;

export default function ListProject({ projects }: ListProjectProps) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set<number>());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Logic:
      // 1. If Category is "All" and Type is "All" -> Show everything (return true)
      // 2. If Category is specific and Type is "All" -> Filter by Category
      // 3. If Category is "All" and Type is specific -> Filter by Type
      // 4. If Both are specific -> Show if matches Category OR matches Type (Union/Combine)

      const isCategoryAll = categoryFilter === "All";
      const isTypeAll = typeFilter === "All";

      // project.category is now an array
      const matchesCategory = project.category.some(cat =>
        cat.toLowerCase() === categoryFilter.toLowerCase()
      );
      const matchesType = project.type === typeFilter;

      if (isCategoryAll && isTypeAll) return true;
      if (isCategoryAll) return matchesType;
      if (isTypeAll) return matchesCategory;

      // Both specific: Combine (OR logic)
      return matchesCategory || matchesType;
    });
  }, [projects, categoryFilter, typeFilter]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    // If no projects found, return empty array
    if (filteredProjects.length === 0) return [];

    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage]);

  useEffect(() => {
    if (hasMounted) {
      // Reset visible items when page changes
      setVisibleItems(new Set());

      // Animate items in sequence with faster delays
      const timers: NodeJS.Timeout[] = [];
      for (let i = 0; i < paginatedProjects.length; i++) {
        const timer = setTimeout(() => {
          setVisibleItems((prev) => new Set([...prev, i]));
        }, i * 30); // Faster animation: 30ms delay instead of 50ms
        timers.push(timer);
      }

      // Cleanup timers on unmount or dependency change
      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [currentPage, hasMounted, paginatedProjects.length]);

  const generatePaginationNumbers = () => {
    const delta = 1;
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

  const clearFilters = () => {
    setCategoryFilter("All");
    setTypeFilter("All");
    setCurrentPage(1); // Reset page on clear
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col justify-center">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-end">
        <div className="flex items-center gap-2">
          <label htmlFor="category-select" className="text-sm font-medium sr-only">Category</label>
          <Select onValueChange={setCategoryFilter} value={categoryFilter}>
            <SelectTrigger id="category-select" className="w-[180px] truncate" aria-label={`Filter by category, currently ${categoryFilter}`}>
              Category: {categoryFilter}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="type-select" className="text-sm font-medium sr-only">Type</label>
          <Select onValueChange={setTypeFilter} value={typeFilter}>
            <SelectTrigger id="type-select" className="w-[180px] truncate" aria-label={`Filter by type, currently ${typeFilter}`}>
              Type: {typeFilter}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Fullstack">Fullstack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="h-9"
          aria-label="Clear all filters"
        >
          Clear
        </Button>
      </div>

      {/* Project List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!hasMounted ? (
          // Loading skeletons
          Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
            <li key={index}>
              <CardProjectSkeleton />
            </li>
          ))
        ) : paginatedProjects.length > 0 ? (
          // Projects list
          <>
            {paginatedProjects.map((project, index) => (
              <li key={project.id}>
                <CardProject
                  project={project}
                  index={index}
                  isVisible={visibleItems.has(index) || !hasMounted} // Fallback to !hasMounted for visible if hydration happens fast
                  hasMounted={hasMounted}
                />
              </li>
            ))}
            {/* Fill remaining space with invisible placeholders to keep grid layout consistent if wanted, or just nothing */}
          </>
        ) : (
          // Empty state
          <li className="col-span-1 md:col-span-2 py-12 text-center text-muted-foreground">
            No projects found matching your criteria.
          </li>
        )}
      </ul>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          {/* Results Info */}
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {(currentPage - 1) * PROJECTS_PER_PAGE + 1}-
            {Math.min(currentPage * PROJECTS_PER_PAGE, filteredProjects.length)}{" "}
            of {filteredProjects.length} projects
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 order-1 sm:order-2">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-70"
              aria-label={`Go to previous page, page ${currentPage - 1
                } of ${totalPages}`}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {generatePaginationNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <div key={`ellipsis-${index}`} className="px-2">
                      <DotsHorizontalIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  );
                }

                const isActive = currentPage === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`h-9 w-9 p-0 ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    aria-label={`Go to page ${pageNum} of ${totalPages}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-70"
              aria-label={`Go to next page, page ${currentPage + 1
                } of ${totalPages}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
