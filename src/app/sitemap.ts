import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nova-pa-alpha.vercel.app";
  const routes = ["", "/about", "/academy", "/impact", "/support", "/contact"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : route === "/support" ? 0.9 : 0.8,
  }));
}
