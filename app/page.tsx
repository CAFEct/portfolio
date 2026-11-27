import AeroOrb from "@/components/AeroOrb";
import GlassCard from "@/components/GlassCard";

// Placeholder data. Later this comes from the database.
const projects = [
  {
    title: "CAFÉ Store",
    description: "E-commerce reescrito de PHP/MySQL para Next.js, com loja, painel e visual próprio.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: "EnergyOS",
    description: "App desktop com sistema gamificado de XP e ligas para acompanhar a rotina.",
    stack: ["Tauri v2", "React", "Rust"],
  },
  {
    title: "Tetris Arduino Edition",
    description: "Tetris na web controlado por dois Arduinos com Joystick Shield, para dois jogadores.",
    stack: ["Arduino", "JavaScript", "Web Serial"],
  },
];

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <h1 className="chrome-text font-display text-5xl font-extrabold leading-tight md:text-7xl">
            Gabriel, o dev por trás do CAFÉ
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Crio sites, apps e interfaces com cara de futuro e brilho de vidro. Este portfólio é o meu laboratório.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#projetos" className="btn-aero">
              Ver projetos
            </a>
            <a href="#contato" className="btn-ghost">
              Falar comigo
            </a>
          </div>
        </div>
        <AeroOrb />
      </section>

      <section id="sobre" className="mx-auto max-w-4xl px-6 py-20">
        <GlassCard>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Sobre mim</h2>
          <p className="mt-4 max-w-prose text-white/80">
            Sou desenvolvedor full-stack e criador de conteúdo em Curitiba. Trabalho com web, UI/UX e vídeo, e
            também atendo clientes com portfólios e projetos freelance.
          </p>
        </GlassCard>
      </section>

      <section id="projetos" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Projetos</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <GlassCard key={project.title}>
              <h3 className="font-display text-xl font-bold">{project.title}</h3>
              <p className="mt-3 text-white/75">{project.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                    {tech}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="certificados" className="mx-auto max-w-4xl px-6 py-20">
        <GlassCard className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Certificados</h2>
            <p className="mt-3 text-white/75">44 certificados em desenvolvimento e gestão.</p>
          </div>
          <a href="/certificados" className="btn-aero">
            Ver certificados
          </a>
        </GlassCard>
      </section>

      <section id="contato" className="mx-auto max-w-4xl px-6 pb-28 pt-20">
        <GlassCard className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Vamos construir algo juntos?</h2>
          <p className="mx-auto mt-3 max-w-prose text-white/75">
            Me chame para um projeto, uma parceria ou só para trocar ideia sobre código.
          </p>
          <a href="mailto:seu@email.com" className="btn-aero mt-8">
            Enviar e-mail
          </a>
        </GlassCard>
      </section>
    </>
  );
}
