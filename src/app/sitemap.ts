import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/about-us",
  "/career",
  "/company-profile",
  "/faqs",
  "/privacy",
  "/imprint",
  "/terms",
  "/terms-suppliers",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.metito.id";
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified,
    changeFrequency: route === "/career" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
