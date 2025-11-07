import React, { Suspense } from "react";
import { Metadata } from "next";
import ProjectListSkeleton from "../../components/Project/ProjectListSkeleton";
import GitHubProjectsListSkeleton from "../../components/Project/github/GitHubProjectsListSkeleton";
import ProjectListWrapper from "../../components/Project/ProjectListWrapper";
import GitHubProjectsWrapper from "../../components/Project/github/GitHubProjectsWrapper";
import Breadcrumb from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Projects | Khairil Rahman Hakiki",
  description:
    "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in React.js, Next.js, and TypeScript in action.",
  keywords: [
    "Khairil Rahman Hakiki projects",
    "React projects",
    "Next.js applications",
    "TypeScript development",
    "web development portfolio",
    "software engineer projects"
  ],
  alternates: {
    canonical: "https://kyyril.pages.dev/projects",
  },
  openGraph: {
    title: "Projects | Khairil Rahman Hakiki",
    description:
      "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in React.js, Next.js, and TypeScript in action.",
    url: "https://kyyril.pages.dev/projects",
    type: "website",
    images: [
      {
        url: "https://kyyril.pages.dev/assets/profile.webp",
        width: 1200,
        height: 630,
        alt: "Khairil Rahman Hakiki - Projects Portfolio",
      }
    ]
  },
  twitter: {
    title: "Projects | Khairil Rahman Hakiki",
    description:
      "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
    card: "summary_large_image",
  },
};

export const revalidate = 3600;

export default function ProjectPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Projects" }
  ];

  return (
    <section className="max-w-6xl min-h-screen w-full px-4 md:px-16 mx-auto">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Projects
      </h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Explore a collection of my work including web applications, open-source contributions,
        and personal experiments. Each project showcases different aspects of modern web development.
      </p>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListWrapper />
      </Suspense>

      <h2 className="mb-6 text-2xl font-bold lg:text-3xl flex items-end pb-4 pt-24">
        GitHub Repositories
      </h2>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Live repositories showcasing ongoing development work and collaborative projects.
      </p>
      <Suspense fallback={<GitHubProjectsListSkeleton />}>
        <GitHubProjectsWrapper />
      </Suspense>
    </section>
  );
}
