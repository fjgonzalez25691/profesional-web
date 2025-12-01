import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arquitecto P&L | Cloud & IA",
  description: "Landing de diagnóstico rápido con Next.js 16 y Neon PostgreSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
