import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nova-pa-alpha.vercel.app";
  const routes = [
    "",
    "/about",
    "/nova-8",
    "/teaching-fellowship",
    "/partnerships",
    "/institutional-instructional-partnerships",
    "/percussion-playground",
    "/impact",
    "/resources",
    "/resources/marching-percussion-as-an-educational-discipline",
    "/support",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/percussion-playground" ? "monthly" : "yearly",
    priority:
      route === ""
        ? 1
        : route === "/support" || route === "/percussion-playground"
          ? 0.9
          : 0.8,
  }));
}
