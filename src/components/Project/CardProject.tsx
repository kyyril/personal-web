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
  return (
    <Card className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/3 flex justify-center items-center relative group">
        <Image
          src={project?.image[0]}
          alt={project?.title}
          fill
          quality={100}
          className="rounded-xl object-cover"
          loading="lazy"
        />
      </div>

      <div className="w-full lg:w-2/3">
        <CardHeader className="py-2 px-6">
          <Link href={`/projects/${project.id}`}>
            <CardTitle className="text-2xl pt-3 font-semibold hover:underline hover:text-violet-500">
              {project.title}
            </CardTitle>
          </Link>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
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
          <div className="flex space-x-2">
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
        </CardFooter>
      </div>
    </Card>
  );
}
