import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!admin|api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
