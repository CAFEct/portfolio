import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import AdminNavLink from "@/components/AdminNavLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ResumeButton from "@/components/ResumeButton";
import { getSettings, visibleSections, DEFAULT_SETTINGS, type SectionId } from "@/lib/settings";

export default async function Navbar() {
  const [t, locale] = await Promise.all([getTranslations("nav"), getLocale()]);
  let settings;
  try { settings = await getSettings(); } catch { settings = DEFAULT_SETTINGS; }
  const visible = new Set(visibleSections(settings));
  const ids: SectionId[] = ["home", "sobre", "habilidades", "projetos", "experiencia", "videos", "contato", "certificados"];
  const links = ids.filter((id) => visible.has(id));
  const nav = <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
    {links.map((id) => <li key={id}>{id === "videos" ? <Link href="/videos" className="block whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-[#173b59] transition hover:bg-white/75 hover:text-[#0750c2]">{t(id)}</Link> : <a href={`#${id}`} className="block whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-[#173b59] transition hover:bg-white/75 hover:text-[#0750c2]">{t(id)}</a>}</li>)}
  </ul>;
  return <header className="fixed inset-x-0 top-2 z-50 px-3 md:top-3 md:px-5">
    <nav aria-label="Principal" className="glass mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full px-3 py-2 md:px-5">
      <Link href="#home" aria-label="Gabriel Felipe, início" className="shrink-0 px-2 text-3xl leading-none">☕</Link>
      <div className="hidden flex-1 justify-center lg:flex">{nav}</div>
      <div className="flex items-center gap-2"><LanguageSwitcher locale={locale} /><ResumeButton locale={locale} pdfUrl={settings.cvUrl} /><AdminNavLink /></div>
      <details className="relative lg:hidden">
        <summary aria-label="Abrir menu" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white bg-white/70 text-xl text-[#06203f]">☰</summary>
        <div className="glass absolute right-0 top-12 min-w-52 p-3">{nav}</div>
      </details>
    </nav>
  </header>;
}
