import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — SIDE.DEV",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
