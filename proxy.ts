import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "./lib/auth/getServerSession";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authSession = await getServerSession()

  const isAuthenticated = !!authSession;
  const isAdmin = authSession?.user?.role === "admin";
  const isCustomer = authSession?.user?.role === "customer";

  // Public routes (no auth required)
  const publicRoutes = ["/sign-in", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Redirect authenticated users away from sign-in
    if (isAuthenticated && pathname === "/sign-in") {
      const redirectTo = isAdmin ? "/dashboard" : "/";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }

  // Protected routes (auth required)
  if (!isAuthenticated) {
    // Store the original URL to redirect back after login
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Customer-only routes (orders, checkout)
  if (pathname.startsWith("/orders") || pathname === "/checkout") {
    if (isCustomer || isAdmin) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/users")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Dashboard routes (admin/manager only, no customers)
  if (pathname.startsWith("/dashboard")) {
    if (isCustomer) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Admin and managers can access
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/checkout",
    "/orders/:path*", // Add orders protection
  ],
};
