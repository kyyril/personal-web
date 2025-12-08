import React, { Suspense } from "react";
import { PERSONAL_KEYWORDS, siteUrl, SEO_DESCRIPTION } from "../../lib/metadata";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import ProjectListSkeleton from "../../components/Project/ProjectListSkeleton";
import GitHubProjectsListSkeleton from "../../components/Project/github/GitHubProjectsListSkeleton";
import ProjectListWrapper from "../../components/Project/ProjectListWrapper";
import GitHubProjectsWrapper from "../../components/Project/github/GitHubProjectsWrapper";
import Breadcrumb from "../../components/Breadcrumb";
import { data } from "../../lib/data";

export const metadata: Metadata = {
  title: "Projects | Khairil Rahman Hakiki",
  description: SEO_DESCRIPTION.projects,
  keywords: [
    ...PERSONAL_KEYWORDS,
    "software engineer projects",
    "web development portfolio",
    "scalable systems",
    "clean architecture",
  ],
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
  openGraph: {
    title: "Projects | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.projects,
    url: `${siteUrl}/projects`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/assets/profile.webp`,
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Projects Portfolio",
      },
    ],
  },
  twitter: {
    title: "Projects | Khairil Rahman Hakiki",
    description: SEO_DESCRIPTION.projects,
    card: "summary_large_image",
  },
};

export const revalidate = 3600;

export default function ProjectPage() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Projects" }];

  return (
    <section className="max-w-6xl min-h-screen w-full px-4 md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListWrapper />
      </Suspense>

      <h2 className="mb-6 text-2xl font-bold lg:text-3xl flex items-end pb-4 pt-24">
        GitHub Repositories
      </h2>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Live repositories showcasing ongoing development work and collaborative
        projects.
      </p>
      <Suspense fallback={<GitHubProjectsListSkeleton />}>
        <GitHubProjectsWrapper />
      </Suspense>
    </section>
  );
}
