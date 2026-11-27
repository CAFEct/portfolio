"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";
import { SubmitButton } from "@/components/admin/submit-button";

const inputClass =
  "w-full rounded-xl border border-sky-200 bg-white/80 px-4 py-2.5 text-[#06203f] placeholder-[#55738a] outline-none transition focus:border-sky-500 focus:bg-white";

export type ContactLabels = {
  nome: string;
  nomePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  mensagem: string;
  mensagemPlaceholder: string;
  enviar: string;
  enviado: string;
  erroValidacao: string;
};

const DEFAULT_LABELS: ContactLabels = {
  nome: "Nome",
  nomePlaceholder: "Seu nome",
  email: "E-mail",
  emailPlaceholder: "voce@email.com",
  mensagem: "Mensagem",
  mensagemPlaceholder: "Como posso ajudar?",
  enviar: "Enviar mensagem",
  enviado: "Mensagem enviada! Obrigado pelo contato — respondo em breve.",
  erroValidacao: "Preencha nome, e-mail válido e uma mensagem (mín. 10 caracteres).",
};

export default function ContactForm({
  labels = DEFAULT_LABELS,
  locale = "pt-BR",
}: {
  labels?: ContactLabels;
  locale?: string;
}) {
  const [state, formAction] = useActionState<ContactState, FormData>(sendMessage, { ok: false });

  if (state.ok) {
    return (
      <p className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-emerald-200">
        {labels.enviado}
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
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-[#173b59]">{labels.nome}</span>
          <input name="name" required maxLength={120} className={inputClass} placeholder={labels.nomePlaceholder} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[#173b59]">{labels.email}</span>
          <input name="email" type="email" required maxLength={200} className={inputClass} placeholder={labels.emailPlaceholder} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-[#173b59]">{labels.mensagem}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={inputClass} placeholder={labels.mensagemPlaceholder} />
      </label>
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <SubmitButton className="btn-aero w-full justify-center sm:w-auto">{labels.enviar}</SubmitButton>
    </form>
  );
}
