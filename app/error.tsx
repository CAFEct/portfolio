"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass max-w-md p-8 text-center">
        <h1 className="chrome-text font-display text-3xl font-extrabold">Algo deu errado</h1>
        <p className="mt-3 text-white/70">
          Ocorreu um erro inesperado. Tente novamente — se persistir, me avise.
        </p>
        <button type="button" onClick={reset} className="btn-aero mt-6">
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
