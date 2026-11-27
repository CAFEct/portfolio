import type { MetadataRoute } from "next";
import { getProjectsPublic } from "@/lib/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/certificados", "/projetos"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const projects = await getProjectsPublic().catch(() => []);
  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/projetos/${p.slug}`,
    lastModified: p.createdAt,
  }));

  return [...staticRoutes, ...projectRoutes];
}
