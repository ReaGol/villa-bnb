import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// יצירת intl middleware לשפות
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // נכון לעכשיו, לא מפעילים AUTH0 כדי לא לשבור דפים

  // מפעילים intl בכל הנתיבים כרגיל
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!admin|api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
