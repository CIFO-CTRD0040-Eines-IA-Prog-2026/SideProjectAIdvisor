"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult =
  | { success: true; redirect?: string; message?: string }
  | { success: false; error: string };

function isWeakPassword(password: string): boolean {
  if (password.length < 8) return true;
  if (!/[A-Z]/.test(password)) return true;
  if (!/[a-z]/.test(password)) return true;
  if (!/[0-9]/.test(password)) return true;
  return false;
}

export async function signUp(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: "Invalid email format" };
  }

  if (isWeakPassword(password)) {
    return {
      success: false,
      error: "Password does not meet requirements",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.includes("already")) {
      return { success: false, error: "Email already in use" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, redirect: "/" };
}

export async function signIn(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email?.trim() || !password) {
    return { success: false, error: "Invalid email or password" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "Invalid email or password" };
  }

  revalidatePath("/", "layout");
  return { success: true, redirect: "/" };
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No active session" };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email") as string;

  if (email?.trim()) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect_to=/update-password`,
    });
  }

  return {
    success: true,
    message: "If an account exists, a reset link has been sent",
  } as ActionResult;
}

export async function updatePassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const password = formData.get("password") as string;

  if (isWeakPassword(password)) {
    return {
      success: false,
      error: "Password does not meet requirements",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (error.message.includes("expired") || error.message.includes("invalid")) {
      return { success: false, error: "Reset link expired or invalid" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, redirect: "/" };
}
