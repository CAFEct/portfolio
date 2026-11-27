import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import AdminNavLink from "@/components/AdminNavLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getSettings, visibleSections, DEFAULT_SETTINGS, type SectionId } from "@/lib/settings";

export default async function Navbar() {
  const [t, locale] = await Promise.all([getTranslations("nav"), getLocale()]);

  let settings;
  try {
    settings = await getSettings();
  } catch {
    settings = DEFAULT_SETTINGS;
  }
  const visible = new Set(visibleSections(settings));
  const ids: SectionId[] = ["sobre", "projetos", "experiencia", "habilidades", "videos", "certificados", "contato"];
  const links = ids.filter((id) => visible.has(id));

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label="Principal"
        className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full px-3 py-2"
      >
        <Link href="#home" className="chrome-text shrink-0 px-3 font-display text-lg font-extrabold">
          CAFÉ
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="block whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                {t(id)}
              </a>
            </li>
          ))}
          <li>
            <LanguageSwitcher locale={locale} />
          </li>
          <AdminNavLink />
        </ul>
      </nav>
    </header>
  );
}
