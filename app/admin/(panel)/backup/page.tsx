import GlassCard from "@/components/GlassCard";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import { importBackup } from "./actions";

export default async function BackupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Backup</h1>
      <p className="mt-1 text-sm text-white/60">
        Exporte todo o conteúdo do site como JSON ou restaure a partir de um backup anterior.
      </p>

      {sp.error ? (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {sp.error}
        </p>
      ) : null}
      {sp.saved ? <p className="mt-4 text-sm text-emerald-300">Backup importado com sucesso.</p> : null}

      <div className="mt-8 grid gap-6">
        <GlassCard>
          <h2 className="font-display text-xl font-bold text-cyan-200">Exportar</h2>
          <p className="mt-2 text-sm text-white/70">
            Baixa um arquivo JSON com certificados, projetos, experiência, habilidades, vídeos, mensagens e
            configurações.
          </p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download */}
          <a href="/api/admin/export" className="btn-aero mt-4 inline-flex">
            Baixar backup
          </a>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-xl font-bold text-cyan-200">Importar</h2>
          <p className="mt-2 text-sm text-white/70">
            Substitui <strong>todo</strong> o conteúdo atual pelos dados do arquivo. Esta ação não pode ser
            desfeita.
          </p>
          <form action={importBackup} className="mt-4 space-y-4">
            <input
              type="file"
              name="file"
              accept="application/json,.json"
              required
              className="block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
            <ConfirmSubmit
              message="Importar substitui TODO o conteúdo atual. Continuar?"
              className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/15"
            >
              Importar e substituir tudo
            </ConfirmSubmit>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
