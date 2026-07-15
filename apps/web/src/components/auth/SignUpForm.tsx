"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AuthFormError } from "./AuthFormError";
import { PasswordInput } from "./PasswordInput";
import { signUp, type ActionResult } from "@/lib/auth/actions";
import { getPasswordError } from "@/lib/auth/validation";

export function SignUpForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(signUp, null);

  if (state?.success && "redirect" in state && state.redirect) {
    router.push(state.redirect);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
              required
              minLength={8}
              onChange={(e) => {
                const error = getPasswordError(e.target.value);
                if (error) {
                  e.target.setCustomValidity(error);
                } else {
                  e.target.setCustomValidity("");
                }
              }}
            />
          </div>
          <AuthFormError
            error={state && !state.success ? (state as Extract<ActionResult, { success: false }>).error : null}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
