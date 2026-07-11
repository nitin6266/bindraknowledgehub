import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = ["/", "/about", "/courses", "/faculty", "/results", "/gallery", "/testimonials", "/contact", "/admissions"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
