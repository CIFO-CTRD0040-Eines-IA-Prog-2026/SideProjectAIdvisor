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
          <span className="font-mono text-xs tracking-widest px-2 py-1 bg-primary/10 text-primary border border-primary/25 rounded-sm">
            SIDE.DEV
          </span>
          <span className="hidden text-sm font-mono text-muted-foreground sm:block">
            / proyectos que complementan tu perfil
          </span>
        </div>
        <HeaderAuth authenticated={authenticated} email={email} />
      </div>
    </header>
  );
}