import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";

export async function getAnalyticsSummary() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      pageViews: sql<number>`count(*) filter (where ${analyticsEvents.type} = 'page_view')::int`,
      projectClicks: sql<number>`count(*) filter (where ${analyticsEvents.type} = 'project_click')::int`,
      pdfDownloads: sql<number>`count(*) filter (where ${analyticsEvents.type} = 'pdf_download')::int`,
    })
    .from(analyticsEvents);

  const daily = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${analyticsEvents.createdAt}), 'YYYY-MM-DD')`,
      views: count(),
    })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.type, "page_view"), gte(analyticsEvents.createdAt, thirtyDaysAgo)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  const topProjects = await db
    .select({ path: analyticsEvents.path, clicks: count() })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.type, "project_click"))
    .groupBy(analyticsEvents.path)
    .orderBy(desc(count()))
    .limit(5);

  const topPdfs = await db
    .select({ path: analyticsEvents.path, downloads: count() })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.type, "pdf_download"))
    .groupBy(analyticsEvents.path)
    .orderBy(desc(count()))
    .limit(5);

  return {
    pageViews: totals?.pageViews ?? 0,
    projectClicks: totals?.projectClicks ?? 0,
    pdfDownloads: totals?.pdfDownloads ?? 0,
    daily,
    topProjects,
    topPdfs,
  };
}
