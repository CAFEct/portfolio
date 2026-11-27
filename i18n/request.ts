import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/lib/locales";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get(LOCALE_COOKIE)?.value;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
