import type { Metadata } from "next";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "SIDE.DEV — Proyectos para tu oferta",
  description:
    "Analiza una oferta de trabajo y recibe 3 side projects adaptados al stack requerido — con roadmap detallado para cada uno.",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}