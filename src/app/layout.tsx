import type { Metadata } from "next";
import { Montserrat, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import Tracker from "@/components/Tracker";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Ultramaille — Une maille d'exception, façonnée à Madagascar",
  description:
    "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${hankenGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>
        <Tracker />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
