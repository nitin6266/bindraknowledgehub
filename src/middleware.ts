import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { PUBLIC_ROUTES, PROTECTED_ROUTE_PREFIXES, ROLE_ROUTES } from "@/constants/routes";
import { getUserRole } from "@/lib/auth/role";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Expose the pathname to server components for role-aware guards.
  request.headers.set("x-pathname", pathname);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Authenticated users should not access login/forgot-password pages.
  if (user && isPublicRoute && pathname !== "/reset-password") {
    const role = await getUserRole();
    const target = role ? ROLE_ROUTES[role] ?? "/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Unauthenticated users must be redirected away from protected routes.
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * ERP routes only. The public marketing website is intentionally excluded
     * so Supabase Auth is never invoked for visitor traffic.
     */
    "/login/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/dashboard/:path*",
  ],
};
