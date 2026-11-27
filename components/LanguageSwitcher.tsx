"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, LOCALES } from "@/lib/locales";

const LABELS: Record<string, string> = { "pt-BR": "PT", en: "EN" };

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: string) {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
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
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
