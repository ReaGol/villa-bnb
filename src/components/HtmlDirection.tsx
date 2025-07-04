"use client";
import { useEffect } from "react";
import { useLocale } from "next-intl";

export default function HtmlDirection() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
