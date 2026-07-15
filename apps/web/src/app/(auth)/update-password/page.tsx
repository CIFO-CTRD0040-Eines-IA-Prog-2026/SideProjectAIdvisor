import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Update password — SIDE.DEV",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
