"use client";

import { useTransition } from "react";
import { setLocale } from "@/app/actions/locale";
import { LOCALES } from "@/lib/locales";

const LABELS: Record<string, { code: string; flag: string }> = {
  "pt-BR": { code: "PT", flag: "🇧🇷" }, en: { code: "EN", flag: "🇺🇸" }, es: { code: "ES", flag: "🇪🇸" },
};

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const [pending, startTransition] = useTransition();

  function switchTo(next: string) {
    startTransition(async () => {
      await setLocale(next, window.location.pathname + window.location.search);
    });
  }

  return <label className="relative flex items-center rounded-full border border-white/80 bg-white/60 px-2 text-xs font-bold text-[#06203f] shadow-sm" aria-label="Selecionar idioma">
    <span aria-hidden="true">{LABELS[locale]?.flag ?? "🌐"}</span>
    <select value={locale} disabled={pending} onChange={(event) => switchTo(event.target.value)} className="appearance-none bg-transparent py-2 pl-1 pr-4 outline-none" aria-label="Language">
      {LOCALES.map((l) => <option key={l} value={l}>{LABELS[l].code}</option>)}
    </select>
    <span className="pointer-events-none absolute right-2">⌄</span>
  </label>;
}
