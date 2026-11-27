
import type { Metadata } from "next";
import { Exo_2, Nunito_Sans } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${exo.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
