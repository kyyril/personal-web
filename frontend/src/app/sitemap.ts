import { MetadataRoute } from "next";
import { data } from "../lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kyyril.pages.dev";
  const currentDate = new Date();

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic routes for projects
  const projectRoutes = data.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic routes for articles (if any)
  // const articleRoutes = [
  //   {
  //     url: `${baseUrl}/articles/${article.id}`,
  //     lastModified: currentDate,
  //     changeFrequency: "monthly" as const,
  //     priority: 0.6,
  //   }
  // ];

  return [...staticRoutes, ...projectRoutes];
}
