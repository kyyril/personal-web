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
import { GlobeIcon, Github } from "lucide-react";

export default async function ProjectPage() {
  const data = await getJSONData();

  return (
    <section className="max-w-7xl w-full mt-10 px-4 md:px-16 mx-auto">
      <h2 className="font-bold text-3xl md:text-5xl mb-6">Projects</h2>
      <div className="flex flex-col justify-center">
        <ul className="grid grid-cols-1 gap-4">
          {data.projects.map((project) => (
            <Card key={project.title} className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/3 flex justify-center items-center">
                <Image
                  src={project.cover}
                  alt={project.title}
                  height={200}
                  width={300}
                  className="rounded-md object-cover my-4"
                />
              </div>

              <div className="w-full lg:w-2/3">
                <CardHeader className="py-2 px-6">
                  <CardTitle className="text-lg pt-3 font-semibold">
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
                      <Button size="sm" className="hover:text-violet-500">
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
                        className="hover:text-violet-500"
                        variant="outline"
                      >
                        <Github className="h-3 w-3 mr-1" />
                        Repo
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
