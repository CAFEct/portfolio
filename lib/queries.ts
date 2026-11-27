import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import {
  certificates,
  experiences,
  messages,
  projects,
  skills,
  videos,
} from "@/db/schema";

export const PAGE_SIZE = 12;

export async function getCertificatesPublic(opts: {
  search?: string;
  category?: string;
  page?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const conditions = [eq(certificates.isVisible, true)];
  if (opts.category) conditions.push(eq(certificates.category, opts.category));
  if (opts.search) {
    conditions.push(
      or(
        ilike(certificates.title, `%${opts.search}%`),
        ilike(certificates.issuer, `%${opts.search}%`),
      )!,
    );
  }
  const where = and(...conditions);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(certificates)
      .where(where)
      .orderBy(asc(certificates.sortOrder), desc(certificates.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(certificates).where(where),
  ]);

  return { rows, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getCertificateCategories() {
  const rows = await db
    .selectDistinct({ category: certificates.category })
    .from(certificates)
    .where(eq(certificates.isVisible, true))
    .orderBy(asc(certificates.category));
  return rows.map((r) => r.category);
}

export async function getCertificateById(id: string) {
  const rows = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getVisibleCertificateCount() {
  const [{ total }] = await db
    .select({ total: count() })
    .from(certificates)
    .where(eq(certificates.isVisible, true));
  return total;
}

export async function getProjectsPublic() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.isVisible, true))
    .orderBy(desc(projects.isFeatured), asc(projects.sortOrder), asc(projects.createdAt));
}

export async function getProjectBySlug(slug: string) {
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getVisibleProjects() {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.isVisible, true), eq(projects.isFeatured, true)))
    .orderBy(asc(projects.sortOrder), asc(projects.createdAt))
    .limit(6);
}

export async function getExperiencesPublic() {
  return db
    .select()
    .from(experiences)
    .where(eq(experiences.isVisible, true))
    .orderBy(asc(experiences.sortOrder), desc(experiences.createdAt));
}

export async function getSkillsPublic() {
  return db
    .select()
    .from(skills)
    .where(eq(skills.isVisible, true))
    .orderBy(asc(skills.category), asc(skills.sortOrder), asc(skills.name));
}

export async function getVideosPublic() {
  return db
    .select()
    .from(videos)
    .where(eq(videos.isVisible, true))
    .orderBy(asc(videos.sortOrder), desc(videos.createdAt));
}

// ---- Admin queries (include hidden) ----

export function listCertificatesAdmin() {
  return db.select().from(certificates).orderBy(asc(certificates.sortOrder), desc(certificates.createdAt));
}

export function listProjectsAdmin() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.createdAt));
}

export function listExperiencesAdmin() {
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder), desc(experiences.createdAt));
}

export function listSkillsAdmin() {
  return db.select().from(skills).orderBy(asc(skills.category), asc(skills.sortOrder), asc(skills.name));
}

export function listVideosAdmin() {
  return db.select().from(videos).orderBy(asc(videos.sortOrder), desc(videos.createdAt));
}

export function listMessagesAdmin() {
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function getUnreadMessageCount() {
  const [{ total }] = await db
    .select({ total: count() })
    .from(messages)
    .where(eq(messages.isRead, false));
  return total;
}

