"use client";

import { useRef } from "react";

export default function ResumeButton({ locale, pdfUrl = "" }: { locale: string; pdfUrl?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pt = locale === "pt-BR";
  const en = locale === "en";
  return <>
    <button type="button" onClick={() => dialog.current?.showModal()} className="btn-aero !px-3 !py-2 text-xs sm:!px-4 sm:text-sm">↓ <span>{pt ? "Currículo" : en ? "Resume" : "CV"}</span></button>
    <dialog ref={dialog} aria-label={pt ? "Currículo de Gabriel Felipe" : en ? "Gabriel Felipe's resume" : "Currículum de Gabriel Felipe"} className="resume-dialog m-auto w-[min(94vw,900px)] max-w-none rounded-3xl border border-white/80 bg-white/95 p-0 text-[#06203f] shadow-2xl backdrop:bg-[#06203f]/50">
      <div className="flex items-start justify-between gap-4 p-5 md:p-7"><div><p className="text-xs font-bold uppercase tracking-widest text-[#0b5ed7]">{pt ? "Documento profissional" : en ? "Professional document" : "Documento profesional"}</p><h2 className="mt-1 font-display text-2xl font-bold">{pt ? "Currículo de Gabriel Felipe" : en ? "Gabriel Felipe's Resume" : "Currículum de Gabriel Felipe"}</h2><p className="mt-1 text-sm">{pt ? "Visualize o currículo abaixo ou baixe uma cópia em PDF." : en ? "Preview the resume below or download a PDF copy." : "Consulta el currículum o descarga una copia en PDF."}</p></div><button type="button" aria-label="Fechar" onClick={() => dialog.current?.close()} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-100 text-xl">×</button></div>
      <div className="h-[65vh] border-y border-sky-100 bg-sky-50">{pdfUrl ? <iframe src={pdfUrl} title="Currículo de Gabriel Felipe" className="h-full w-full" /> : <p className="grid h-full place-items-center p-8 text-center">{pt ? "O currículo em PDF será exibido aqui quando for enviado no painel administrativo." : en ? "The PDF resume will appear here after it is uploaded in the admin panel." : "El currículum PDF aparecerá aquí cuando se cargue desde el panel de administración."}</p>}</div>
      <div className="flex flex-wrap gap-3 p-5">{pdfUrl ? <><a className="btn-aero" href={pdfUrl} download>↓ {pt ? "Baixar currículo em PDF" : en ? "Download PDF resume" : "Descargar PDF"}</a><a className="btn-ghost" href={pdfUrl} target="_blank" rel="noreferrer">↗ {pt ? "Abrir em nova página" : en ? "Open in a new page" : "Abrir en otra página"}</a></> : null}</div>
    </dialog>
  </>;
}
