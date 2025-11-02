import GitHubProjects from "@/components/Project/GitHubProjects";
import { getGitHubRepositories } from "@/lib/github";
import GitHubProjectsSkeleton from "./GitHubProjectsSkeleton"; // Import the new skeleton component

export default async function GitHubProjectsWrapper() {
  const githubRepos = await getGitHubRepositories();
  if (githubRepos.length === 0) {
    return <GitHubProjectsSkeleton />; // Display skeleton if no data
  }
  return <GitHubProjects repositories={githubRepos} />;
}