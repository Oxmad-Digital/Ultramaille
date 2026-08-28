import type { Metadata } from "next";
import { Montserrat, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import Tracker from "@/components/Tracker";
import { CONTACT, SITE_URL } from "@/lib/site";
import "./globals.css";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ultramaille",
  legalName: "ULTRAMAILLE S.A",
  url: SITE_URL,
  logo: `${SITE_URL}/ultramaille-logo.svg`,
  description:
    "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.streetAddress,
    addressLocality: CONTACT.addressLocality,
    postalCode: CONTACT.postalCode,
    addressCountry: CONTACT.addressCountry,
  },
  telephone: CONTACT.telephone,
  email: CONTACT.email,
  sameAs: [
    "https://www.facebook.com/ULTRAMAILLEKNIT",
    "https://www.instagram.com/ultramaille_mg/",
    "https://www.linkedin.com/company/ultramaille",
    "https://www.youtube.com/@ultramaillesa5724",
  ],
};

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
  metadataBase: new URL(SITE_URL),
  title: "Ultramaille — Une maille d'exception, façonnée à Madagascar",
  description:
    "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ultramaille — Une maille d'exception, façonnée à Madagascar",
    description:
      "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
    url: SITE_URL,
    siteName: "Ultramaille",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultramaille — Une maille d'exception, façonnée à Madagascar",
    description:
      "Spécialistes de la maille à Antananarivo, Madagascar. Tricot, crochet et broderie pour les plus grandes maisons de mode.",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <Tracker />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
