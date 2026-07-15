"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AuthFormError } from "./AuthFormError";
import { resetPassword, type ActionResult } from "@/lib/auth/actions";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, null);

  const successMessage =
    state?.success ? (state as Extract<ActionResult, { success: true }>).message : null;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}
          <AuthFormError
            error={state && !state.success ? (state as Extract<ActionResult, { success: false }>).error : null}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending..." : "Send Reset Link"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
