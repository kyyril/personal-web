import { getJSONData } from "@/lib/server";
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
import Image from "next/image";
import Link from "next/link";
import { GlobeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { ProjectCardSkeleton } from "@/components/Loading";

export default async function ProjectPage() {
  const data = await getJSONData();

  return (
    <section className="max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto">
      <h2 className="font-semibold text-3xl md:text-5xl mb-6">Projects</h2>
      <div className="flex flex-col justify-center">
        <ul className="grid grid-cols-1 gap-4">
          {data.projects.map((project) => (
            <Card
              key={project.title}
              className="flex bg-primary-foreground flex-col lg:flex-row"
            >
              <Suspense fallback={<ProjectCardSkeleton />}>
                <div className="w-full lg:w-1/3 flex justify-center items-center">
                  <Image
                    src={project.cover}
                    alt={project.title}
                    quality={100}
                    height={200}
                    width={300}
                    className="rounded-md w-full"
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <CardHeader className="py-2 px-6">
                    <CardTitle className="text-2xl pt-3 font-semibold">
                      {project.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="py-1">
                    <CardDescription>{project.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="py-2 pb-4">
                    <div className="flex space-x-2">
                      <Link
                        target="_blank"
                        href={project.live_url}
                        prefetch={false}
                      >
                        <Button
                          size="sm"
                          className="hover:text-violet-500 font-normal"
                        >
                          <GlobeIcon className="h-3 w-3 mr-1" />
                          Demo
                        </Button>
                      </Link>
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
                          <GitHubLogoIcon className="h-3 w-3 mr-1" />
                          Repo
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </div>
              </Suspense>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
