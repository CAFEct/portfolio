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

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/25 p-0.5 text-xs">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          disabled={pending}
          onClick={() => switchTo(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2.5 py-1 font-semibold transition ${
            locale === l ? "bg-cyan-300 text-black" : "text-white/70 hover:text-white"
          }`}
        >
          <span aria-hidden="true">{LABELS[l].flag}</span> {LABELS[l].code}
        </button>
      ))}
    </div>
  );
}
