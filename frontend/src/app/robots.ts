import { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://kyyril.vercel.app";

/**
 * Robots.txt configuration following Google's guidelines
 * https://developers.google.com/search/docs/crawling-indexing/robots/intro
 * 
 * Key features:
 * - Allow all search engines to crawl public content
 * - Block API routes, admin, and internal paths
 * - Specify sitemap location
 * - Set canonical host
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/_next/",
          "/node_modules/",
          "/.well-known/",
          "/temp/",
          "/tmp/",
          "/*.json$",  // Prevent crawling of JSON data files
          "/*?*",      // Prevent crawling of URLs with query parameters (optional)
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
        ],
      },
      // Allow specific crawlers for better coverage
      {
        userAgent: "Googlebot-Image",
        allow: ["/assets/", "/images/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
