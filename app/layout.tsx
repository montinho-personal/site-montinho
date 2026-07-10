import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CookieBanner from "@/components/layout/CookieBanner";

const dmSans = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.montinhopersonal.com.br"),
  applicationName: "Montinho Personal Trainer",
  title: {
    default: "Personal Trainer Alphaville | Montinho",
    template: "%s | Montinho Personal Trainer",
  },
  description:
    "Personal Trainer em Alphaville especialista em emagrecimento. Resultados reais sem fórmulas mágicas. Ciência, experiência e acompanhamento próximo.",
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
    title: "Personal Trainer Alphaville | Montinho",
    description:
      "Personal Trainer em Alphaville especialista em emagrecimento. Resultados reais sem fórmulas mágicas. Ciência, experiência e acompanhamento próximo.",
    images: [
      {
        url: "https://www.montinhopersonal.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Montinho Personal Trainer — Alphaville, Barueri e Santana de Parnaíba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Trainer Alphaville | Montinho",
    description:
      "Personal Trainer em Alphaville especialista em emagrecimento. Resultados reais sem fórmulas mágicas.",
    images: ["https://www.montinhopersonal.com.br/og-image.jpg"],
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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Montinho Personal Trainer",
  alternateName: "Montinho Personal",
  image: "https://www.montinhopersonal.com.br/og-image.jpg",
  logo: "https://www.montinhopersonal.com.br/brand-icon.png",
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
  sameAs: ["https://www.instagram.com/montinhopersonal/"],
  priceRange: "$$",
  "@id": "https://www.montinhopersonal.com.br/#localbusiness",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Montinho Personal Trainer",
  alternateName: "Montinho Personal",
  url: "https://www.montinhopersonal.com.br/",
  "@id": "https://www.montinhopersonal.com.br/#website",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.montinhopersonal.com.br/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Montinho",
  jobTitle: "Personal Trainer",
  url: "https://www.montinhopersonal.com.br/minha-historia",
  sameAs: ["https://www.instagram.com/montinhopersonal/"],
  worksFor: {
    "@id": "https://www.montinhopersonal.com.br/#localbusiness",
  },
  "@id": "https://www.montinhopersonal.com.br/#person",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${playfair.variable}`}
    >
      <head>
        {/* Google Tag Manager — o mais alto possível no <head> (snippet oficial) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TDKJMPMR');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white antialiased">
        {/* Google Tag Manager (noscript) — imediatamente após a abertura do <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TDKJMPMR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieBanner />
        {/* GA4 instalado diretamente (pré-GTM). Ao configurar a tag GA4 dentro
            do GTM (GTM-TDKJMPMR), remover este bloco para evitar pageviews
            duplicados. Futuras tags (Google Ads, Remarketing, Clarity, Meta
            Pixel) devem ser adicionadas exclusivamente via GTM. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J1ZSPMDJZE"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J1ZSPMDJZE');`}
        </Script>
      </body>
    </html>
  );
}
