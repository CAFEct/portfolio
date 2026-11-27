export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass px-8 py-6 text-center">
        <div className="chrome-text font-display text-2xl font-extrabold">CAFÉ</div>
        <p className="mt-2 animate-pulse text-sm text-white/60">Carregando…</p>
      </div>
    </main>
  );
}
