export function isValidEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export function isWeakPassword(password: string): boolean {
  if (password.length < 8) return true;
  if (!/[A-Z]/.test(password)) return true;
  if (!/[a-z]/.test(password)) return true;
  if (!/[0-9]/.test(password)) return true;
  return false;
}

export function getPasswordError(password: string): string | null {
  if (password.length < 8) return "At least 8 characters";
  if (!/[A-Z]/.test(password)) return "Needs an uppercase letter";
  if (!/[a-z]/.test(password)) return "Needs a lowercase letter";
  if (!/[0-9]/.test(password)) return "Needs a number";
  return null;
}
