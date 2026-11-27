import { getLocale } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locales";

export async function getContentLocale(): Promise<Locale> {
  const locale = await getLocale();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

/** Pick the localized variant, falling back to Portuguese when EN is empty. */
export function pickLocalized(
  pt: string | null | undefined,
  en: string | null | undefined,
  locale: string,
  es?: string | null,
): string {
  if (locale === "en" && en && en.trim()) return en;
  if (locale === "es" && es && es.trim()) return es;
  return pt ?? "";
}
