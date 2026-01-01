import ProjectCarousel from "../../../components/Project/ProjectCarousel";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { projects } from "../../../lib/data";
import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Metadata } from "next";
import { PERSONAL_KEYWORDS, siteUrl } from "../../../lib/metadata";
import { generateAlternates, generateOpenGraph, generateTwitter } from "../../../lib/seo";
import Breadcrumb from "../../../components/Breadcrumb";

/**
 * Generate static params for all projects at build time
 * This enables static generation for better performance
 */
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

/**
 * Generate dynamic metadata for project detail pages
 * Implements proper canonical URLs to prevent duplicate content issues
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.id === slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const title = `${project.title} | Khairil Rahman Hakiki`;
  const description =
    project.description || "Project details by Khairil Rahman Hakiki";
  const projectUrl = `/projects/${slug}`;

  return {
    title,
    description,
    keywords: [...PERSONAL_KEYWORDS, ...(project.technologies || [])],
    openGraph: generateOpenGraph({
      title,
      description,
      path: projectUrl,
      type: "website",
      images:
        project.image.length > 0
          ? [
            {
              url: project.image[0],
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
          : undefined,
    }),
    twitter: generateTwitter({
      title,
      description,
      images: project.image.length > 0 ? [project.image[0]] : undefined,
    }),
    // Key fix: Proper canonical with language alternates
    alternates: generateAlternates(projectUrl),
  };
}

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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: project.title }
  ];

  return (
    <section className="max-w-5xl w-full px-4 min-h-screen md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <div className="border-none shadow-none">
        {project && project.image.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 aspect-video w-full overflow-hidden rounded-xl bg-muted/20">
            <ProjectCarousel images={project.image} />
          </div>
        ) : (
          <div className="text-center py-10 animate-in fade-in duration-500">
            <p className="text-xl text-muted-foreground">
              No images available.
            </p>
          </div>
        )}

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
                <Button size="sm" className="hover:text-custom ">
                  <GlobeIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  Visit
                </Button>
              </Link>
            ) : (
              <Button size="sm" disabled className="">
                <GlobeIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                Visit (Unavailable)
              </Button>
            )}
            {project.code_repo_url ? (
              <Link
                target="_blank"
                href={project.code_repo_url}
                prefetch={false}
              >
                <Button size="sm" className="hover:text-cus " variant="ghost">
                  <GitHubLogoIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                  Repo
                </Button>
              </Link>
            ) : (
              <Button size="sm" disabled className="" variant="ghost">
                <GitHubLogoIcon className="h-3 w-3 mr-0.5" aria-hidden="true" />
                Repo (Unavailable)
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
