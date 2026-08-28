import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Article from "@/models/Article";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/notre-expertise", changeFrequency: "monthly", priority: 0.8 },
  { path: "/notre-engagement", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  const articles = await Article.find({ status: "published" })
    .select("slug updatedAt publishedAt")
    .lean();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt ?? article.publishedAt ?? Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
