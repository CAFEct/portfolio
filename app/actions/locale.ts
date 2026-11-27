"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, LOCALE_COOKIE } from "@/lib/locales";

export async function setLocale(locale: string, path = "/") {
  if (isLocale(locale)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  const safePath = path.startsWith("/") ? path : "/";
  redirect(safePath);
}
