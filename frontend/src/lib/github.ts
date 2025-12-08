import { Octokit } from "@octokit/rest";

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch GitHub repositories at build time
 * Data is cached for static generation
 */
export async function getGitHubRepositories(): Promise<GitHubRepo[]> {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      request: {
        // Enable caching for static generation
        fetch: (url: string, options: RequestInit = {}) => {
          return fetch(url, {
            ...options,
            cache: 'force-cache',
            next: { revalidate: false }, // Fully static
          });
        },
      },
    });

    const { data } = await octokit.repos.listForUser({
      username: "kyyril",
      sort: "created",
      direction: "desc",
      per_page: 100,
    });

    return data.map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      language: repo.language || "",
      created_at: repo.created_at || "",
      updated_at: repo.updated_at || "",
    }));
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

