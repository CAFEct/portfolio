import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass max-w-md p-8 text-center">
        <p className="chrome-text font-display text-6xl font-extrabold">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-white/70">O endereço que você tentou acessar não existe.</p>
        <Link href="/" className="btn-aero mt-6 inline-flex">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
