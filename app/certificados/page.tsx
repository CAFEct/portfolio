import Link from "next/link";
import { getTranslations } from "next-intl/server";
import GlassCard from "@/components/GlassCard";
import { getContentLocale, pickLocalized } from "@/lib/i18n";
import { getCertificateCategories, getCertificatesPublic } from "@/lib/queries";

export default async function CertificadosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; pagina?: string }>;
}) {
  const [t, locale, sp] = await Promise.all([getTranslations("certificados"), getContentLocale(), searchParams]);
  const search = sp.q?.trim() ?? "";
  const category = sp.categoria?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(sp.pagina ?? "1", 10) || 1);

  const [categories, { rows, total, pageCount }] = await Promise.all([
    getCertificateCategories(),
    getCertificatesPublic({ search, category, page }),
  ]);

  const baseParams = new URLSearchParams();
  if (search) baseParams.set("q", search);
  if (category) baseParams.set("categoria", category);
  const pageHref = (p: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("pagina", String(p));
    return `/certificados?${params.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="chrome-text font-display text-5xl font-extrabold">{t("titulo")}</h1>
      <p className="mt-3 text-white/70">{t("encontrados", { count: total })}</p>

      <form method="get" action="/certificados" className="glass mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-1 block text-white/70">{t("buscar")}</span>
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder={t("buscarPlaceholder")}
            className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-cyan-300"
          />
        </label>
        <label className="text-sm sm:w-56">
          <span className="mb-1 block text-white/70">{t("categoria")}</span>
          <select
            name="categoria"
            defaultValue={category}
            className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white outline-none focus:border-cyan-300"
          >
            <option value="">{t("todas")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-aero justify-center">
          {t("filtrar")}
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="glass mt-8 p-8 text-center text-white/60">{t("vazio")}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <li key={c.id}>
              <GlassCard className="flex h-full flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{c.category}</p>
                <h2 className="mt-2 font-display text-lg font-bold">
                  {pickLocalized(c.title, c.titleEn, locale)}
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  {[c.issuer, c.year].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-auto flex gap-2 pt-5">
                  {c.pdfUrl ? (
                    <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5 text-xs" data-track="pdf_download">
                      {t("pdf")}
                    </a>
                  ) : null}
                  {c.credentialUrl ? (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5 text-xs">
                      {t("verificar")}
                    </a>
                  ) : null}
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginação">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="btn-ghost !px-4 !py-2 text-sm">
              {t("anterior")}
            </Link>
          ) : null}
          <span className="text-sm text-white/60">{t("pagina", { page, total: pageCount })}</span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} className="btn-ghost !px-4 !py-2 text-sm">
              {t("proxima")}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
