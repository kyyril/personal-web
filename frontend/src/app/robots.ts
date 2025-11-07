import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/_next/",
          "/node_modules/",
          "/.well-known/",
          "/temp/",
          "/tmp/"
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/private/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/private/"],
      },
    ],
    sitemap: "https://kyyril.pages.dev/sitemap.xml",
    host: "https://kyyril.pages.dev"
  };
}
