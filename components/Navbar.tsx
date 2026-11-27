import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import AdminNavLink from "@/components/AdminNavLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ResumeButton from "@/components/ResumeButton";
import NavItems from "@/components/NavItems";
import Image from "next/image";
import { getSettings, visibleSections, DEFAULT_SETTINGS, type SectionId } from "@/lib/settings";

export default async function Navbar() {
  const [t, locale] = await Promise.all([getTranslations("nav"), getLocale()]);
  let settings;
  try { settings = await getSettings(); } catch { settings = DEFAULT_SETTINGS; }
  const visible = new Set(visibleSections(settings));
  const ids: SectionId[] = ["home", "sobre", "habilidades", "projetos", "experiencia", "videos", "contato", "certificados"];
  const links = ids.filter((id) => visible.has(id));
  const navItems = links.map((id) => ({ id, label: t(id) }));
  return <header className="fixed inset-x-0 top-2 z-50 px-3 md:top-3 md:px-5">
    <nav aria-label="Principal" className="glass mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full px-3 py-2 md:px-5">
      <Link href="#home" aria-label="Gabriel Felipe, início" className="shrink-0 px-2"><Image src="/images/coffee-cup.svg" alt="CAFÉ" width={42} height={42} priority /></Link>
      <div className="hidden flex-1 justify-center lg:flex"><NavItems items={navItems} /></div>
      <div className="flex items-center gap-2"><LanguageSwitcher locale={locale} /><ResumeButton locale={locale} pdfUrl={settings.cvUrl} /><AdminNavLink /></div>
      <details className="relative lg:hidden">
        <summary aria-label="Abrir menu" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white bg-white/70 text-xl text-[#06203f]">☰</summary>
        <div className="glass absolute right-0 top-12 min-w-52 p-3"><NavItems items={navItems} /></div>
      </details>
    </nav>
  </header>;
}
