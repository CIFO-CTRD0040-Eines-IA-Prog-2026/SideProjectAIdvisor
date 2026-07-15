export function UserAvatar({ email }: { readonly email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      aria-label={email}
    >
      {initial}
    </div>
  );
}
