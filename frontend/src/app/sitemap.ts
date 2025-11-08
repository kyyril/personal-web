import { MetadataRoute } from "next";
import { data } from "../lib/data";
import { getAllArticles, getAllCategories } from "../data/blog-data";

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

  // Dynamic routes for articles
  const articles = getAllArticles();
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic routes for article categories
  const categories = getAllCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/articles/category/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes, ...categoryRoutes];
}
