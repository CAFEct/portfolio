const links = [
  { label: "Home", href: "#home" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Certificados", href: "#certificados" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav aria-label="Principal" className="glass flex max-w-full items-center gap-1 rounded-full px-3 py-2">
        <a href="#home" className="chrome-text px-3 font-display text-lg font-extrabold">
          CAFÉ
        </a>
        <ul className="flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block whitespace-nowrap rounded-full px-3 py-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
