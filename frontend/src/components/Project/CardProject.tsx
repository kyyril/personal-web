"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import TechBadges from "./TechBadges";
import { GlobeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProjectProps {
  project: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    image: string[];
    live_url: string;
    code_repo_url: string;
  };
  index: number;
  isVisible?: boolean;
  hasMounted?: boolean;
}

export default function CardProject({ project, index, isVisible = false, hasMounted = false }: ProjectProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={`transition-all duration-100 delay-${index * 50} ${
      isVisible && hasMounted
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-5"
    }`}>
      <Card className="flex flex-col lg:flex-row hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-0.5">
        <div className="w-full lg:w-1/3 flex justify-center items-center relative group">
          {imageLoading && (
            <div className="absolute w-full h-full animate-pulse rounded" />
          )}
          <Image
            src={project?.image[0]}
            alt={project?.title}
            width={300}
            height={156}
            quality={65}
            className={`rounded object-cover w-full h-full transition-opacity duration-500 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 300px"
            onLoad={() => setImageLoading(false)}
          />
        </div>

        <div className="w-full lg:w-2/3">
          <CardHeader className="py-2 px-6">
            <Link href={`/projects/${project.id}`}>
              <CardTitle className="text-2xl pt-3 font-semibold hover:underline hover:text-custom">
                {project.title}
              </CardTitle>
            </Link>
            <TechBadges technologies={project.technologies} />
          </CardHeader>
          <CardContent className="py-1">
            <CardDescription className="overflow-hidden text-ellipsis line-clamp-2">
              {project.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="py-2 pb-4">
            <div className="flex space-x-2 w-full justify-end">
              <Link target="_blank" href={project.live_url} prefetch={false}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs hover:bg-custom/10 hover:text-custom"
                >
                  <GlobeIcon className="h-3 w-3 mr-0.5" />
                  Visit
                </Button>
              </Link>
              <Link
                target="_blank"
                href={project.code_repo_url}
                prefetch={false}
              >
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs hover:text-custom"
                >
                  <GitHubLogoIcon className="h-3 w-3 mr-0.5" />
                  Repo
                </Button>
              </Link>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
