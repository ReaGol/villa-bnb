import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Dream Vacation in Greece",
  description: "A website for a dream vacation in Greece villa b&b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='he' dir='rtl'>
      <body
    
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
