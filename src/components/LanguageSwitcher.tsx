"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const supportedLocales = ["he", "en"];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale = locale === "he" ? "en" : "he";
    if (!supportedLocales.includes(newLocale)) return;
    const segments = pathname.split("/");
    if (supportedLocales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || "/";
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={toggleLocale}
      className='bg-green-600 text-white px-2 py-2 rounded shadow hover:bg-green-700 transition'
      disabled={isPending}
      aria-label='Switch language'
    >
      {locale === "he" ? "EN" : "HE"}
    </button>
  );
}
