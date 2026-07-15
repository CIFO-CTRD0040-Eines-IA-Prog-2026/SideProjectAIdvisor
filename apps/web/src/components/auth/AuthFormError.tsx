export function AuthFormError({ error }: { readonly error: string | null }) {
  if (!error) return null;

  return (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  );
}
