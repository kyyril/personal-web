import { MetadataRoute } from "next";
import { data } from "../lib/data";
import { getAllArticles, getAllCategories } from "../data/blog-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kyyril.vercel.app";

/**
 * Generate sitemap following Google's sitemap guidelines
 * https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
 * 
 * Key features:
 * - All canonical URLs included
 * - Proper lastModified dates
 * - Appropriate changeFrequency and priority
 * - Dynamic routes for articles, categories, tags, and projects
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;
  const currentDate = new Date();

  // Static routes - main pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guestbook`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    }
  ];

  // Dynamic routes for projects
  const projectRoutes: MetadataRoute.Sitemap = data.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic routes for articles
  const articles = getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic routes for article categories
  const categories = getAllCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic routes for article tags
  // Extract all unique tags from articles
  const tagsMap = new Map<string, { name: string; slug: string; latestDate: Date }>();
  articles.forEach((article) => {
    const articleDate = new Date(article.frontmatter.date);
    article.frontmatter.tags.forEach((tag) => {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      const existing = tagsMap.get(slug);
      if (!existing || articleDate > existing.latestDate) {
        tagsMap.set(slug, {
          name: tag,
          slug,
          latestDate: articleDate,
        });
      }
    });
  });

  const tagRoutes: MetadataRoute.Sitemap = Array.from(tagsMap.values()).map((tag) => ({
    url: `${baseUrl}/blog/tags/${tag.slug}`,
    lastModified: tag.latestDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...articleRoutes,
    ...categoryRoutes,
    ...tagRoutes,
  ];
}
