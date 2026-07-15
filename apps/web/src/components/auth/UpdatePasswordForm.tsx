"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AuthFormError } from "./AuthFormError";
import { PasswordInput } from "./PasswordInput";
import { updatePassword, type ActionResult } from "@/lib/auth/actions";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(updatePassword, null);

  if (state?.success && "redirect" in state && state.redirect) {
    router.push(state.redirect);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Update password</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
              required
              minLength={8}
            />
          </div>
          <AuthFormError
            error={state && !state.success ? (state as Extract<ActionResult, { success: false }>).error : null}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
