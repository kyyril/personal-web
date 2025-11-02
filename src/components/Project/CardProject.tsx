"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

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
}

export default function CardProject({ project }: ProjectProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col lg:flex-row hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
        <div className="w-full lg:w-1/3 flex justify-center items-center relative group">
          {imageLoading && (
            <div className="absolute w-full h-full animate-pulse rounded-xl" />
          )}
          <Image
            src={project?.image[0]}
            alt={project?.title}
            width={400}
            height={250}
            quality={100}
            className={`rounded-xl object-cover w-full h-full transition-opacity duration-500 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
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
            <div className="flex flex-wrap gap-1 mt-1">
              {project.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="p-0.5 text-xs line-clamp-1"
                >
                  {tech}
                </Badge>
              ))}
            </div>
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
    </motion.div>
  );
}
