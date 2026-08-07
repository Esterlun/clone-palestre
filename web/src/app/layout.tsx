import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Clone Palestre",
  description: "Tracking degli allenamenti personali",
};

// Web app mobile-first (architecture.md, sezione 1): il viewport è impostato
// esplicitamente per adattarsi correttamente agli schermi degli smartphone.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/* Icone usate dalla navigazione (AppShell). Nessun pacchetto npm
            necessario: Material Symbols è distribuito come CSS da Google
            Fonts, come nei prototipi di riferimento in stitch-reference/. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- regola
            pensata per pages/_document.js; qui siamo nel root layout di App
            Router, l'unico punto globale equivalente, e Material Symbols non
            è supportato da next/font (non è un font Google standard). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={sora.variable}>{children}</body>
    </html>
  );
}
