import type { Metadata } from "next";
import { Exo_2, Nunito_Sans } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

const exo = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  weight: ["500", "700", "800"],
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Gabriel | CAFÉ",
  description: "Portfólio de Gabriel: desenvolvedor full-stack, UI/UX e criador de conteúdo.",
};

function NavbarFallback() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass flex items-center rounded-full px-5 py-2">
        <span className="chrome-text font-display text-lg font-extrabold">CAFÉ</span>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${exo.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main>{children}</main>
      </body>
    </html>
  );
}
