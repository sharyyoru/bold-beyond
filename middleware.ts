import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Routes that require authentication (main app only)
const protectedRoutes = ["/dashboard", "/booking", "/my-appointments", "/perks", "/profile"];

// App routes - /appx main page requires auth, but these pages are public
const appxAuthPages = ["/appx/welcome", "/appx/login", "/appx/signup", "/appx/terms", "/appx/privacy", "/appx/onboarding"];

// Pages that should be accessible after external redirects (Stripe, etc)
const appxPublicPages = ["/appx/order/success", "/appx/order/failed", "/appx/booking/success", "/appx/booking/failed"];

// Admin and Partner routes handle their own authentication internally
// DO NOT protect these in middleware - they have separate session handling
const selfAuthRoutes = ["/admin", "/partners"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for admin and partner routes - they handle auth themselves
  const isSelfAuthRoute = selfAuthRoutes.some((route) => pathname.startsWith(route));
  if (isSelfAuthRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser();

  // Check if route requires auth
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if this is an appx auth page (public) or appx main page (protected)
  const isAppxAuthPage = appxAuthPages.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isAppxPublicPage = appxPublicPages.some((route) => pathname === route || pathname.startsWith(route));
  const isAppxMainPage = pathname === "/appx" || (pathname.startsWith("/appx/") && !isAppxAuthPage && !isAppxPublicPage);

  // For protected routes, redirect to welcome page
  if (isProtectedRoute && !user) {
    const welcomeUrl = new URL("/appx/welcome", request.url);
    welcomeUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(welcomeUrl);
  }

  // For appx main page, redirect to /appx/welcome if not authenticated
  if (isAppxMainPage && !user) {
    const welcomeUrl = new URL("/appx/welcome", request.url);
    welcomeUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(welcomeUrl);
  }

  // Redirect authenticated users away from appx auth pages to appx main
  if (isAppxAuthPage && user) {
    return NextResponse.redirect(new URL("/appx", request.url));
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
