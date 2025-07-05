"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Recommendation = {
  name: string;
  stars: number;
  message: {
    he: string;
    en?: string;
  };
};

type Props = {
  recommendation: Recommendation;
  maxLength?: number;
};

export default function RecommendationCard({
  recommendation,
  maxLength = 200,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("recommendations");
  const [isExpanded, setIsExpanded] = useState(false);

  const rawMessage =
    recommendation.message?.[locale as "he" | "en"] ||
    recommendation.message?.he ||
    "";

  const isLong = rawMessage.length > maxLength;
  const displayMessage =
    isExpanded || !isLong ? rawMessage : rawMessage.slice(0, maxLength) + "...";

  return (
    <div className='bg-white p-6 rounded shadow flex flex-col justify-between h-full'>
      <div className='flex justify-between items-center mb-4'>
        <p
          className={`font-bold text-green-700 text-lg ${
            locale === "he" ? "text-right" : "text-left"
          }`}
        >
          {recommendation.name}
        </p>
        <div className='text-yellow-400 text-xl flex-shrink-0'>
          {Array.from({ length: recommendation.stars }, (_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      <p className='text-gray-700 mb-4 text-lg whitespace-pre-wrap'>
        "{displayMessage}"
      </p>

      <div className='mt-auto'>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-green-600 hover:underline font-semibold'
          >
            {isExpanded ? t("readLess") : t("readMore")}
          </button>
        )}
      </div>
    </div>
  );
}
