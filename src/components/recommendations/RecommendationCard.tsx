"use client";

import { useState } from "react";

type Recommendation = {
  name: string;
  stars: number;
  message: string;
};

type Props = {
  recommendation: Recommendation;
  maxLength?: number;
};

export default function RecommendationCard({
  recommendation,
  maxLength = 200,
}: Props) {
  const { name, stars, message } = recommendation;
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = message.length > maxLength;
  const displayMessage =
    isExpanded || !isLong ? message : message.slice(0, maxLength) + "...";

  return (
    <div className='bg-white p-6 rounded shadow text-right flex flex-col justify-between h-full'>
      <div className='flex justify-between items-center mb-4'>
        <p className='font-bold text-green-700 text-lg'>{name}</p>
        <div className='text-yellow-400 text-xl flex-shrink-0'>
          {Array.from({ length: stars }, (_, i) => (
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
            {isExpanded ? "הסתר" : "קראו עוד"}
          </button>
        )}
      </div>
    </div>
  );
}
