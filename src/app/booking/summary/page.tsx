"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function BookingSummaryPage() {
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const specialRequests = searchParams.get("specialRequests");

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-green-400'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
           סיכום ההזמנה שלך
        </h1>

        <div className='space-y-4 text-lg'>
          <div className='flex justify-between border-b pb-2'>
            <span className='font-semibold text-gray-600'>תאריך כניסה:</span>
            <span>
              {checkIn ? new Date(checkIn).toLocaleDateString("he-IL") : "-"}
            </span>
          </div>

          <div className='flex justify-between border-b pb-2'>
            <span className='font-semibold text-gray-600'>תאריך יציאה:</span>
            <span>
              {checkOut ? new Date(checkOut).toLocaleDateString("he-IL") : "-"}
            </span>
          </div>

          <div className='flex justify-between border-b pb-2'>
            <span className='font-semibold text-gray-600'>מבוגרים:</span>
            <span>{adults || "-"}</span>
          </div>

          <div className='flex justify-between border-b pb-2'>
            <span className='font-semibold text-gray-600'>ילדים:</span>
            <span>{children || "-"}</span>
          </div>

          <div className='border-b pb-2'>
            <span className='font-semibold text-gray-600 block mb-1'>
              בקשות מיוחדות:
            </span>
            <p className='text-gray-700 whitespace-pre-wrap'>
              {specialRequests && specialRequests.trim() !== ""
                ? specialRequests
                : "אין"}
            </p>
          </div>
        </div>

        <div className='mt-6 text-center'>
          <p className='text-green-700 font-semibold'>תודה שהזמנת אצלנו! 💚</p>
        </div>
      </div>
    </main>
  );
}
