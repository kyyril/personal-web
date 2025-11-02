"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CardProject from "./CardProject";
import CardProjectSkeleton from "./CardProjectSkeleton"; // Import the new skeleton component

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
          paginatedProjects.map((project) => (
            <li key={project.id}>
              <CardProject project={project} />
            </li>
          ))
        ) : (
          Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
            <li key={index}>
              <CardProjectSkeleton />
            </li>
          ))
        )}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
