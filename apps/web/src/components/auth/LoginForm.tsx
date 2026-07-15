"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AuthFormError } from "./AuthFormError";
import { PasswordInput } from "./PasswordInput";
import { signIn, type ActionResult } from "@/lib/auth/actions";

export function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(signIn, null);

  if (state?.success && "redirect" in state && state.redirect) {
    router.push(state.redirect);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
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
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex justify-end">
            <a
              href="/reset-password"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <AuthFormError
            error={state && !state.success ? (state as Extract<ActionResult, { success: false }>).error : null}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in..." : "Log In"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
