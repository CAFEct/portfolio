"use client";

import { useState } from "react";

const FILTERS = ["Todos", "Front-end", "Back-end", "Full-Stack"];

export default function ProjectFilters() {
  const [active, setActive] = useState("Todos");
  function choose(filter: string) {
    setActive(filter);
    document.querySelectorAll<HTMLElement>("[data-project-category]").forEach((card) => {
      const visible = filter === "Todos" || card.dataset.projectCategory === filter;
      card.hidden = !visible;
    });
    const empty = document.getElementById("project-filter-empty");
    if (empty) empty.hidden = filter !== "Todos" && filter !== "Full-Stack";
  }
  return <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar projetos">{FILTERS.map((filter) => <button key={filter} type="button" aria-pressed={active === filter} onClick={() => choose(filter)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${active === filter ? "border-[#0750c2] bg-[#0750c2] text-white shadow-md" : "border-white bg-white/70 text-[#173b59] hover:-translate-y-0.5 hover:bg-white"}`}>{filter}</button>)}</div>;
}
