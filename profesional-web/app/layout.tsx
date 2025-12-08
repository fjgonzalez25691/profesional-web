import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Consultor Cloud & IA enfocado en P&L | Fran J. González",
  description:
    "Metodología transparente en 3 fases: Auditoría 48h, Roadmap ROI anti-camello y supervisión con garantía de impacto en P&L.",
  keywords: [
    "consultor cloud enfoque ROI",
    "reducir costes AWS metodología",
    "automatización procesos industriales",
    "auditoría cloud 48 horas",
    "consultor IA P&L",
    "optimización forecasting",
  ],
  openGraph: {
    title: "Metodología Transparente Cloud & IA | Fran J. González",
    description:
      "3 fases enfocadas en P&L: Auditoría Express 48h, Roadmap Priorizado ROI y Implementación Supervisada con garantía.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
