import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="glass max-w-md p-8 text-center">
      <p className="chrome-text font-display text-5xl font-extrabold">404</p>
      <h1 className="mt-4 font-display text-xl font-bold">Registro não encontrado</h1>
      <Link href="/admin" className="btn-aero mt-6 inline-flex">
        Voltar ao dashboard
      </Link>
    </div>
  );
}
