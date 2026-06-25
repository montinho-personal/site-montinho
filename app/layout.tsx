import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Montinho Personal Trainer | Alphaville, Barueri e Santana de Parnaíba",
    template: "%s | Montinho Personal Trainer",
  },
  description:
    "Personal Trainer especialista em emagrecimento em Alphaville, Barueri e Santana de Parnaíba. Consultoria online para todo o Brasil. Transformação real do corpo através de ciência, experiência prática e acompanhamento próximo.",
  keywords: [
    "Personal Trainer Alphaville",
    "Personal Trainer Barueri",
    "Personal Trainer Santana de Parnaíba",
    "Consultoria Online Emagrecimento",
    "Personal Trainer para Emagrecimento",
    "Emagrecimento Alphaville",
    "Treino Online Brasil",
    "Personal Trainer Online",
  ],
  authors: [{ name: "Montinho Personal Trainer" }],
  creator: "Montinho Personal Trainer",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.montinhopersonal.com.br",
    siteName: "Montinho Personal Trainer",
    title:
      "Montinho Personal Trainer | Alphaville, Barueri e Santana de Parnaíba",
    description:
      "Personal Trainer especialista em emagrecimento em Alphaville. Transformação real do corpo através de ciência e acompanhamento próximo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Montinho Personal Trainer | Alphaville",
    description:
      "Transforme seu corpo sem fórmulas mágicas. Personal Trainer em Alphaville e online em todo o Brasil.",
  },
  verification: {
    google: "GY5qVJsmTgcHb8sJfYzc9QaWmc9zfvT71hhFbGwV8OM",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.montinhopersonal.com.br",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Montinho Personal Trainer",
  description:
    "Personal Trainer especialista em emagrecimento em Alphaville, Barueri e Santana de Parnaíba. Consultoria online para todo o Brasil.",
  url: "https://www.montinhopersonal.com.br",
  telephone: "+5511981063409",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Alphaville",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -23.5017,
    longitude: -46.8567,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:00",
      closes: "13:00",
    },
  ],
  sameAs: ["https://instagram.com/montinho_personal"],
  priceRange: "$$",
  "@id": "https://www.montinhopersonal.com.br/#localbusiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white antialiased">
        <Header />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
