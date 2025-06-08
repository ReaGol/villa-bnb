"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("navbar");

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("gallery"), href: "/gallery" },
    { name: t("booking"), href: "/booking" },
    { name: t("recommendations"), href: "/recommendations" },
    { name: t("contact"), href: "/contact" },
    { name: t("admin"), href: "/admin" },
  ];

  return (
    <header className='bg-gray-100 shadow-md'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
        <Link
          href='/'
          className='flex items-center space-x-2 rtl:space-x-reverse'
        >
          <div className='w-10 h-10 relative rounded-full overflow-hidden'>
            <Image
              src='/view_logo.png'
              alt='לוגו וילה ביוון'
              fill
              sizes='(max-width: 768px) 120px, 160px'
              className='object-cover'
            />
          </div>
          <span
            className='text-xl text-green-700 md:text-2xl font-bold mr-2 rtl:mr-2'
            style={{ fontFamily: "var(--font-great-vibes)" }}
          >
            Dream Vacation in Greece
          </span>
        </Link>

        <nav className='hidden md:flex flex-wrap justify-end gap-x-4'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-gray-700 hover:text-green-700 font-medium'
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          className='md:hidden text-gray-700'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='פתח תפריט'
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <nav className='md:hidden bg-white shadow px-4 py-4 space-y-2 text-right'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='block text-gray-700 hover:text-green-700 font-medium'
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
