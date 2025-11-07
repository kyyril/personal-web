import { Suspense } from "react";
import ProjectCarousel from "../../../components/Project/ProjectCarousel";
import ProjectImageCarouselSkeleton from "../../../components/Project/ProjectImageCarouselSkeleton";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { projects } from "../../../lib/data";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `PROJECT - khairil rahman hakiki`,
  description:
    "I’m an Information Systems student who loves programming, especially software web development. I specialize in Next.js with Typescript and am currently learning backend development with Golang.",
};

export default async function Detailproject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((project) => project.id === slug);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <section className="max-w-5xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <div className="border-none shadow-none">
        <Suspense fallback={<ProjectImageCarouselSkeleton />}>
          {project && project.image.length > 0 ? (
            <ProjectCarousel images={project.image} />
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground">
                No images available.
              </p>
            </div>
          )}
        </Suspense>

        <div className="flex flex-col mt-6 w-full mx-2 gap-2">
          <h1 className="text-3xl font-bold lg:text-4xl">
            {project.title || "Project Title Not Available"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {project.description || "Description not available."}
          </p>

          <div className="flex flex-wrap gap-1 my-4">
            {project.technologies && project.technologies.length > 0 ? (
              project.technologies.map((tech) => (
                <Badge
                  className="w-auto h-7 text-sm"
                  key={tech}
                  variant="secondary"
                >
                  {tech}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No technologies listed.</p>
            )}
          </div>

          <div className="w-full">
            {project.features && project.features.length > 0 ? (
              <ul className="list-disc">
                {project.features.map((feature, index) => (
                  <li key={index} className="ml-4">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No features available.</p>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            {project.live_url ? (
              <Link target="_blank" href={project.live_url} prefetch={false}>
                <Button size="sm" className="hover:text-custom font-normal">
                  <GlobeIcon className="h-3 w-3 mr-0.5" />
                  Visit
                </Button>
              </Link>
            ) : (
              <Button size="sm" disabled className="font-normal">
                <GlobeIcon className="h-3 w-3 mr-0.5" />
                Visit (Unavailable)
              </Button>
            )}
            {project.code_repo_url ? (
              <Link
                target="_blank"
                href={project.code_repo_url}
                prefetch={false}
              >
                <Button
                  size="sm"
                  className="hover:text-cus font-normal"
                  variant="ghost"
                >
                  <GitHubLogoIcon className="h-3 w-3 mr-0.5" />
                  Repo
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                disabled
                className="font-normal"
                variant="ghost"
              >
                <GitHubLogoIcon className="h-3 w-3 mr-0.5" />
                Repo (Unavailable)
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
