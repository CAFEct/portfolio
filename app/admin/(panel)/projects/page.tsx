import Link from "next/link";
import { listProjectsAdmin } from "@/lib/queries";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteProject, moveProject, toggleProject } from "./actions";

const smallBtn = "btn-ghost !px-2.5 !py-1 text-xs";

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const rows = await listProjectsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Projetos</h1>
          <p className="mt-1 text-sm text-white/60">{rows.length} no total</p>
        </div>
        <Link href="/admin/projects/new" className="btn-aero">
          + Novo
        </Link>
      </div>

      {sp.error ? (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {sp.error}
        </p>
      ) : null}
      {sp.saved ? <p className="mt-4 text-sm text-emerald-300">Salvo.</p> : null}
      {sp.deleted ? <p className="mt-4 text-sm text-emerald-300">Excluído.</p> : null}

      <ul className="mt-6 space-y-3">
        {rows.map((p, i) => (
          <li key={p.id} className="glass flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {p.title}
                {p.isFeatured ? (
                  <span className="ml-2 rounded-full bg-amber-300/20 px-2 py-0.5 text-xs text-amber-200">
                    Destaque
                  </span>
                ) : null}
              </p>
              <p className="truncate text-sm text-white/60">/{p.slug}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                p.isVisible ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/50"
              }`}
            >
              {p.isVisible ? "Visível" : "Oculto"}
            </span>
            <div className="flex items-center gap-1">
              <form action={moveProject.bind(null, p.id, "up")}>
                <button type="submit" className={smallBtn} disabled={i === 0} aria-label="Subir">
                  ↑
                </button>
              </form>
              <form action={moveProject.bind(null, p.id, "down")}>
                <button type="submit" className={smallBtn} disabled={i === rows.length - 1} aria-label="Descer">
                  ↓
                </button>
              </form>
            </div>
            <form action={toggleProject.bind(null, p.id, "isFeatured")}>
              <button type="submit" className={smallBtn}>
                {p.isFeatured ? "Remover destaque" : "Destacar"}
              </button>
            </form>
            <form action={toggleProject.bind(null, p.id, "isVisible")}>
              <button type="submit" className={smallBtn}>
                {p.isVisible ? "Ocultar" : "Mostrar"}
              </button>
            </form>
            <Link href={`/admin/projects/${p.id}/edit`} className={smallBtn}>
              Editar
            </Link>
            <ConfirmButton
              action={deleteProject.bind(null, p.id)}
              confirmMessage={`Excluir "${p.title}"?`}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-200 transition hover:bg-red-500/15"
            >
              Excluir
            </ConfirmButton>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="glass p-6 text-center text-white/60">Nenhum projeto ainda.</li>
        ) : null}
      </ul>
    </div>
  );
}
