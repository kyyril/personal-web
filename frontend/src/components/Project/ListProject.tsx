"use client";

import { useState, useMemo } from "react";
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
    category: string;
  }[];
}

const PROJECTS_PER_PAGE = 6;

export default function ListProject({ projects }: ListProjectProps) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch =
        categoryFilter === "All" || project.category === categoryFilter;
      const typeMatch = typeFilter === "All" || project.type === typeFilter;
      return categoryMatch && typeMatch;
    });
  }, [projects, categoryFilter, typeFilter]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage]);

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
      <div className="flex gap-4 mb-4 items-center">
        <Select onValueChange={setCategoryFilter} value={categoryFilter}>
          <SelectTrigger className="truncate ">
            Category: {categoryFilter}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setTypeFilter} value={typeFilter}>
          <SelectTrigger className="truncate">Type: {typeFilter}</SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Backend">Backend</SelectItem>
            <SelectItem value="Fullstack">Fullstack</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {/* Project List */}
      <ul className="grid grid-cols-1 gap-4">
        {paginatedProjects.length > 0 ? (
          <>
            {paginatedProjects.map((project, index) => (
              <li key={project.id}>
                <CardProject project={project} index={index} />
              </li>
            ))}
            {Array.from({
              length: PROJECTS_PER_PAGE - paginatedProjects.length,
            }).map((_, index) => (
              <li
                key={`placeholder-${index}`}
                className="invisible"
                aria-hidden="true"
              >
                <CardProjectSkeleton />
              </li>
            ))}
          </>
        ) : (
          Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
            <li key={index}>
              <CardProjectSkeleton />
            </li>
          ))
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
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              aria-label={`Go to previous page, page ${currentPage - 1} of ${totalPages}`}
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
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`h-9 w-9 p-0 ${
                      isActive
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
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-9 px-3 gap-1 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              aria-label={`Go to next page, page ${currentPage + 1} of ${totalPages}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
