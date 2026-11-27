import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  certificates,
  experiences,
  messages,
  projects,
  siteSettings,
  skills,
  videos,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await requireAdmin();

  const [certs, projs, exps, skls, vids, msgs, settings] = await Promise.all([
    db.select().from(certificates),
    db.select().from(projects),
    db.select().from(experiences),
    db.select().from(skills),
    db.select().from(videos),
    db.select().from(messages),
    db.select().from(siteSettings),
  ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    certificates: certs,
    projects: projs,
    experiences: exps,
    skills: skls,
    videos: vids,
    messages: msgs,
    siteSettings: settings,
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cafe-backup-${Date.now()}.json"`,
    },
  });
}
