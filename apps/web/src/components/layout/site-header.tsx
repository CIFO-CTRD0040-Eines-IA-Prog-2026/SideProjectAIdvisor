import Image from "next/image";
import { HeaderAuth } from "@/components/auth/header-auth";

export interface SiteHeaderProps {
  readonly authenticated: boolean;
  readonly email: string | null;
}

/**
 * Shared site header rendered in the root layout (appears on every page).
 * Logo + state-aware auth control in the top-right region.
 */
export function SiteHeader({ authenticated, email }: SiteHeaderProps) {
  return (
    <header className="border-b px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="SideProjectAIdvisor" width={160} height={40} className="h-8 w-auto" priority />
          <span className="hidden text-sm font-mono text-muted-foreground sm:block">
            / proyectos que complementan tu perfil
          </span>
        </div>
        <HeaderAuth authenticated={authenticated} email={email} />
      </div>
    </header>
  );
}