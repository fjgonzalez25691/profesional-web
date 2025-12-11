import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  weight: ["400", "600", "700"],
});

// FJG-57: Edge caching para páginas estáticas
// Nota: app/page.tsx es client component, por lo que este revalidate
// aplica principalmente a páginas legales y otras rutas estáticas
export const revalidate = 3600; // 1 hora
const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Francisco Javier González Aparicio";

export const metadata: Metadata = {
  metadataBase: new URL("https://fjgaparicio.es"),
  title: {
    default: `${businessName} - Soluciones Cloud & IA`,
    template: `%s | ${businessName}`,
  },
  description:
    "Reduzco factura cloud (AWS/Azure) 30-70% y automatizo procesos manuales. Empresas 5-50M€. Payback <6 meses. Metodología anti-camello enfocada P&L.",
  keywords: [
    "consultor cloud ROI",
    "reducir costes AWS",
    "automatización procesos industriales",
    "optimización factura Azure",
    "auditoría cloud 48 horas",
    "consultor DevOps España",
    "reducción costes cloud payback",
  ],
  authors: [{ name: businessName }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://fjgaparicio.es",
    siteName: `${businessName} - Consultor Cloud & Automatización`,
    title: "Reducción Cloud & Automatización | Payback <6 meses",
    description:
      "Reduzco factura cloud 30-70% y automatizo procesos. Empresas 5-50M€. Metodología anti-camello.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${businessName} - Reducción Costes Cloud`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessName} - Reducción Costes Cloud`,
    description: "Reduzco factura cloud 30-70%. Payback <6 meses.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: businessName,
  description: "Consultor Cloud & Automatización",
  url: "https://fjgaparicio.es",
  image: "https://fjgaparicio.es/og-image.png",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
  },
  areaServed: "ES",
  priceRange: "€€",
  sameAs: ["https://linkedin.com/in/fjgaparicio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme')||'olive';document.documentElement.dataset.theme=s;}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
