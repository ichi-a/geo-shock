import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.geo-shock.com";
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/articles/what-is-geo`,
      lastModified: new Date("2026-02-22"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/articles/why-jsonld-matters`,
      lastModified: new Date("2026-02-22"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/articles/ai-and-content-creators`,
      lastModified: new Date("2026-02-22"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/terms/geo-shock-index-a`,
      lastModified: new Date("2026-02-22"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/experiments`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date("2026-02-22"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteUrl}/stats`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
