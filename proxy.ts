import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/lib/i18n";

/**
 * Locale routing:
 * - `/en/...` is served as is.
 * - `/fr/...` redirects to the unprefixed URL, so French has one canonical address.
 * - Any other path is rewritten internally to `/fr/...`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
