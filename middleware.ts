import { auth } from "@/auth";
import { NextResponse } from "next/server";

// CRITICAL FIX: Centralized route protection
// Protects all routes under /(app) from unauthenticated access
export default auth((req: any) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes - require authentication
  const protectedPaths = [
    "/dashboard",
    "/editor",
    "/settings",
  ];

  // Check if current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect to home if accessing protected route without auth
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

// Configure which routes this middleware runs on
export const config = {
  // Run on all routes except static files and API routes
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
