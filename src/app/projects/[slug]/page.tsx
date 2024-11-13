import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getJSONData } from "@/lib/server";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default async function Detailproject({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getJSONData();
  if (!data || !data.projects) {
    return <p>Project not found</p>;
  }

  const project = data.projects.find((project) => project.id === params.slug);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <section className="max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto">
      <Card className="border-none shadow-none">
        {project && project.details && project.details.image.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {project.details.image.map((img, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <Image
                    src={img}
                    alt={`Image ${index + 1}`}
                    height={200}
                    width={500}
                    loading="lazy"
                    className="rounded-sm"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2" />
            <CarouselNext className="absolute right-2 top-1/2" />
          </Carousel>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">
              No images available.
            </p>
          </div>
        )}

        <div className="flex flex-col mt-6 w-full mx-2 gap-2">
          <h1 className="text-3xl font-bold lg:text-4xl underline">
            {project.title || "Project Title Not Available"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {project.details.description || "Description not available."}
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
            {project.details.features && project.details.features.length > 0 ? (
              <ul className="list-disc">
                {project.details.features.map((feature, index) => (
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
                <Button size="sm" className="hover:text-violet-500 font-normal">
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
                  className="hover:text-violet-500 font-normal"
                  variant="outline"
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
                variant="outline"
              >
                <GitHubLogoIcon className="h-3 w-3 mr-0.5" />
                Repo (Unavailable)
              </Button>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
