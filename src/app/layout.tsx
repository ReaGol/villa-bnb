import { ReactNode } from "react";
import "../styles/globals.css";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import { headers } from "next/headers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "he";

  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
