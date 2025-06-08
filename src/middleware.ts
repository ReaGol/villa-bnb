import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!admin|api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.gif$|.*\\.webp$).*)",
  ],
};

