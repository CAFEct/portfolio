import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";

const trackSchema = z.object({
  type: z.enum(["page_view", "project_click", "pdf_download"]),
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    try {
      body = JSON.parse(await req.text());
    } catch {
      return new NextResponse(null, { status: 400 });
    }
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  // Fire-and-forget: analytics must never break the site.
  db.insert(analyticsEvents)
    .values({
      type: parsed.data.type,
      path: parsed.data.path,
      referrer: parsed.data.referrer ?? null,
    })
    .catch(() => {});

  return new NextResponse(null, { status: 204 });
}
