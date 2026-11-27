import { listMessagesAdmin } from "@/lib/queries";
import ConfirmButton from "@/components/ConfirmButton";
import GlassCard from "@/components/GlassCard";
import { deleteMessage, toggleMessageRead } from "./actions";

export default async function MessagesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const sp = await searchParams;
  const rows = await listMessagesAdmin();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Mensagens</h1>
      <p className="mt-1 text-sm text-white/60">{rows.length} no total</p>
      {sp.deleted ? <p className="mt-4 text-sm text-emerald-300">Mensagem excluída.</p> : null}

      {rows.length === 0 ? (
        <p className="glass mt-8 p-8 text-center text-white/60">Nenhuma mensagem ainda.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((m) => (
            <li key={m.id}>
              <GlassCard className={!m.isRead ? "border-cyan-300/60" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {m.name}
                      {!m.isRead ? (
                        <span className="ml-2 rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-black">
                          Nova
                        </span>
                      ) : null}
                    </p>
                    <a href={`mailto:${m.email}`} className="text-sm text-cyan-200 hover:underline">
                      {m.email}
                    </a>
                    <p className="mt-1 text-xs text-white/50">
                      {new Date(m.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={toggleMessageRead.bind(null, m.id)}>
                      <button type="submit" className="btn-ghost !px-3 !py-1.5 text-xs">
                        {m.isRead ? "Marcar não lida" : "Marcar lida"}
                      </button>
                    </form>
                    <ConfirmButton
                      action={deleteMessage.bind(null, m.id)}
                      confirmMessage="Excluir esta mensagem?"
                      className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-200 transition hover:bg-red-500/15"
                    >
                      Excluir
                    </ConfirmButton>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-line text-white/85">{m.message}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
