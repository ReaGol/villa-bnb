// app/layout.tsx
import { ReactNode } from "react";
import "../styles/globals.css";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='he'>
      <body
        dir='rtl'
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
