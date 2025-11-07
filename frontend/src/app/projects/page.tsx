import React, { Suspense } from "react";
import { Metadata } from "next";
import ProjectListSkeleton from "../../components/Project/ProjectListSkeleton";
import GitHubProjectsListSkeleton from "../../components/Project/github/GitHubProjectsListSkeleton";
import ProjectListWrapper from "../../components/Project/ProjectListWrapper";
import GitHubProjectsWrapper from "../../components/Project/github/GitHubProjectsWrapper";

export const metadata: Metadata = {
  title: "Projects | Khairil's Personal Website",
  description:
    "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
  openGraph: {
    title: "Projects | Khairil's Personal Website",
    description:
      "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
    url: "https://kyyril.pages.dev/projects/",
  },
  twitter: {
    title: "Projects | Khairil's Personal Website",
    description:
      "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
  },
};

export default function ProjectPage() {
  return (
    <section className="max-w-6xl min-h-screen w-full px-4 md:px-16 mx-auto">
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Projects
      </h1>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListWrapper />
      </Suspense>

      <h2 className="mb-6 text-2xl font-bold lg:text-3xl flex items-end pb-4 pt-24">
        GitHub Repositories
      </h2>
      <Suspense fallback={<GitHubProjectsListSkeleton />}>
        <GitHubProjectsWrapper />
      </Suspense>
    </section>
  );
}
