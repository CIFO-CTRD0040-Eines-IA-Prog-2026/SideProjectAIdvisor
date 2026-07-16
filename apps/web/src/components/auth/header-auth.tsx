"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { SignOutButton } from "@/components/auth/SignOutButton";

export interface HeaderAuthProps {
  readonly authenticated: boolean;
  readonly email: string | null;
}

/**
 * State-aware authentication control for the shared site header.
 * - Logged-out: "Log in" button linking to /login (accessible name, keyboard-reachable).
 * - Logged-in: account indicator (email initial) + Sign Out control.
 * State is server-resolved and passed in to avoid a logged-out→logged-in flash (FR-010).
 */
export function HeaderAuth({ authenticated, email }: HeaderAuthProps) {
  if (!authenticated) {
    return (
      <Button asChild variant="default" size="sm" aria-label="Log in">
        <Link href="/login">Log in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2" aria-label={email ?? "Signed in"}>
        <UserAvatar email={email ?? ""} />
        <span className="hidden text-sm text-muted-foreground sm:block">
          {email}
        </span>
      </span>
      <SignOutButton />
    </div>
  );
}