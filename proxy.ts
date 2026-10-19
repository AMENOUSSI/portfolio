import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import { defaultLocale, hasLocale } from "@/lib/i18n";

/**
 * Admin: everything under /admin except the login page needs a valid session
 * (pages and actions check it again; this only avoids rendering for nobody).
 *
 * Locale routing for the public site:
 * - `/en/...` is served as is.
 * - `/fr/...` redirects to the unprefixed URL, so French has one canonical address.
 * - Any other path is rewritten internally to `/fr/...`.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return;
    const email = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (email) return;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const segment = pathname.split("/")[1] ?? "";

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url);
  }

  if (hasLocale(segment)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and any file with an extension (images, favicon, PDFs…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
