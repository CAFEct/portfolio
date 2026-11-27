import Link from "next/link";
import { listSkillsAdmin } from "@/lib/queries";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteSkill, toggleSkill } from "./actions";

export default async function SkillsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string; deleted?: string }>;
}) {
  const sp = await searchParams;
  const rows = await listSkillsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Habilidades</h1>
          <p className="mt-1 text-sm text-white/60">{rows.length} no total</p>
        </div>
        <Link href="/admin/skills/new" className="btn-aero">+ Nova</Link>
      </div>

      {sp.error ? (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">{sp.error}</p>
      ) : null}
      {sp.saved ? <p className="mt-4 text-sm text-emerald-300">Salvo.</p> : null}
      {sp.deleted ? <p className="mt-4 text-sm text-emerald-300">Excluído.</p> : null}

      <ul className="mt-6 space-y-3">
        {rows.map((s) => (
          <li key={s.id} className="glass flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-white/60">
                {s.category} · {s.level}%
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.isVisible ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/50"}`}>
              {s.isVisible ? "Visível" : "Oculto"}
            </span>
            <form action={toggleSkill.bind(null, s.id)}>
              <button type="submit" className="btn-ghost !px-3 !py-1.5 text-xs">
                {s.isVisible ? "Ocultar" : "Mostrar"}
              </button>
            </form>
            <Link href={`/admin/skills/${s.id}/edit`} className="btn-ghost !px-3 !py-1.5 text-xs">Editar</Link>
            <ConfirmButton
              action={deleteSkill.bind(null, s.id)}
              confirmMessage={`Excluir "${s.name}"?`}
              className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-200 transition hover:bg-red-500/15"
            >
              Excluir
            </ConfirmButton>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="glass p-6 text-center text-white/60">Nenhuma habilidade ainda.</li>
        ) : null}
      </ul>
    </div>
  );
}
