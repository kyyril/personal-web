import ListProject from "@/components/Project/ListProject";
import GitHubProjects from "@/components/Project/GitHubProjects";
import { getJSONProject } from "@/lib/server";
import { getGitHubRepositories } from "@/lib/github";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Khairil's Personal Website",
  description: "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
  openGraph: {
    title: "Projects | Khairil's Personal Website",
    description: "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
    url: "https://kyyril.vercel.app/projects",
  },
  twitter: {
    title: "Projects | Khairil's Personal Website",
    description: "Explore a collection of Khairil's projects, including web applications, open-source contributions, and personal experiments. See his skills in action.",
  },
};

export default async function ProjectPage() {
  const [data, githubRepos] = await Promise.all([
    getJSONProject(),
    getGitHubRepositories(),
  ]);

  return (
    <section className="max-w-6xl min-h-screen w-full px-4 md:px-16 mx-auto">
      <h1 className="mb-6 text-3xl font-bold lg:text-4xl flex items-end pb-4 pt-2">
        Projects
      </h1>
      <ListProject projects={data.projects} />

      <h2 className="mb-6 text-2xl font-bold lg:text-3xl flex items-end pb-4 pt-24">
        GitHub Repositories
      </h2>
      <GitHubProjects repositories={githubRepos} />
    </section>
  );
}
