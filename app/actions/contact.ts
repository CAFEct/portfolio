"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export type ContactState = { ok: boolean; error?: string };

async function notifyByEmail(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Nova mensagem de ${name}`,
        text: `${name} <${email}>\n\n${message}`,
      }),
    });
  } catch {
    // Email notification is best-effort; never block the form on it.
  }
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { ok: false, error: "Preencha nome, e-mail válido e uma mensagem (mín. 10 caracteres)." };
  }

  // Honeypot filled → silently accept, store nothing.
  if (parsed.data.website) return { ok: true };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`contact:${ip}`)) {
    return { ok: false, error: "Muitas mensagens enviadas. Tente novamente em alguns minutos." };
  }

  await db.insert(messages).values({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  await notifyByEmail(parsed.data.name, parsed.data.email, parsed.data.message);
  return { ok: true };
}
