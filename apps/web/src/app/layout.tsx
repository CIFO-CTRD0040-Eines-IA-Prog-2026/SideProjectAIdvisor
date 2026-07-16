import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "SIDE.DEV — Proyectos para tu oferta",
  description:
    "Analiza una oferta de trabajo y recibe 3 side projects adaptados al stack requerido — con roadmap detallado para cada uno.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Resolve session server-side to avoid a logged-out→logged-in flash (FR-010).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <SiteHeader
          authenticated={Boolean(user)}
          email={user?.email ?? null}
        />
        {children}
      </body>
    </html>
  );
}