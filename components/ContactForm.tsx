"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";
import { SubmitButton } from "@/components/admin/submit-button";

const inputClass =
  "w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none transition focus:border-cyan-300 focus:bg-white/15";

export default function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(sendMessage, { ok: false });

  if (state.ok) {
    return (
      <p className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-emerald-200">
        Mensagem enviada! Obrigado pelo contato — respondo em breve.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left">
      {/* Honeypot: hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-white/75">Nome</span>
          <input name="name" required maxLength={120} className={inputClass} placeholder="Seu nome" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-white/75">E-mail</span>
          <input name="email" type="email" required maxLength={200} className={inputClass} placeholder="voce@email.com" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-white/75">Mensagem</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={inputClass} placeholder="Como posso ajudar?" />
      </label>
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <SubmitButton className="btn-aero w-full justify-center sm:w-auto">Enviar mensagem</SubmitButton>
    </form>
  );
}
