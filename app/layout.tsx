import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow CMS - Estúdios Flow",
  description: "Sistema de gerenciamento de podcast personalizado para Estúdios Flow - Gerencie episódios, convidados e patrocinadores",
  keywords: ["Flow Podcast", "Estúdios Flow", "Podcast CMS", "Gestão de Podcast", "Brasil"],
  authors: [{ name: "Estúdios Flow" }],
  openGraph: {
    title: "Flow CMS - Estúdios Flow",
    description: "Sistema de gerenciamento de podcast do maior hub de conteúdo do Brasil",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
