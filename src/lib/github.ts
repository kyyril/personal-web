import { Octokit } from "@octokit/rest";

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  created_at: string;
}

export async function getGitHubRepositories(): Promise<GitHubRepo[]> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
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
    language: repo.language || "",
    created_at: repo.created_at || "",
  }));
}
