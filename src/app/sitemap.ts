import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/portfolio", "/services", "/case-studies", "/contact", "/faq", "/favorites"];
  return paths.map((path) => ({
    url: `${site.origin}${path || "/"}`,
    lastModified: new Date("2026-03-01"),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
