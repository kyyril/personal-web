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
import { Skeleton } from "../ui/skeleton";
import ImagePreview from "../ImagePreview";

import { Project } from "../types";

interface ProjectProps {
  project: Project;
  index: number;
  isVisible?: boolean;
  hasMounted?: boolean;
}

export default function CardProject({ project, index, isVisible = false, hasMounted = false }: ProjectProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={`transition-all duration-300 delay-${index * 50} ${(isVisible && hasMounted) || !hasMounted
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-5"
      }`}>
      <Card className="group h-full flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
        <ImagePreview
          src={project?.image[0]}
          alt={project?.title}
          className="w-full aspect-video overflow-hidden relative rounded-t-lg"
        >
          {imageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <Image
            src={project?.image[0]}
            alt={project?.title}
            fill
            quality={85}
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoading ? "opacity-0" : "opacity-100"
              }`}
            loading={index === 0 ? "eager" : "lazy"}
            onLoad={() => setImageLoading(false)}
          />
        </ImagePreview>

        <div className="flex-1 flex flex-col min-w-0">
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
              {project.live_url && (
                <Link target="_blank" href={project.live_url} prefetch={false}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs hover:bg-custom/10 hover:text-custom"
                  >
                    <GlobeIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                    Visit
                  </Button>
                </Link>
              )}
              {project.code_repo_url && (
                <Link
                  target="_blank"
                  href={project.code_repo_url}
                  prefetch={false}
                >
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs hover:text-custom"
                  >
                    <GitHubLogoIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                    Repo
                  </Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
