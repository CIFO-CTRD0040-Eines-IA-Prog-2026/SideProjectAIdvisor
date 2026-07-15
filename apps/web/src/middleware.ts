import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { PUBLIC_ROUTES } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response, user } = await updateSession(request);

  if (!user && !PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
