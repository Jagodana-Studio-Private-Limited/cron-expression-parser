import { MetadataRoute } from "next";
import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || siteConfig.url;

  return Object.entries(siteConfig.pages).map(([path, page]) => ({
    url: path === "/" ? baseUrl : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
