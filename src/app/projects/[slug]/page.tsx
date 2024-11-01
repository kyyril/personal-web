import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <main className="flex justify-center min-h-screen mt-16">
      <section className="w-full max-w-4xl flex flex-col items-center mx-5">
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="flex flex-col mt-6 w-full">
          <h1 className=" text-3xl font-bold lg:text-4xl underline">
            {project.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {project.details.description}
          </p>
          <div className="flex flex-wrap gap-1 my-4">
            {project.technologies.map((tech) => (
              <Badge
                className="w-auto h-7 text-sm"
                key={tech}
                variant="secondary"
              >
                {tech}
              </Badge>
            ))}
          </div>
          <div className="w-full">
            <ul className="list-disc">
              {project.details.features.map((feature, index) => (
                <li key={index} className="ml-6">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-2 mt-4">
            <Link target="_blank" href={project.live_url} prefetch={false}>
              <Button size="sm" className="hover:text-violet-500 font-normal">
                <GlobeIcon className="h-3 w-3 mr-0.5" />
                Visit
              </Button>
            </Link>
            <Link target="_blank" href={project.code_repo_url} prefetch={false}>
              <Button
                size="sm"
                className="hover:text-violet-500 font-normal"
                variant="outline"
              >
                <GitHubLogoIcon className="h-3 w-3 mr-0.5" />
                Repo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
