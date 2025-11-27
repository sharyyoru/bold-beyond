import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/booking", "/my-appointments", "/perks", "/profile"];
const portalRoutes = ["/portal"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  // Update session
  const response = await updateSession(request);
  
  const { pathname } = request.nextUrl;

  // Check if route requires auth
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPortalRoute = portalRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For protected routes, check if user is authenticated
  if (isProtectedRoute || isPortalRoute || isAdminRoute) {
    // Get auth cookie to check if user is logged in
    const authCookie = request.cookies.get("sb-gtcypwxtubzzpeuzhevw-auth-token");
    
    if (!authCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) {
    const authCookie = request.cookies.get("sb-gtcypwxtubzzpeuzhevw-auth-token");
    if (authCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
