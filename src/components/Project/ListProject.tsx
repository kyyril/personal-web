"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CardProject from "./CardProject";

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

export default function ListProject({ projects }: ListProjectProps) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredProjects = projects.filter((project) => {
    const categoryMatch =
      categoryFilter === "All" || project.category === categoryFilter;
    const typeMatch = typeFilter === "All" || project.type === typeFilter;
    return categoryMatch && typeMatch;
  });

  const clearFilters = () => {
    setCategoryFilter("All");
    setTypeFilter("All");
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
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Web">Web</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setTypeFilter} value={typeFilter}>
          <SelectTrigger className="truncate">Type: {typeFilter}</SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Frontend">Frontend</SelectItem>
            <SelectItem value="Fullstack">Fullstack</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {/* Project List */}
      <ul className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project) => (
          <li key={project.id}>
            <CardProject project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
